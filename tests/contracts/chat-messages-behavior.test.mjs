import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

import { previewUrlForEffect } from '../../tools/capture-gifs.mjs';

test('chat-messages hover stays engaged when the pointer rests on the closed preview row', async () => {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1400, height: 1200 },
      deviceScaleFactor: 2,
    });

    try {
      await page.goto(previewUrlForEffect('chat-messages'));

      const hoverTarget = page.locator('#workskin .chat--hover').first();
      await hoverTarget.waitFor({ state: 'visible' });

      const initialBox = await hoverTarget.boundingBox();
      assert.ok(initialBox, 'chat-messages preview should expose a visible hover target');

      await page.mouse.move(10, 10);
      await page.evaluate(() => {
        const root = document.querySelector('#workskin .chat--hover');
        if (!root) {
          throw new Error('chat-messages preview is missing the hover container');
        }

        window.__chatHoverEvents = [];
        ['mouseenter', 'mouseleave'].forEach((type) => {
          root.addEventListener(type, () => {
            window.__chatHoverEvents.push(type);
          });
        });
      });

      await page.mouse.move(
        initialBox.x + initialBox.width / 2,
        initialBox.y + initialBox.height / 2
      );
      await page.waitForTimeout(220);

      const state = await page.evaluate(() => {
        const root = document.querySelector('#workskin .chat--hover');
        const stack = document.querySelector('#workskin .chat--hover .stack');
        if (!root || !stack) {
          throw new Error('chat-messages preview is missing the hover container or message stack');
        }

        return {
          hover: root.matches(':hover'),
          leaveCount: window.__chatHoverEvents.filter((type) => type === 'mouseleave').length,
          stackOpacity: Number(getComputedStyle(stack).opacity),
        };
      });

      assert.equal(
        state.leaveCount,
        0,
        'chat-messages hover should not drop and re-enter while the pointer rests on the closed preview row'
      );
      assert.equal(
        state.hover,
        true,
        'chat-messages should still be hovered while the pointer rests on the initial preview row'
      );
      assert.ok(
        state.stackOpacity > 0.2,
        'chat-messages hover should start revealing the conversation without losing the hover state'
      );
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test('chat-messages keeps the closed preview row compact when the preview copy is long', async () => {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1400, height: 1200 },
      deviceScaleFactor: 2,
    });

    try {
      await page.goto(previewUrlForEffect('chat-messages'));
      await page.mouse.move(10, 10);
      await page.waitForTimeout(80);

      const state = await page.evaluate(() => {
        const root = document.querySelector('#workskin .chat--hover');
        const preview = root?.querySelector('.preview');
        const copy = root?.querySelector('.preview-copy');
        if (!root || !preview || !copy) {
          throw new Error('chat-messages preview is missing the hover root, preview row, or preview copy');
        }

        copy.textContent =
          'Mia with a very long closed preview line that keeps going well past the available width to test whether the collapsed bar stays contained as a single row';

        return {
          rootHeight: root.getBoundingClientRect().height,
          previewHeight: preview.getBoundingClientRect().height,
          copyHeight: copy.getBoundingClientRect().height,
          whiteSpace: getComputedStyle(copy).whiteSpace,
          overflow: getComputedStyle(copy).overflow,
          textOverflow: getComputedStyle(copy).textOverflow,
        };
      });

      assert.ok(
        state.previewHeight <= 40,
        'chat-messages should keep the closed preview row compact instead of letting long copy wrap taller than the bar'
      );
      assert.ok(
        state.copyHeight <= 24,
        'chat-messages should keep long preview copy to a single-line height'
      );
      assert.equal(
        state.whiteSpace,
        'nowrap',
        'chat-messages should force long preview copy onto a single line'
      );
      assert.equal(
        state.overflow,
        'hidden',
        'chat-messages should clip long preview copy inside the closed preview row'
      );
      assert.equal(
        state.textOverflow,
        'ellipsis',
        'chat-messages should show ellipsis when the closed preview copy is too long'
      );
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
});
