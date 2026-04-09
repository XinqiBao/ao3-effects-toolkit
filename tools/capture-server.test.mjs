import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { get } from 'node:http';

import { contentTypeForPath, resolveRequestPath, startCaptureServer } from './capture-server.mjs';

test('contentTypeForPath serves preview media with image MIME types', () => {
  assert.equal(contentTypeForPath('/tmp/example.html'), 'text/html');
  assert.equal(contentTypeForPath('/tmp/example.css'), 'text/css');
  assert.equal(contentTypeForPath('/tmp/example.js'), 'text/javascript');
  assert.equal(contentTypeForPath('/tmp/example.mjs'), 'text/javascript');
  assert.equal(contentTypeForPath('/tmp/stamp.png'), 'image/png');
  assert.equal(contentTypeForPath('/tmp/photo.jpg'), 'image/jpeg');
  assert.equal(contentTypeForPath('/tmp/photo.jpeg'), 'image/jpeg');
  assert.equal(contentTypeForPath('/tmp/demo.gif'), 'image/gif');
});

test('contentTypeForPath falls back to octet-stream for unknown assets', () => {
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
