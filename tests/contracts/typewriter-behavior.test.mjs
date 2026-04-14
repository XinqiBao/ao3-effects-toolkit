import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

import { previewUrlForEffect } from '../../tools/capture-gifs.mjs';

test('typewriter preview hover keeps the reveal area stable long enough to show the first line', async () => {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1400, height: 1200 },
      deviceScaleFactor: 2,
    });

    try {
      await page.goto(previewUrlForEffect('typewriter'));

      const hoverTarget = page.locator('#workskin .typewriter--hover').first();
      await hoverTarget.waitFor({ state: 'visible' });
      await hoverTarget.hover({ force: true });
      await page.waitForTimeout(350);

      const state = await page.evaluate(() => {
        const root = document.querySelector('#workskin .typewriter--hover');
        const firstLine = document.querySelector('#workskin .typewriter .line');
        if (!root || !firstLine) {
          throw new Error('typewriter preview markup is missing the hover container or first line');
        }

        return {
          containerHeight: root.getBoundingClientRect().height,
          lineOpacity: Number(getComputedStyle(firstLine).opacity),
          lineMaxHeight: getComputedStyle(firstLine).maxHeight,
        };
      });

      assert.ok(
        state.containerHeight > 40,
        'typewriter hover should preserve a visible hover area instead of collapsing to zero height'
      );
      assert.ok(
        state.lineOpacity > 0.2,
        'typewriter hover should start revealing the first line before the hover state drops'
      );
      assert.notEqual(
        state.lineMaxHeight,
        '0px',
        'typewriter hover should expand the first line instead of leaving it fully collapsed'
      );
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
});
