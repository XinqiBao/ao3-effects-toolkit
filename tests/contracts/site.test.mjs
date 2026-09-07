import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { effects } from '../../site/effects.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

test('interactive gallery manifest matches every published effect directory', () => {
  const publishedEffects = readdirSync(join(ROOT, 'effects'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .map((entry) => entry.name)
    .sort();
  const galleryEffects = effects.map((effect) => effect.id).sort();

  assert.deepEqual(galleryEffects, publishedEffects);
});
