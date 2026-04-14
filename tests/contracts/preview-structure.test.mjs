import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

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
  ].join('\n');
  const allExamples = [
    readFileSync(join(ROOT, 'effects', 'chat-messages', 'example.html'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'envelope', 'example.html'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'polaroid', 'example.html'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'secret-divider', 'example.html'), 'utf8'),
    readFileSync(join(ROOT, 'effects', 'typewriter', 'example.html'), 'utf8'),
  ].join('\n');

  assert.equal(allCss.includes('gap:'), false);
  assert.equal(allCss.includes('object-fit'), false);
  assert.equal(allCss.includes('pointer-events'), false);
  assert.equal(allCss.includes('grid-template-columns: repeat('), false);
  assert.equal(/border-radius:[^;]*\//.test(allCss), false);
  assert.equal(allExamples.includes(' id='), false);
});
