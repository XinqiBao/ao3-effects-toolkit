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
import { chromium } from 'playwright';
import { execSync } from 'child_process';
import { mkdirSync, rmSync, existsSync } from 'fs';
import { once } from 'events';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { measureCaptureClip, resetCaptureState } from './capture-gif-clip.mjs';
import { EFFECTS } from './capture-gif-config.mjs';
import { startCaptureServer } from './capture-server.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');

async function captureEffect(page, name, cfg) {
  const canonicalSelector = cfg.targetSelector ?? cfg.captureSelector ?? cfg.hoverSelector;
  if (!canonicalSelector) {
    throw new Error(`Missing target selector for effect ${name}`);
  }
  const captureSelector = cfg.captureSelector ?? canonicalSelector;
  const hoverSelector = cfg.hoverSelector ?? canonicalSelector;
  const fps = cfg.fps;
  const durationMs = cfg.durationMs;
  const interval = Math.round(1000 / fps);
  const totalFrames = Math.floor(durationMs / interval);
  const hoverInFrame  = Math.floor(totalFrames * 0.15);
  const hoverOutFrame = Math.floor(totalFrames * 0.75);

  const framesDir = join(root, '.playwright-mcp', `frames-${name}`);
  if (existsSync(framesDir)) rmSync(framesDir, { recursive: true });
  mkdirSync(framesDir, { recursive: true });

  const pageUrl = `http://localhost:${cfg.port}/effects/${name}/preview.html`;
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

async function main() {
  const target = process.argv[2];
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

main().catch(e => { console.error(e.message); process.exit(1); });
