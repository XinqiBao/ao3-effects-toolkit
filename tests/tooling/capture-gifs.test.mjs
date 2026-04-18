import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

import * as captureGifs from '../../tools/capture-gifs.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PUBLISHED_EFFECTS = readdirSync(join(ROOT, 'effects'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== '_shared')
  .map((entry) => entry.name)
  .sort();

test('previewUrlForEffect resolves a local file URL for the effect preview page', () => {
  assert.equal(typeof captureGifs.previewUrlForEffect, 'function');

  const previewUrl = captureGifs.previewUrlForEffect('envelope');
  const previewPath = fileURLToPath(previewUrl);

  assert.equal(previewPath, join(ROOT, 'effects', 'envelope', 'preview.html'));
});

test('computeClipRect unions pre-hover and hovered boxes from the same panel', () => {
  const clip = captureGifs.computeClipRect(
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
  const clip = captureGifs.computeClipRect(
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

  const clip = await captureGifs.measureCaptureClip(page, {
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

test('resolveEffectConfig rejects unknown effects clearly', () => {
  assert.equal(typeof captureGifs.resolveEffectConfig, 'function');
  assert.throws(
    () => captureGifs.resolveEffectConfig('missing-effect'),
    /Unknown effect: missing-effect/
  );
});

test('resolveEffectConfig rejects invalid paletteColors clearly', () => {
  captureGifs.EFFECTS['invalid-palette-colors'] = {
    hoverSelector: '#workskin .invalid-palette-colors--hover',
    paletteColors: 0,
  };

  try {
    assert.throws(
      () => captureGifs.resolveEffectConfig('invalid-palette-colors'),
      /Invalid paletteColors for effect invalid-palette-colors/
    );
  } finally {
    delete captureGifs.EFFECTS['invalid-palette-colors'];
  }
});

test('resolveEffectConfig rejects paletteColors outside the ffmpeg range', () => {
  captureGifs.EFFECTS['palette-colors-too-low'] = {
    hoverSelector: '#workskin .palette-colors-too-low--hover',
    paletteColors: 1,
  };
  captureGifs.EFFECTS['palette-colors-too-high'] = {
    hoverSelector: '#workskin .palette-colors-too-high--hover',
    paletteColors: 257,
  };

  try {
    assert.throws(
      () => captureGifs.resolveEffectConfig('palette-colors-too-low'),
      /Invalid paletteColors for effect palette-colors-too-low/
    );
    assert.throws(
      () => captureGifs.resolveEffectConfig('palette-colors-too-high'),
      /Invalid paletteColors for effect palette-colors-too-high/
    );
  } finally {
    delete captureGifs.EFFECTS['palette-colors-too-low'];
    delete captureGifs.EFFECTS['palette-colors-too-high'];
  }
});

test('raw effect entries expose deterministic hover selectors', () => {
  for (const [name, effect] of Object.entries(captureGifs.EFFECTS)) {
    assert.equal(typeof effect.hoverSelector, 'string', `${name} should expose a hover selector`);
    assert.ok(effect.hoverSelector.length > 0, `${name} hover selector should not be empty`);
  }
});

test('capture config covers all published effect roots', () => {
  assert.deepEqual(Object.keys(captureGifs.EFFECTS).sort(), PUBLISHED_EFFECTS);
});

test('resolved effect configs expose valid capture settings', () => {
  for (const name of Object.keys(captureGifs.EFFECTS)) {
    const effect = captureGifs.resolveEffectConfig(name);

    assert.equal(effect.captureSelector, '#workskin', `${name} should capture the #workskin boundary`);
    assert.equal(effect.hoverSelector, captureGifs.EFFECTS[name].hoverSelector);
    assert.ok(Number.isFinite(effect.viewport.width) && effect.viewport.width > 0);
    assert.ok(Number.isFinite(effect.viewport.height) && effect.viewport.height > 0);
    assert.ok(Number.isFinite(effect.outputWidth) && effect.outputWidth > 0);
    assert.ok(
      Number.isInteger(effect.paletteColors) && effect.paletteColors >= 2 && effect.paletteColors <= 256
    );
    assert.ok(Number.isFinite(effect.settleMs) && effect.settleMs >= 0);
    assert.ok(Number.isFinite(effect.fps) && effect.fps > 0);
    assert.ok(Number.isFinite(effect.measureDurationMs) && effect.measureDurationMs > 0);
    assert.ok(Number.isFinite(effect.sampleIntervalMs) && effect.sampleIntervalMs > 0);
    assert.ok(Number.isFinite(effect.durationMs) && effect.durationMs >= effect.measureDurationMs);
  }
});

test('lean preview capture config uses #workskin and effect-local hover selectors', () => {
  for (const name of Object.keys(captureGifs.EFFECTS)) {
    const effect = captureGifs.resolveEffectConfig(name);

    assert.equal(effect.captureSelector, '#workskin', `${name} should capture #workskin`);
    assert.equal(typeof effect.hoverSelector, 'string', `${name} should expose a hover selector`);
    assert.equal(
      effect.hoverSelector.includes('.preview-card'),
      false,
      `${name} should not depend on preview-card wrappers`
    );
    assert.equal(
      effect.hoverSelector.includes('#workskin.'),
      false,
      `${name} should not depend on preview-only #workskin classes`
    );
  }
});
