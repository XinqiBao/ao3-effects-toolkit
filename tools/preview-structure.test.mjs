import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('lean preview and example markup avoid obsolete wrapper-only classes', () => {
  const envelopePreview = readFileSync(join(ROOT, 'effects', 'envelope', 'preview.html'), 'utf8');
  const envelopeCss = readFileSync(join(ROOT, 'effects', 'envelope', 'work-skin.css'), 'utf8');
  const polaroidPreview = readFileSync(join(ROOT, 'effects', 'polaroid', 'preview.html'), 'utf8');
  const polaroidExample = readFileSync(join(ROOT, 'effects', 'polaroid', 'example.html'), 'utf8');
  const polaroidCss = readFileSync(join(ROOT, 'effects', 'polaroid', 'work-skin.css'), 'utf8');
  const secretDividerExample = readFileSync(join(ROOT, 'effects', 'secret-divider', 'example.html'), 'utf8');
  const secretDividerCss = readFileSync(join(ROOT, 'effects', 'secret-divider', 'work-skin.css'), 'utf8');

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
  assert.equal(
    polaroidExample.includes('polaroid-front'),
    true,
    'polaroid example should restore a front face for the flip interaction'
  );
  assert.equal(
    polaroidExample.includes('polaroid-back'),
    true,
    'polaroid example should restore a back face for the flip interaction'
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
    secretDividerExample.includes('secret-divider-container'),
    false,
    'secret-divider example should not keep a layout-only outer container'
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
    envelopeCss.includes('@media (max-width: 720px)'),
    false,
    'envelope work skin should not keep a mobile-specific branch in the desktop-only pass'
  );
});
