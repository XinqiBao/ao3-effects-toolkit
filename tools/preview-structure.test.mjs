import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('lean preview and example markup avoid obsolete wrapper-only classes', () => {
  const envelopePreview = readFileSync(join(ROOT, 'effects', 'envelope', 'preview.html'), 'utf8');
  const polaroidPreview = readFileSync(join(ROOT, 'effects', 'polaroid', 'preview.html'), 'utf8');
  const polaroidExample = readFileSync(join(ROOT, 'effects', 'polaroid', 'example.html'), 'utf8');

  assert.equal(
    envelopePreview.includes('<div id="workskin" class='),
    false,
    'envelope preview should not require a preview-only class on #workskin'
  );
  assert.equal(
    polaroidPreview.includes('<div id="workskin" class='),
    false,
    'polaroid preview should not require a preview-only class on #workskin'
  );
  assert.equal(
    polaroidExample.includes('polaroid-gallery'),
    false,
    'polaroid example should not keep the unused gallery wrapper'
  );
});
