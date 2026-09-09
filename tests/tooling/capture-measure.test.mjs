import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

import { measureCaptureClip, previewUrlForEffect, resetCaptureState, resolveEffectConfig } from '../../tools/capture-gifs.mjs';

test('chat capture measurement includes the expanded conversation height', async () => {
  const effect = resolveEffectConfig('chat-messages');
  assert.ok(effect.interactionSelector, 'chat-messages should expose a deterministic interaction target');

  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: effect.viewport,
      deviceScaleFactor: 2,
    });

    const url = previewUrlForEffect('chat-messages');
    await resetCaptureState(page, url, effect.settleMs);

    const clip = await measureCaptureClip(page, {
      captureSelector: effect.captureSelector,
      interactionSelector: effect.interactionSelector,
      measureDurationMs: effect.measureDurationMs,
      sampleIntervalMs: effect.sampleIntervalMs,
      resetMs: 100,
    });

    assert.ok(
      clip.height >= 300,
      'chat clip should include the expanded exchange, not just the pinned preview bar'
    );
  } finally {
    await browser.close();
  }
});
