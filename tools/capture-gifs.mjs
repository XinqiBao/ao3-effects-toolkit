#!/usr/bin/env node
/**
 * capture-gifs.mjs — Record animated GIFs for each AO3 effect.
 * Uses Playwright for frame capture, ffmpeg for GIF assembly.
 *
 * Output: assets/demos/<effect>.gif
 * Usage:
 *   node tools/capture-gifs.mjs            # all effects
 *   node tools/capture-gifs.mjs envelope   # one effect
 */
import { execSync } from 'child_process';
import { once } from 'events';
import { createServer } from 'http';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { chromium } from 'playwright';
import { extname, join, dirname, resolve, sep } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const THIS_FILE = fileURLToPath(import.meta.url);

export const EFFECTS = {
  'envelope': {
    captureSelector: '#workskin',
    hoverSelector: '#workskin.envelope-preview .trifold-letter',
    viewport: { width: 1400, height: 1600 },
    outputWidth: 488,
    settleMs: 450,
    fps: 10,
    measureDurationMs: 1120,
    sampleIntervalMs: 80,
    durationMs: 4000,
  },
  'chat-messages': {
    captureSelector: '#workskin',
    hoverSelector: '.preview-card .chat-conversation--hover',
    viewport: { width: 1400, height: 1200 },
    outputWidth: 488,
    settleMs: 400,
    fps: 10,
    measureDurationMs: 720,
    sampleIntervalMs: 80,
    durationMs: 4000,
  },
  'polaroid': {
    captureSelector: '#workskin',
    hoverSelector: '.preview-card .polaroid-inner.polaroid--hover',
    viewport: { width: 1400, height: 1200 },
    outputWidth: 488,
    settleMs: 400,
    fps: 10,
    measureDurationMs: 720,
    sampleIntervalMs: 80,
    durationMs: 4000,
  },
  'secret-divider': {
    captureSelector: '#workskin',
    hoverSelector: '.preview-card .secret-divider--hover',
    viewport: { width: 1400, height: 1200 },
    outputWidth: 488,
    settleMs: 400,
    fps: 10,
    measureDurationMs: 720,
    sampleIntervalMs: 80,
    durationMs: 4000,
  },
  'typewriter': {
    captureSelector: '#workskin',
    hoverSelector: '.preview-card .typewriter--hover',
    viewport: { width: 1400, height: 1400 },
    outputWidth: 488,
    settleMs: 450,
    fps: 10,
    measureDurationMs: 1120,
    sampleIntervalMs: 80,
    durationMs: 4500,
  },
};

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
};

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
    hoverSelector = captureSelector,
    measureDurationMs = 320,
    sampleIntervalMs = 80,
    resetMs = 120,
  } = options;

  const captureEl = page.locator(captureSelector).first();
  const interactionEl = hoverSelector ? page.locator(hoverSelector).first() : null;

  await captureEl.waitFor({ state: 'visible' });
  if (interactionEl) {
    await interactionEl.waitFor({ state: 'visible' });
  }

  const closedBox = await captureEl.boundingBox();
  if (!closedBox) {
    throw new Error(`Element not found: ${captureSelector}`);
  }

  if (interactionEl) {
    await interactionEl.hover({ force: true });
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
    await page.mouse.move(0, 0);
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

export function contentTypeForPath(filePath) {
  return MIME[extname(filePath)] || 'application/octet-stream';
}

export function resolveRequestPath(rootPath, requestUrl) {
  const pathname = decodeURIComponent(requestUrl.split('?')[0] || '/');
  const filePath = resolve(rootPath, `.${pathname}`);
  const rootPrefix = rootPath.endsWith(sep) ? rootPath : `${rootPath}${sep}`;

  return filePath === rootPath || filePath.startsWith(rootPrefix) ? filePath : null;
}

export function startCaptureServer(rootPath, port) {
  const server = createServer((req, res) => {
    try {
      const filePath = resolveRequestPath(rootPath, req.url || '/');
      if (!filePath) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      const data = readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentTypeForPath(filePath) });
      res.end(data);
    } catch (error) {
      if (error instanceof URIError) {
        res.writeHead(400);
        res.end('Bad Request');
        return;
      }

      res.writeHead(404);
      res.end('Not found');
    }
  });

  server.listen(port);
  return server;
}

