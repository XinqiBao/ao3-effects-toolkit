import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

import { previewUrlForEffect } from '../../tools/capture-gifs.mjs';

test('chat-messages tap remains open after the pointer moves away', async () => {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1400, height: 1200 },
      deviceScaleFactor: 2,
    });

    try {
      await page.goto(previewUrlForEffect('chat-messages'));

      const root = page.locator('#workskin .chat').first();
      const interactionTarget = root.locator(':scope > .trigger');
      await interactionTarget.waitFor({ state: 'visible' });
      await interactionTarget.click({ force: true });
      await page.waitForTimeout(220);
      await page.mouse.move(10, 10);

      const state = await page.evaluate(() => {
        const root = document.querySelector('#workskin .chat');
        const stack = document.querySelector('#workskin .chat .stack');
        if (!root || !stack) {
          throw new Error('chat-messages preview is missing the effect root or message stack');
        }

        return {
          open: root.open,
          stackOpacity: Number(getComputedStyle(stack).opacity),
        };
      });

      assert.equal(
        state.open,
        true,
        'chat-messages should remain open after the pointer leaves the trigger'
      );
      assert.ok(
        state.stackOpacity > 0.2,
        'chat-messages tap should start revealing the conversation'
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
        const root = document.querySelector('#workskin .chat');
        const preview = root?.querySelector('.preview');
        const copy = root?.querySelector('.preview-copy');
        if (!root || !preview || !copy) {
          throw new Error('chat-messages preview is missing the effect root, preview row, or preview copy');
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
