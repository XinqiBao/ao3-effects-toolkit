import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { get } from 'node:http';

import {
  EFFECTS,
  computeClipRect,
  contentTypeForPath,
  measureCaptureClip,
  resolveRequestPath,
  startCaptureServer,
} from './capture-gifs.mjs';

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

test('contentTypeForPath serves preview media with image MIME types', () => {
  assert.equal(contentTypeForPath('/tmp/example.html'), 'text/html');
  assert.equal(contentTypeForPath('/tmp/example.css'), 'text/css');
  assert.equal(contentTypeForPath('/tmp/example.js'), 'text/javascript');
  assert.equal(contentTypeForPath('/tmp/example.mjs'), 'text/javascript');
  assert.equal(contentTypeForPath('/tmp/stamp.png'), 'image/png');
  assert.equal(contentTypeForPath('/tmp/photo.jpg'), 'image/jpeg');
  assert.equal(contentTypeForPath('/tmp/photo.jpeg'), 'image/jpeg');
  assert.equal(contentTypeForPath('/tmp/demo.gif'), 'image/gif');
  assert.equal(contentTypeForPath('/tmp/archive.bin'), 'application/octet-stream');
});

test('resolveRequestPath rejects traversal outside the capture root', () => {
  const root = '/repo/root';

  assert.equal(
    resolveRequestPath(root, '/assets/preview-media/envelope-stamp.png'),
    '/repo/root/assets/preview-media/envelope-stamp.png'
  );
  assert.equal(resolveRequestPath(root, '/../../README.md'), null);
});

test('startCaptureServer returns 400 for malformed percent-encoded paths', async () => {
  const root = mkdtempSync(join(tmpdir(), 'ao3-capture-server-'));
  writeFileSync(join(root, 'index.html'), '<!doctype html>');

  const server = startCaptureServer(root, 0);
  await once(server, 'listening');
  const port = server.address().port;

  const response = await new Promise((resolve, reject) => {
    get(`http://127.0.0.1:${port}/%E0%A4%A`, resolve).on('error', reject);
  });

  assert.equal(response.statusCode, 400);
  server.close();
});

test('chat-messages capture window stays long enough to sample the expanded stack', () => {
  const measureDurationMs = EFFECTS['chat-messages'].measureDurationMs;

  assert.ok(
    measureDurationMs >= 640,
    'chat-messages needs a measure window that outlasts its delayed full-height expansion'
  );
});