async function captureEffect(page, name, cfg) {
  const { captureSelector, hoverSelector = captureSelector, fps, durationMs } = cfg;
  if (!captureSelector) {
    throw new Error(`Missing capture selector for effect ${name}`);
  }

  const interval = Math.round(1000 / fps);
  const totalFrames = Math.floor(durationMs / interval);
  const hoverInFrame  = Math.floor(totalFrames * 0.15);
  const hoverOutFrame = Math.floor(totalFrames * 0.75);

  const framesDir = join(root, '.playwright-mcp', `frames-${name}`);
  if (existsSync(framesDir)) rmSync(framesDir, { recursive: true });
  mkdirSync(framesDir, { recursive: true });

  const pageUrl = `http://127.0.0.1:${cfg.port}/effects/${name}/preview.html`;
  await resetCaptureState(page, pageUrl, cfg.settleMs);
  const clip = await measureCaptureClip(page, {
    captureSelector,
    hoverSelector,
    measureDurationMs: cfg.measureDurationMs,
    sampleIntervalMs: cfg.sampleIntervalMs,
    resetMs: cfg.resetMs ?? interval,
  });
  await resetCaptureState(page, pageUrl, cfg.settleMs);
  const interactionEl = hoverSelector ? page.locator(hoverSelector).first() : null;
  if (interactionEl) {
    await interactionEl.waitFor({ state: 'visible' });
  }

  for (let i = 0; i < totalFrames; i++) {
    if (i === hoverInFrame) {
      if (interactionEl) {
        await interactionEl.hover({ force: true });
      }
    }
    if (i === hoverOutFrame) {
      if (interactionEl) {
        await page.mouse.move(0, 0);
      }
    }
    const framePath = join(framesDir, `frame-${String(i).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath, clip, scale: 'device' });
    await page.waitForTimeout(interval);
  }

  return { framesDir, fps, outputWidth: cfg.outputWidth };
}

function buildGif(framesDir, outputPath, fps, outputWidth) {
  const palette = join(framesDir, 'palette.png');
  const pattern = join(framesDir, 'frame-%04d.png');
  execSync(
    `ffmpeg -y -framerate ${fps} -i "${pattern}" -vf "scale=${outputWidth}:-1:flags=lanczos,palettegen=max_colors=128:stats_mode=diff" "${palette}"`,
    { stdio: 'pipe' }
  );
  execSync(
    `ffmpeg -y -framerate ${fps} -i "${pattern}" -i "${palette}" -lavfi "scale=${outputWidth}:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=sierra2_4a:diff_mode=rectangle" -loop 0 "${outputPath}"`,
    { stdio: 'pipe' }
  );
}

export async function main(argv = process.argv.slice(2)) {
  const target = argv[0];
  if (target && !EFFECTS[target]) {
    console.error(`Unknown effect: ${target}\nValid: ${Object.keys(EFFECTS).join(', ')}`);
    process.exit(1);
  }
  const effects = target ? { [target]: EFFECTS[target] } : EFFECTS;

  const port = 7892;
  const server = startCaptureServer(root, port);
  await once(server, 'listening');
  const browser = await chromium.launch();

  try {
    for (const [name, cfg] of Object.entries(effects)) {
      process.stdout.write(`Capturing ${name}...`);
      const context = await browser.newContext({
        viewport: cfg.viewport,
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();
      const { framesDir, fps, outputWidth } = await captureEffect(page, name, { ...cfg, port });
      await context.close();

      const outputPath = join(root, 'assets', 'demos', `${name}.gif`);
      buildGif(framesDir, outputPath, fps, outputWidth);
      console.log(` done -> assets/demos/${name}.gif`);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === THIS_FILE) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
