import test from 'node:test';
import assert from 'node:assert/strict';

import { computeClipRect, measureCaptureClip } from './capture-gif-clip.mjs';

test('computeClipRect unions pre-hover and hovered boxes from the same panel', () => {
  const clip = computeClipRect(
    { x: 120.8, y: 611.98, width: 458, height: 74 },
    { x: 120.8, y: 385.44, width: 458, height: 528.06 }
  );

  assert.deepEqual(clip, {
    x: 120,
    y: 385,
    width: 460,
    height: 530,
  });
});

test('computeClipRect keeps the full union on even pixel dimensions', () => {
  const clip = computeClipRect(
    { x: 100.7, y: 200.2, width: 401.3, height: 201.7 },
    { x: 98.3, y: 190.4, width: 392.2, height: 210.4 }
  );

  assert.deepEqual(clip, {
    x: 98,
    y: 190,
    width: 404,
    height: 212,
  });
});

test('measureCaptureClip unions progressive hover growth across the full measure window', async () => {
  const actions = [];
  let hovered = false;
  let sampleIndex = 0;

  const closedBox = { x: 196, y: 612, width: 458, height: 74 };
  const hoveredBoxes = [
    { x: 196, y: 475.34, width: 458, height: 420 },
    { x: 196, y: 443.25, width: 458, height: 484.18 },
    { x: 196, y: 405.54, width: 458, height: 559.6 },
    { x: 196, y: 355.34, width: 458, height: 660 },
  ];

  const captureLocator = {
    first() { return this; },
    async waitFor() {},
    async boundingBox() {
      if (!hovered) return closedBox;
      return hoveredBoxes[Math.min(sampleIndex, hoveredBoxes.length - 1)];
    },
  };

  const hoverLocator = {
    first() { return this; },
    async waitFor() {},
    async hover() {
      actions.push('hover');
      hovered = true;
    },
  };

  const page = {
    locator(selector) {
      if (selector === 'capture') return captureLocator;
      if (selector === 'hover') return hoverLocator;
      throw new Error(`Unexpected selector: ${selector}`);
    },
    mouse: {
      async move(x, y) {
        actions.push(`move:${x},${y}`);
        hovered = false;
      },
    },
    async waitForTimeout(ms) {
      actions.push(`wait:${ms}`);
      if (hovered) sampleIndex += 1;
    },
  };

  const clip = await measureCaptureClip(page, {
    captureSelector: 'capture',
    hoverSelector: 'hover',
    measureDurationMs: 320,
    sampleIntervalMs: 80,
    resetMs: 60,
  });

  assert.deepEqual(clip, {
    x: 196,
    y: 355,
    width: 458,
    height: 662,
  });
  assert.deepEqual(actions, [
    'hover',
    'wait:80',
    'wait:80',
    'wait:80',
    'wait:80',
    'move:0,0',
    'wait:60',
  ]);
});
