import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('lean preview and example markup avoid obsolete wrapper-only classes', () => {
  const chatPreview = readFileSync(join(ROOT, 'effects', 'chat-messages', 'preview.html'), 'utf8');
  const chatExample = readFileSync(join(ROOT, 'effects', 'chat-messages', 'example.html'), 'utf8');
  const chatCss = readFileSync(join(ROOT, 'effects', 'chat-messages', 'work-skin.css'), 'utf8');
  const envelopePreview = readFileSync(join(ROOT, 'effects', 'envelope', 'preview.html'), 'utf8');
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

  assert.equal(
    envelopePreview.includes('<div id="workskin" class='),
    false,
    'envelope preview should not require a preview-only class on #workskin'
  );
  assert.equal(
    envelopePreview.includes('class="envelope envelope--hover"'),
    true,
    'envelope preview should use envelope itself as the published root class'
  );
  assert.equal(
    envelopeCss.includes('.trifold-letter'),
    false,
    'envelope work skin should not keep the old root selector name'
  );
  assert.equal(
    envelopeCss.includes('.letter-top'),
    false,
    'envelope work skin should not keep separate top panel naming once panel modifiers are introduced'
  );
  assert.equal(
    envelopeCss.includes('#workskin .envelope .panel'),
    true,
    'envelope work skin should scope panel modules through the envelope root selector'
  );
  assert.equal(
    envelopeCss.includes('.panel--top'),
    true,
    'envelope work skin should model fold layers with panel modifiers'
  );
  assert.equal(
    chatPreview.includes('class="chat chat--hover"'),
    true,
    'chat preview should use chat itself as the published root class'
  );
  assert.equal(
    chatExample.includes('class="chat chat--hover"'),
    true,
    'chat example should use chat itself as the published root class'
  );
  assert.equal(
    chatExample.includes('chat-conversation'),
    false,
    'chat example should not keep the old conversation root name'
  );
  assert.equal(
    chatExample.includes('chat-meta'),
    false,
    'chat example should not keep the old entry wrapper name'
  );
  assert.equal(
    chatExample.includes('class="preview"'),
    true,
    'chat example should use a short preview module name'
  );
  assert.equal(
    chatExample.includes('class="stack"'),
    true,
    'chat example should use a short stack module name'
  );
  assert.equal(
    chatExample.includes('class="entry entry--sent"'),
    true,
    'chat example should model sent exchanges as entry modifiers'
  );
  assert.equal(
    chatExample.includes('class="bubble bubble--received"'),
    true,
    'chat example should keep received bubbles through base-plus-modifier naming'
  );
  assert.equal(
    chatCss.includes('.chat-conversation'),
    false,
    'chat work skin should not keep the old conversation selectors'
  );
  assert.equal(
    chatCss.includes('.chat-meta'),
    false,
    'chat work skin should not keep the old entry selectors'
  );
  assert.equal(
    chatCss.includes('#workskin .chat .preview'),
    true,
    'chat work skin should scope short descendant module names through the root selector'
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
  assert.equal(
    polaroidExample.includes('class="polaroid polaroid--hover"'),
    true,
    'polaroid example should use polaroid itself as the published root class'
  );
  assert.equal(
    polaroidExample.includes('polaroid-container'),
    false,
    'polaroid example should not keep the old outer container wrapper'
  );
  assert.equal(
    polaroidExample.includes('polaroid-card'),
    false,
    'polaroid example should not keep the old card wrapper name once the root absorbs that role'
  );
  assert.equal(
    polaroidExample.includes('class="front"'),
    true,
    'polaroid example should keep a short front face module inside the root scope'
  );
  assert.equal(
    polaroidExample.includes('class="back"'),
    true,
    'polaroid example should keep a short back face module inside the root scope'
  );
  assert.equal(
    polaroidExample.includes('polaroid-hint'),
    false,
    'polaroid example should not keep hint copy beneath the card'
  );
  assert.equal(
    polaroidExample.includes('polaroid--details'),
    false,
    'polaroid example should not keep the deprecated details path'
  );
  assert.equal(
    polaroidExample.includes('<summary'),
    false,
    'polaroid example should not keep summary-based tap markup'
  );
  assert.equal(
    polaroidCss.includes('polaroid--details'),
    false,
    'polaroid work skin should not keep the deprecated details fallback path'
  );
  assert.equal(
    polaroidCss.includes('.polaroid-container'),
    false,
    'polaroid work skin should not keep the old outer container selector'
  );
  assert.equal(
    polaroidCss.includes('.polaroid-card'),
    false,
    'polaroid work skin should not keep the old card selector name'
  );
  assert.equal(
    polaroidCss.includes('.polaroid-front'),
    false,
    'polaroid work skin should not keep effect-prefixed front selectors'
  );
  assert.equal(
    polaroidCss.includes('#workskin .polaroid .front'),
    true,
    'polaroid work skin should scope short descendant module names through the root selector'
  );
  assert.equal(
    polaroidCss.includes('rotateY'),
    true,
    'polaroid work skin should keep a rotateY-based flip for the canonical hover path'
  );
  assert.equal(
    polaroidCss.includes('summary::marker'),
    false,
    'polaroid work skin should not keep summary marker overrides'
  );
  assert.equal(
    polaroidCss.includes('@media (max-width: 720px)'),
    false,
    'polaroid work skin should not keep a mobile-specific branch in the desktop-only pass'
  );
  assert.equal(
    polaroidPreview.includes('class="polaroid polaroid--hover"'),
    true,
    'polaroid preview should use the same published root contract as the example'
  );
  assert.equal(
    typewriterPreview.includes('class="typewriter typewriter--hover"'),
    true,
    'typewriter preview should use typewriter itself as the published root class'
  );
  assert.equal(
    typewriterExample.includes('class="typewriter typewriter--hover"'),
    true,
    'typewriter example should use typewriter itself as the published root class'
  );
  assert.equal(
    typewriterExample.includes('typewriter-stage'),
    false,
    'typewriter example should not keep the old stage wrapper name'
  );
  assert.equal(
    typewriterExample.includes('typewriter-container'),
    false,
    'typewriter example should not keep the old container wrapper name'
  );
  assert.equal(
    typewriterExample.includes('class="lines"'),
    true,
    'typewriter example should use a short lines module name'
  );
  assert.equal(
    typewriterCss.includes('.typewriter-stage'),
    false,
    'typewriter work skin should not keep the old stage selector'
  );
  assert.equal(
    typewriterCss.includes('.typewriter-container'),
    false,
    'typewriter work skin should not keep the old container selector'
  );
  assert.equal(
    typewriterCss.includes('#workskin .typewriter .line'),
    true,
    'typewriter work skin should scope short descendant module names through the root selector'
  );
  assert.equal(
    secretDividerExample.includes('secret-divider-container'),
    false,
    'secret-divider example should not keep a layout-only outer container'
  );
  assert.equal(
    secretDividerPreview.includes('class="secret-divider secret-divider--hover secret-divider--with-flanks"'),
    true,
    'secret-divider preview should keep the published root and modifier contract'
  );
  assert.equal(
    secretDividerExample.includes('secret-divider__ornament'),
    false,
    'secret-divider example should not keep effect-prefixed ornament module names'
  );
  assert.equal(
    secretDividerExample.includes('class="ornament"'),
    true,
    'secret-divider example should use a short ornament module name'
  );
  assert.equal(
    secretDividerExample.includes('class="reveal"'),
    true,
    'secret-divider example should use a short reveal module name'
  );
  assert.equal(
    secretDividerExample.includes('class="message"'),
    true,
    'secret-divider example should use a short message module name'
  );
  assert.equal(
    secretDividerCss.includes('secret-divider--details'),
    false,
    'secret-divider work skin should not keep the deprecated details fallback path'
  );
  assert.equal(
    secretDividerCss.includes('secret-divider__summary-hint'),
    false,
    'secret-divider work skin should not keep summary-only hint styling'
  );
  assert.equal(
    secretDividerCss.includes('secret-divider__ornament'),
    false,
    'secret-divider work skin should not keep effect-prefixed descendant selectors'
  );
  assert.equal(
    secretDividerCss.includes('#workskin .secret-divider .reveal'),
    true,
    'secret-divider work skin should scope short descendant module names through the root selector'
  );
  assert.equal(
    envelopeCss.includes('@media (max-width: 720px)'),
    false,
    'envelope work skin should not keep a mobile-specific branch in the desktop-only pass'
  );
});
