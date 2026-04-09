import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { measureCaptureClip, resetCaptureState } from './capture-gif-clip.mjs';
import { EFFECTS, FAMILY_PRESETS } from './capture-gif-config.mjs';
import { startCaptureServer } from './capture-server.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('chat capture measurement includes the expanded conversation height', async () => {
  const effect = EFFECTS['chat-messages'];
  assert.ok(effect.toggleSelector, 'chat-messages should expose a deterministic capture toggle target');
  assert.ok(effect.openClass, 'chat-messages should expose a deterministic open-state class for capture');

  const server = startCaptureServer(ROOT, 0);
  await once(server, 'listening');
  const { port } = server.address();
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: FAMILY_PRESETS.standard.viewport,
      deviceScaleFactor: 2,
    });

    const url = `http://127.0.0.1:${port}/chat-messages/preview.html`;
    await resetCaptureState(page, url, FAMILY_PRESETS.standard.settleMs);

    const clip = await measureCaptureClip(page, {
      captureSelector: '[data-panel="desktop-closed"] [data-capture-frame]',
      hoverSelector: effect.hoverSelector,
      toggleSelector: effect.toggleSelector,
      openClass: effect.openClass,
      measureDurationMs: FAMILY_PRESETS.standard.measureDurationMs,
      sampleIntervalMs: FAMILY_PRESETS.standard.sampleIntervalMs,
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
