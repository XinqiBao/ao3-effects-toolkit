import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

import { previewUrlForEffect } from '../../tools/capture-gifs.mjs';

test('typewriter tap keeps the reveal area stable long enough to show the first line', async () => {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1400, height: 1200 },
      deviceScaleFactor: 2,
    });

    try {
      await page.goto(previewUrlForEffect('typewriter'));

      const interactionTarget = page.locator('#workskin .typewriter > .trigger').first();
      await interactionTarget.waitFor({ state: 'visible' });
      await interactionTarget.click({ force: true });
      await page.waitForTimeout(350);

      const state = await page.evaluate(() => {
        const root = document.querySelector('#workskin .typewriter');
        const firstLine = document.querySelector('#workskin .typewriter .line');
        if (!root || !firstLine) {
          throw new Error('typewriter preview markup is missing the effect root or first line');
        }

        return {
          containerHeight: root.getBoundingClientRect().height,
          lineOpacity: Number(getComputedStyle(firstLine).opacity),
          lineMaxHeight: getComputedStyle(firstLine).maxHeight,
        };
      });

      assert.ok(
        state.containerHeight > 40,
        'typewriter tap should preserve a visible trigger area instead of collapsing to zero height'
      );
      assert.ok(
        state.lineOpacity > 0.2,
        'typewriter tap should start revealing the first line'
      );
      assert.notEqual(
        state.lineMaxHeight,
        '0px',
        'typewriter tap should expand the first line instead of leaving it fully collapsed'
      );
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test('typewriter summary supports keyboard toggling', async () => {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1400, height: 1200 },
      deviceScaleFactor: 2,
    });

    try {
      await page.goto(previewUrlForEffect('typewriter'));

      const root = page.locator('#workskin .typewriter').first();
      const interactionTarget = root.locator(':scope > .trigger');
      await interactionTarget.waitFor({ state: 'visible' });
      await interactionTarget.focus();
      await page.keyboard.press('Enter');
      assert.equal(await root.evaluate((element) => element.open), true);
      await page.keyboard.press('Space');
      assert.equal(await root.evaluate((element) => element.open), false);
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
});
