#!/usr/bin/env node
/**
 * capture-gifs.mjs — Record animated GIFs for interactive AO3 effects.
 * Uses Playwright for frame capture, ffmpeg for GIF assembly.
 *
 * Output: assets/demos/<effect>.gif
 * Usage:
 *   node tools/capture-gifs.mjs            # all effects
 *   node tools/capture-gifs.mjs envelope   # one effect
 */
import { execSync } from 'child_process';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { chromium } from 'playwright';
import { join, dirname, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const THIS_FILE = fileURLToPath(import.meta.url);

const DEFAULT_CAPTURE = {
  captureSelector: '#workskin',
  viewport: { width: 1400, height: 1400 },
  outputWidth: 560,
  paletteColors: 192,
  settleMs: 500,
  fps: 10,
  measureDurationMs: 1200,
  sampleIntervalMs: 80,
  durationMs: 4500,
};

export const EFFECTS = {
  'envelope': {
    interactionSelector: '#workskin .envelope > .trigger',
  },
  'chat-messages': {
    interactionSelector: '#workskin .chat > .trigger',
  },
  'polaroid': {
    interactionSelector: '#workskin .polaroid > .trigger',
  },
  'secret-divider': {
    interactionSelector: '#workskin .secret-divider > .trigger',
  },
  'typewriter': {
    interactionSelector: '#workskin .typewriter > .trigger',
  },
  'marginalia': {
    interactionSelector: '#workskin .marginalia > .trigger',
  },
  'casefile': {
    interactionSelector: '#workskin .casefile > .trigger',
  },
  'route-map': {
    interactionSelector: '#workskin .route-map > .trigger',
  },
};

function effectNames() {
  return Object.keys(EFFECTS);
}

function unknownEffectError(name) {
  return new Error(`Unknown effect: ${name}\nValid: ${effectNames().join(', ')}`);
}

function validateResolvedEffectConfig(name, config) {
  if (typeof config.captureSelector !== 'string' || config.captureSelector.length === 0) {
    throw new Error(`Invalid capture selector for effect ${name}`);
  }
  if (typeof config.interactionSelector !== 'string' || config.interactionSelector.length === 0) {
    throw new Error(`Invalid interaction selector for effect ${name}`);
  }
  if (
    !config.viewport ||
    !Number.isFinite(config.viewport.width) ||
    config.viewport.width <= 0 ||
    !Number.isFinite(config.viewport.height) ||
    config.viewport.height <= 0
  ) {
    throw new Error(`Invalid viewport for effect ${name}`);
  }

  for (const field of ['outputWidth', 'fps', 'measureDurationMs', 'sampleIntervalMs', 'durationMs']) {
    if (!Number.isFinite(config[field]) || config[field] <= 0) {
      throw new Error(`Invalid ${field} for effect ${name}`);
    }
  }

  if (!Number.isInteger(config.paletteColors) || config.paletteColors < 2 || config.paletteColors > 256) {
    throw new Error(`Invalid paletteColors for effect ${name}`);
  }

  if (!Number.isFinite(config.settleMs) || config.settleMs < 0) {
    throw new Error(`Invalid settleMs for effect ${name}`);
  }

  return config;
}

export function resolveEffectConfig(name) {
  const effect = EFFECTS[name];
  if (!effect) {
    throw unknownEffectError(name);
  }

  const viewport = effect.viewport ?? {};

  return validateResolvedEffectConfig(name, {
    ...DEFAULT_CAPTURE,
    ...effect,
    viewport: {
      ...DEFAULT_CAPTURE.viewport,
      ...viewport,
    },
  });
}

function evenCeil(value) {
  const rounded = Math.ceil(value);
  return rounded % 2 === 0 ? rounded : rounded + 1;
}

export function computeClipRect(...boxes) {
  const definedBoxes = boxes.filter(Boolean);
  if (definedBoxes.length === 0) {
    throw new Error('computeClipRect requires at least one bounding box');
  }

  const left = Math.min(...definedBoxes.map((box) => box.x));
  const top = Math.min(...definedBoxes.map((box) => box.y));
  const right = Math.max(...definedBoxes.map((box) => box.x + box.width));
  const bottom = Math.max(...definedBoxes.map((box) => box.y + box.height));

  const x = Math.floor(left);
  const y = Math.floor(top);

  return {
    x,
    y,
    width: evenCeil(right - x),
    height: evenCeil(bottom - y),
  };
}

export async function measureCaptureClip(page, options) {
  const {
    captureSelector,
    interactionSelector = captureSelector,
    measureDurationMs = 320,
    sampleIntervalMs = 80,
    resetMs = 120,
  } = options;

  const captureEl = page.locator(captureSelector).first();
  const interactionEl = interactionSelector ? page.locator(interactionSelector).first() : null;

  await captureEl.waitFor({ state: 'visible' });
  if (interactionEl) {
    await interactionEl.waitFor({ state: 'visible' });
  }

  const closedBox = await captureEl.boundingBox();
  if (!closedBox) {
    throw new Error(`Element not found: ${captureSelector}`);
  }

  if (interactionEl) {
    await interactionEl.click({ force: true });
  }
  const boxes = [closedBox];

  let elapsed = 0;
  while (elapsed < measureDurationMs) {
    const waitMs = Math.min(sampleIntervalMs, measureDurationMs - elapsed);
    await page.waitForTimeout(waitMs);
    elapsed += waitMs;

    const sampledBox = await captureEl.boundingBox();
    if (sampledBox) {
      boxes.push(sampledBox);
    }
  }

  if (interactionEl) {
    await interactionEl.click({ force: true });
  }
  await page.waitForTimeout(resetMs);

  return computeClipRect(...boxes);
}

export async function resetCaptureState(page, pageUrl, settleMs = 0) {
  await page.goto(pageUrl);
  if (settleMs > 0) {
    await page.waitForTimeout(settleMs);
  }
}

export function previewUrlForEffect(name) {
  return pathToFileURL(join(root, 'effects', name, 'preview.html')).href;
}

async function captureEffect(page, name, cfg) {
  const { captureSelector, interactionSelector = captureSelector, fps, durationMs } = cfg;
  if (!captureSelector) {
    throw new Error(`Missing capture selector for effect ${name}`);
  }

  const interval = Math.round(1000 / fps);
  const totalFrames = Math.floor(durationMs / interval);
  const openFrame = Math.floor(totalFrames * 0.15);
  const closeFrame = Math.floor(totalFrames * 0.75);

  const framesDir = join(root, '.playwright-mcp', `frames-${name}`);
  if (existsSync(framesDir)) rmSync(framesDir, { recursive: true });
  mkdirSync(framesDir, { recursive: true });

  const pageUrl = previewUrlForEffect(name);
  await resetCaptureState(page, pageUrl, cfg.settleMs);
  const clip = await measureCaptureClip(page, {
    captureSelector,
    interactionSelector,
    measureDurationMs: cfg.measureDurationMs,
    sampleIntervalMs: cfg.sampleIntervalMs,
    resetMs: cfg.resetMs ?? interval,
  });
  await resetCaptureState(page, pageUrl, cfg.settleMs);
  const interactionEl = interactionSelector ? page.locator(interactionSelector).first() : null;
  if (interactionEl) {
    await interactionEl.waitFor({ state: 'visible' });
  }

  for (let i = 0; i < totalFrames; i++) {
    if (i === openFrame) {
      if (interactionEl) {
        await interactionEl.click({ force: true });
      }
    }
    if (i === closeFrame) {
      if (interactionEl) {
        await interactionEl.click({ force: true });
      }
    }
    const framePath = join(framesDir, `frame-${String(i).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath, clip, scale: 'device' });
    await page.waitForTimeout(interval);
  }

  return { framesDir, fps, outputWidth: cfg.outputWidth, paletteColors: cfg.paletteColors };
}

function buildGif(framesDir, outputPath, fps, outputWidth, paletteColors) {
  const palette = join(framesDir, 'palette.png');
  const pattern = join(framesDir, 'frame-%04d.png');
  execSync(
    `ffmpeg -y -framerate ${fps} -i "${pattern}" -vf "scale=${outputWidth}:-1:flags=lanczos,palettegen=max_colors=${paletteColors}:stats_mode=diff" "${palette}"`,
    { stdio: 'pipe' }
  );
  execSync(
    `ffmpeg -y -framerate ${fps} -i "${pattern}" -i "${palette}" -lavfi "scale=${outputWidth}:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=sierra2_4a:diff_mode=rectangle" -loop 0 "${outputPath}"`,
    { stdio: 'pipe' }
  );
}

export async function main(argv = process.argv.slice(2)) {
  const target = argv[0];
  const names = target ? [target] : effectNames();

  const browser = await chromium.launch();

  try {
    for (const name of names) {
      const cfg = resolveEffectConfig(name);
      process.stdout.write(`Capturing ${name}...`);
      const context = await browser.newContext({
        viewport: cfg.viewport,
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();
      const { framesDir, fps, outputWidth, paletteColors } = await captureEffect(page, name, cfg);
      await context.close();

      const outputPath = join(root, 'assets', 'demos', `${name}.gif`);
      buildGif(framesDir, outputPath, fps, outputWidth, paletteColors);
      console.log(` done -> assets/demos/${name}.gif`);
    }
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === THIS_FILE) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
