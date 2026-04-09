import test from 'node:test';
import assert from 'node:assert/strict';
import { EFFECTS, FAMILY_PRESETS } from './capture-gif-config.mjs';

test('chat-messages capture window stays long enough to sample the expanded stack', () => {
  const family = EFFECTS['chat-messages'].family;
  const measureDurationMs =
    EFFECTS['chat-messages'].measureDurationMs ?? FAMILY_PRESETS[family].measureDurationMs;

  assert.ok(
    measureDurationMs >= 640,
    'chat-messages needs a measure window that outlasts its delayed full-height expansion'
  );
});
