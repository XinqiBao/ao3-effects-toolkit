import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EFFECTS, measureCaptureClip, resetCaptureState, startCaptureServer } from './capture-gifs.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('capture reset restores the envelope preview to a fully closed first frame', async () => {
  const effect = EFFECTS.envelope;
  const captureSelector = effect.captureSelector;
  const hoverSelector = effect.hoverSelector;
  assert.ok(captureSelector, 'envelope should expose a deterministic capture frame');
  assert.ok(hoverSelector, 'envelope should expose a deterministic hover target');
  const server = startCaptureServer(ROOT, 0);
  await once(server, 'listening');
  const { port } = server.address();
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: effect.viewport,
      deviceScaleFactor: 2,
    });

    const url = `http://127.0.0.1:${port}/effects/envelope/preview.html`;
    await resetCaptureState(page, url, effect.settleMs);
    const closedBox = await page.locator(captureSelector).first().boundingBox();
    assert.ok(closedBox, 'closed capture frame should be measurable');
    const closedLetterBox = await page.locator(hoverSelector).first().boundingBox();
    assert.ok(closedLetterBox, 'closed hover target should be measurable');

    await measureCaptureClip(page, {
      captureSelector,
      hoverSelector,
      measureDurationMs: effect.measureDurationMs,
      sampleIntervalMs: effect.sampleIntervalMs,
      resetMs: 100,
    });

    const dirtyBox = await page.locator(captureSelector).first().boundingBox();
    const dirtyLetterBox = await page.locator(hoverSelector).first().boundingBox();
    assert.ok(dirtyBox, 'measured capture frame should remain measurable');
    assert.ok(dirtyLetterBox, 'hover target should remain measurable after capture measurement');
    assert.ok(
      dirtyLetterBox.height > closedLetterBox.height + 100,
      'short reset waits should leave the envelope itself partially opened before capture starts'
    );

    await resetCaptureState(page, url, effect.settleMs);
    const resetBox = await page.locator(captureSelector).first().boundingBox();
    const resetLetterBox = await page.locator(hoverSelector).first().boundingBox();
    assert.ok(resetBox, 'reset capture frame should be measurable');
    assert.ok(resetLetterBox, 'reset hover target should be measurable');
    assert.ok(
      Math.abs(resetBox.height - closedBox.height) <= 2,
      'reset should restore the closed capture height before screenshots begin'
    );
    assert.ok(
      Math.abs(resetLetterBox.height - closedLetterBox.height) <= 2,
      'reset should restore the closed envelope height before screenshots begin'
    );
  } finally {
    await browser.close();
    server.close();
  }
});
