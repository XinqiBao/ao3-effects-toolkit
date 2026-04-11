import test from 'node:test';
import assert from 'node:assert/strict';
import { EFFECTS } from './capture-gif-config.mjs';

test('chat-messages capture window stays long enough to sample the expanded stack', () => {
  const measureDurationMs = EFFECTS['chat-messages'].measureDurationMs;

  assert.ok(
    measureDurationMs >= 640,
    'chat-messages needs a measure window that outlasts its delayed full-height expansion'
  );
});
