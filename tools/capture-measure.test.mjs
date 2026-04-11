import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { measureCaptureClip, resetCaptureState } from './capture-gif-clip.mjs';
import { EFFECTS } from './capture-gif-config.mjs';
import { startCaptureServer } from './capture-server.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('chat capture measurement includes the expanded conversation height', async () => {
  const effect = EFFECTS['chat-messages'];
  assert.ok(effect.hoverSelector, 'chat-messages should expose a deterministic hover target');

  const server = startCaptureServer(ROOT, 0);
  await once(server, 'listening');
  const { port } = server.address();
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: effect.viewport,
      deviceScaleFactor: 2,
    });

    const url = `http://127.0.0.1:${port}/effects/chat-messages/preview.html`;
    await resetCaptureState(page, url, effect.settleMs);

    const clip = await measureCaptureClip(page, {
      captureSelector: effect.captureSelector,
      hoverSelector: effect.hoverSelector,
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
    server.close();
  }
});
