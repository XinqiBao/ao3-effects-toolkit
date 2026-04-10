import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const POLAROID_DIR = join(ROOT, 'effects', 'polaroid');

const FILES = [
  'smoke-test.html',
  'hover-template.html',
  'tap-template.html',
  'preview.html',
];

for (const file of FILES) {
  test(`effects/polaroid/${file} keeps polaroid-message inline-safe for AO3 and preview parity`, () => {
    const html = readFileSync(join(POLAROID_DIR, file), 'utf8');

    assert.doesNotMatch(
      html,
      /<p class="polaroid-message">/,
      'polaroid-message should not use <p> inside inline wrappers'
    );
    assert.match(
      html,
      /<span class="polaroid-message">/,
      'polaroid-message should use an inline-safe wrapper'
    );
  });
}
