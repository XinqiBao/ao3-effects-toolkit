import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { measureCaptureClip, resetCaptureState } from './capture-gif-clip.mjs';
import { startCaptureServer } from './capture-server.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('capture reset restores the envelope preview to a fully closed first frame', async () => {
  const server = startCaptureServer(ROOT, 0);
  await once(server, 'listening');
  const { port } = server.address();
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1400, height: 1600 },
      deviceScaleFactor: 2,
    });

    const url = `http://127.0.0.1:${port}/effects/envelope/preview.html`;
    const captureSelector = '[data-panel="desktop-closed"] [data-capture-frame]';
    const hoverSelector = '[data-panel="desktop-closed"] .trifold-letter--hover';

    await resetCaptureState(page, url, 450);
    const closedBox = await page.locator(captureSelector).first().boundingBox();
    assert.ok(closedBox, 'closed capture frame should be measurable');

    await measureCaptureClip(page, {
      captureSelector,
      hoverSelector,
      measureDurationMs: 1120,
      sampleIntervalMs: 80,
      resetMs: 100,
    });

    const dirtyBox = await page.locator(captureSelector).first().boundingBox();
    assert.ok(dirtyBox, 'measured capture frame should remain measurable');
    assert.ok(
      dirtyBox.height > closedBox.height + 100,
      'short reset waits should leave the envelope partially opened before capture starts'
    );

    await resetCaptureState(page, url, 450);
    const resetBox = await page.locator(captureSelector).first().boundingBox();
    assert.ok(resetBox, 'reset capture frame should be measurable');
    assert.ok(
      Math.abs(resetBox.height - closedBox.height) <= 2,
      'reset should restore the closed capture height before screenshots begin'
    );
  } finally {
    await browser.close();
    server.close();
  }
});
