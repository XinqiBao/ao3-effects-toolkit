import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const INTERACTIVE_EFFECTS = [
  { directory: 'envelope', root: 'envelope' },
  { directory: 'chat-messages', root: 'chat' },
  { directory: 'polaroid', root: 'polaroid' },
  { directory: 'secret-divider', root: 'secret-divider' },
  { directory: 'typewriter', root: 'typewriter' },
  { directory: 'marginalia', root: 'marginalia' },
  { directory: 'casefile', root: 'casefile' },
  { directory: 'route-map', root: 'route-map' },
];
const STATIC_EFFECTS = [
  { directory: 'search-page', root: 'search-page' },
];
const EFFECTS = [...INTERACTIVE_EFFECTS, ...STATIC_EFFECTS];

function effectPath(effect, filename) {
  return join(ROOT, 'effects', effect.directory, filename);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tapRootPattern(root) {
  const escaped = escapeRegExp(root);
  return new RegExp(`<details class="${escaped}">\\s*<summary class="trigger">`);
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

test('interactive examples and previews keep the documented tap-only root contract', () => {
  for (const effect of INTERACTIVE_EFFECTS) {
    const preview = readFileSync(effectPath(effect, 'preview.html'), 'utf8');
    const example = readFileSync(effectPath(effect, 'example.html'), 'utf8');
    const css = readFileSync(effectPath(effect, 'work-skin.css'), 'utf8');
    const rootPattern = tapRootPattern(effect.root);

    assert.match(
      preview,
      rootPattern,
      `${effect.directory} preview should expose a details root with one trigger summary`
    );
    assert.match(
      example,
      rootPattern,
      `${effect.directory} example should expose a details root with one trigger summary`
    );
    assert.equal(
      css.includes(`#workskin .${effect.root}`),
      true,
      `${effect.directory} CSS should stay anchored under #workskin .${effect.root}`
    );
    assert.equal(css.includes(':hover'), false, `${effect.directory} CSS should not retain hover triggers`);
    assert.equal(example.includes('--hover'), false, `${effect.directory} example should not retain hover modifiers`);
  }
});

test('static examples and previews keep a noninteractive root', () => {
  for (const effect of STATIC_EFFECTS) {
    const preview = readFileSync(effectPath(effect, 'preview.html'), 'utf8');
    const example = readFileSync(effectPath(effect, 'example.html'), 'utf8');
    const css = readFileSync(effectPath(effect, 'work-skin.css'), 'utf8');

    for (const html of [preview, example]) {
      assert.match(html, new RegExp(`class="${escapeRegExp(effect.root)}"`));
      assert.doesNotMatch(html, /<details\b|<summary\b/);
    }
    assert.equal(css.includes(`#workskin .${effect.root}`), true);
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
