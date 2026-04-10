import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(ROOT, 'effects', '_shared', 'preview-shell.css'), 'utf8');

test('preview shell lets cards size to content without family min-height scaffolding', () => {
  assert.match(
    css,
    /\.grid\s*\{[\s\S]*?align-items:\s*start;/,
    'preview grid should let cards keep their own height instead of stretching a whole row'
  );
  assert.doesNotMatch(
    css,
    /\[data-preview-family="standard"\]\s+\[data-capture-frame\]\s*\{\s*min-height:/,
    'standard family should not force min-height on [data-capture-frame]'
  );
  assert.doesNotMatch(
    css,
    /\[data-preview-family="tall"\]\s+\[data-capture-frame\]\s*\{\s*min-height:/,
    'tall family should not force min-height on [data-capture-frame]'
  );
  assert.doesNotMatch(
    css,
    /\[data-preview-family="standard"\]\s+\.card__stage\s*\{\s*min-height:/,
    'standard family should not reserve extra stage height around short previews'
  );
  assert.doesNotMatch(
    css,
    /\[data-preview-family="tall"\]\s+\.card__stage\s*\{\s*min-height:/,
    'tall family should not reserve extra stage height around short previews'
  );
  assert.doesNotMatch(
    css,
    /\.card\s*\{[\s\S]*?min-height:\s*100%;/,
    'cards should not force equal-height rows that leave short previews floating'
  );
});
