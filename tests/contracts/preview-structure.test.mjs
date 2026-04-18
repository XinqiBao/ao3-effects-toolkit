import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const EFFECTS = [
  { directory: 'envelope', root: 'envelope' },
  { directory: 'chat-messages', root: 'chat' },
  { directory: 'polaroid', root: 'polaroid' },
  { directory: 'secret-divider', root: 'secret-divider' },
  { directory: 'typewriter', root: 'typewriter' },
  { directory: 'marginalia', root: 'marginalia' },
  { directory: 'casefile', root: 'casefile' },
  { directory: 'route-map', root: 'route-map' },
];

function effectPath(effect, filename) {
  return join(ROOT, 'effects', effect.directory, filename);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hoverRootPattern(root) {
  const escaped = escapeRegExp(root);
  return new RegExp(`class="[^"]*\\b${escaped}\\b[^"]*\\b${escaped}--hover\\b[^"]*"`);
}

test('published effect directories keep the documented artifact set', () => {
  for (const effect of EFFECTS) {
    for (const filename of ['work-skin.css', 'example.html', 'preview.html', 'guide.md']) {
      assert.equal(
        existsSync(effectPath(effect, filename)),
        true,
        `${effect.directory} should include ${filename}`
      );
    }
  }
});

test('published examples and previews keep the documented hover-first root contract', () => {
  for (const effect of EFFECTS) {
    const preview = readFileSync(effectPath(effect, 'preview.html'), 'utf8');
    const example = readFileSync(effectPath(effect, 'example.html'), 'utf8');
    const css = readFileSync(effectPath(effect, 'work-skin.css'), 'utf8');
    const rootPattern = hoverRootPattern(effect.root);

    assert.match(
      preview,
      rootPattern,
      `${effect.directory} preview should expose the documented hover-first root classes`
    );
    assert.match(
      example,
      rootPattern,
      `${effect.directory} example should expose the documented hover-first root classes`
    );
    assert.equal(
      css.includes(`#workskin .${effect.root}`),
      true,
      `${effect.directory} CSS should stay anchored under #workskin .${effect.root}`
    );
  }
});

test('published artifacts avoid the documented AO3-incompatible patterns', () => {
  const allCss = EFFECTS
    .map((effect) => readFileSync(effectPath(effect, 'work-skin.css'), 'utf8'))
    .join('\n');
  const allExamples = EFFECTS
    .map((effect) => readFileSync(effectPath(effect, 'example.html'), 'utf8'))
    .join('\n');

  assert.equal(allCss.includes('gap:'), false);
  assert.equal(allCss.includes('object-fit'), false);
  assert.equal(allCss.includes('pointer-events'), false);
  assert.equal(/\banimation\s*:/.test(allCss), false);
  assert.equal(/@keyframes\b/.test(allCss), false);
  assert.equal(allCss.includes('grid-template-columns: repeat('), false);
  assert.equal(/border-radius:[^;]*\//.test(allCss), false);
  assert.equal(allExamples.includes(' id='), false);
});
