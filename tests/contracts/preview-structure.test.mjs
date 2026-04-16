import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

test('marginalia artifacts follow the documented root-scoped structure contract', () => {
  const preview = readFileSync(join(ROOT, 'effects', 'marginalia', 'preview.html'), 'utf8');
  const example = readFileSync(join(ROOT, 'effects', 'marginalia', 'example.html'), 'utf8');
  const css = readFileSync(join(ROOT, 'effects', 'marginalia', 'work-skin.css'), 'utf8');

  assert.equal(preview.includes('class="marginalia marginalia--hover"'), true);
  assert.equal(example.includes('class="marginalia marginalia--hover"'), true);
  assert.equal(css.includes('#workskin .marginalia .sheet'), true);
  assert.equal(example.includes('class="notes"'), true);
  assert.equal(css.includes('#workskin .marginalia .note'), true);
});

test('marginalia artifacts avoid the documented AO3-incompatible patterns', () => {
  const css = readFileSync(join(ROOT, 'effects', 'marginalia', 'work-skin.css'), 'utf8');
  const example = readFileSync(join(ROOT, 'effects', 'marginalia', 'example.html'), 'utf8');

  assert.equal(css.includes('gap:'), false);
  assert.equal(css.includes('object-fit'), false);
  assert.equal(css.includes('pointer-events'), false);
  assert.equal(/\banimation\s*:/.test(css), false);
  assert.equal(/@keyframes\b/.test(css), false);
  assert.equal(css.includes('grid-template-columns: repeat('), false);
  assert.equal(/border-radius:[^;]*\//.test(css), false);
  assert.equal(example.includes(' id='), false);
});

test('casefile artifacts follow the documented root-scoped structure contract', () => {
  const preview = readFileSync(join(ROOT, 'effects', 'casefile', 'preview.html'), 'utf8');
  const example = readFileSync(join(ROOT, 'effects', 'casefile', 'example.html'), 'utf8');
  const css = readFileSync(join(ROOT, 'effects', 'casefile', 'work-skin.css'), 'utf8');

  assert.equal(preview.includes('class="casefile casefile--hover"'), true);
  assert.equal(example.includes('class="casefile casefile--hover"'), true);
  assert.equal(css.includes('#workskin .casefile .summary'), true);
  assert.equal(example.includes('class="slip slip--ticket"'), true);
  assert.equal(css.includes('#workskin .casefile .summary-label'), true);
  assert.equal(example.includes('class="tabs"'), false);
});

test('casefile artifacts avoid the documented AO3-incompatible patterns', () => {
  const css = readFileSync(join(ROOT, 'effects', 'casefile', 'work-skin.css'), 'utf8');
  const example = readFileSync(join(ROOT, 'effects', 'casefile', 'example.html'), 'utf8');

  assert.equal(css.includes('gap:'), false);
  assert.equal(css.includes('object-fit'), false);
  assert.equal(css.includes('pointer-events'), false);
  assert.equal(/\banimation\s*:/.test(css), false);
  assert.equal(/@keyframes\b/.test(css), false);
  assert.equal(css.includes('grid-template-columns: repeat('), false);
  assert.equal(/border-radius:[^;]*\//.test(css), false);
  assert.equal(example.includes(' id='), false);
});

test('route-map artifacts follow the documented root-scoped structure contract', () => {
  const preview = readFileSync(join(ROOT, 'effects', 'route-map', 'preview.html'), 'utf8');
  const example = readFileSync(join(ROOT, 'effects', 'route-map', 'example.html'), 'utf8');
  const css = readFileSync(join(ROOT, 'effects', 'route-map', 'work-skin.css'), 'utf8');

  assert.equal(preview.includes('class="route-map route-map--hover"'), true);
  assert.equal(example.includes('class="route-map route-map--hover"'), true);
  assert.equal(css.includes('#workskin .route-map .track'), true);
  assert.equal(example.includes('class="stop stop--start"'), true);
  assert.equal(css.includes('#workskin .route-map .note'), true);
});

test('route-map artifacts avoid the documented AO3-incompatible patterns', () => {
  const css = readFileSync(join(ROOT, 'effects', 'route-map', 'work-skin.css'), 'utf8');
  const example = readFileSync(join(ROOT, 'effects', 'route-map', 'example.html'), 'utf8');

  assert.equal(css.includes('gap:'), false);
  assert.equal(css.includes('object-fit'), false);
  assert.equal(css.includes('pointer-events'), false);
  assert.equal(/\banimation\s*:/.test(css), false);
  assert.equal(/@keyframes\b/.test(css), false);
  assert.equal(css.includes('grid-template-columns: repeat('), false);
  assert.equal(/border-radius:[^;]*\//.test(css), false);
  assert.equal(example.includes(' id='), false);
});

test('published examples and previews use the documented root-scoped structure contract', () => {
  const chatPreview = readFileSync(join(ROOT, 'effects', 'chat-messages', 'preview.html'), 'utf8');
  const chatExample = readFileSync(join(ROOT, 'effects', 'chat-messages', 'example.html'), 'utf8');
  const chatCss = readFileSync(join(ROOT, 'effects', 'chat-messages', 'work-skin.css'), 'utf8');
  const envelopePreview = readFileSync(join(ROOT, 'effects', 'envelope', 'preview.html'), 'utf8');
  const envelopeExample = readFileSync(join(ROOT, 'effects', 'envelope', 'example.html'), 'utf8');
  const envelopeCss = readFileSync(join(ROOT, 'effects', 'envelope', 'work-skin.css'), 'utf8');
  const polaroidPreview = readFileSync(join(ROOT, 'effects', 'polaroid', 'preview.html'), 'utf8');
  const polaroidExample = readFileSync(join(ROOT, 'effects', 'polaroid', 'example.html'), 'utf8');
  const polaroidCss = readFileSync(join(ROOT, 'effects', 'polaroid', 'work-skin.css'), 'utf8');
  const secretDividerPreview = readFileSync(join(ROOT, 'effects', 'secret-divider', 'preview.html'), 'utf8');
  const secretDividerExample = readFileSync(join(ROOT, 'effects', 'secret-divider', 'example.html'), 'utf8');
  const secretDividerCss = readFileSync(join(ROOT, 'effects', 'secret-divider', 'work-skin.css'), 'utf8');
  const typewriterPreview = readFileSync(join(ROOT, 'effects', 'typewriter', 'preview.html'), 'utf8');
  const typewriterExample = readFileSync(join(ROOT, 'effects', 'typewriter', 'example.html'), 'utf8');
  const typewriterCss = readFileSync(join(ROOT, 'effects', 'typewriter', 'work-skin.css'), 'utf8');

  assert.equal(chatPreview.includes('class="chat chat--hover"'), true);
  assert.equal(chatExample.includes('class="chat chat--hover"'), true);
  assert.equal(chatCss.includes('#workskin .chat .preview'), true);
  assert.equal(chatExample.includes('chat-conversation'), false);
  assert.equal(chatExample.includes('chat-meta'), false);

  assert.equal(envelopePreview.includes('<div id="workskin" class='), false);
  assert.equal(envelopePreview.includes('class="envelope envelope--hover"'), true);
  assert.equal(envelopeExample.includes('class="envelope envelope--hover"'), true);
  assert.equal(envelopeCss.includes('#workskin .envelope .panel'), true);
  assert.equal(envelopeCss.includes('.trifold-letter'), false);

  assert.equal(polaroidPreview.includes('<div id="workskin" class='), false);
  assert.equal(polaroidPreview.includes('class="polaroid polaroid--hover"'), true);
  assert.equal(polaroidExample.includes('class="polaroid polaroid--hover"'), true);
  assert.equal(polaroidExample.includes('polaroid-gallery'), false);
  assert.equal(polaroidCss.includes('#workskin .polaroid .front'), true);

  assert.equal(
    secretDividerPreview.includes('class="secret-divider secret-divider--hover"'),
    true
  );
  assert.equal(
    secretDividerExample.includes('class="secret-divider secret-divider--hover"'),
    true
  );
  assert.equal(secretDividerExample.includes('class="ornament"'), true);
  assert.equal(secretDividerCss.includes('#workskin .secret-divider .reveal'), true);

  assert.equal(typewriterPreview.includes('class="typewriter typewriter--hover"'), true);
  assert.equal(typewriterExample.includes('class="typewriter typewriter--hover"'), true);
  assert.equal(typewriterExample.includes('class="lines"'), true);
  assert.equal(typewriterCss.includes('#workskin .typewriter .line'), true);
});

test('published artifacts avoid the documented AO3-incompatible patterns', () => {
  const allCss = [
    readFileSync(join(ROOT, 'effects', 'chat-messages', 'work-skin.css'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'envelope', 'work-skin.css'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'polaroid', 'work-skin.css'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'secret-divider', 'work-skin.css'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'typewriter', 'work-skin.css'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'marginalia', 'work-skin.css'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'casefile', 'work-skin.css'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'route-map', 'work-skin.css'), 'utf8'),
  ].join('\n');
  const allExamples = [
    readFileSync(join(ROOT, 'effects', 'chat-messages', 'example.html'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'envelope', 'example.html'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'polaroid', 'example.html'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'secret-divider', 'example.html'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'typewriter', 'example.html'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'marginalia', 'example.html'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'casefile', 'example.html'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'route-map', 'example.html'), 'utf8'),
  ].join('\n');

  assert.equal(allCss.includes('gap:'), false);
  assert.equal(allCss.includes('object-fit'), false);
  assert.equal(allCss.includes('pointer-events'), false);
  assert.equal(/\banimation\s*:/.test(allCss), false);
  assert.equal(/@keyframes\b/.test(allCss), false);
  assert.equal(allCss.includes('grid-template-columns: repeat('), false);
  assert.equal(/border-radius:[^;]*\//.test(allCss), false);
  assert.equal(allExamples.includes(' id='), false);
});
