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

test('typewriter preview does not thrash hover when the pointer rests on the initial lower edge', async () => {
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

      const initialBox = await hoverTarget.boundingBox();
      assert.ok(initialBox, 'typewriter preview should expose a visible hover target');

      await page.mouse.move(10, 10);
      await page.evaluate(() => {
        const root = document.querySelector('#workskin .typewriter--hover');
        if (!root) {
          throw new Error('typewriter preview markup is missing the hover container');
        }

        window.__typewriterHoverEvents = [];
        ['mouseenter', 'mouseleave'].forEach((type) => {
          root.addEventListener(type, () => {
            window.__typewriterHoverEvents.push(type);
          });
        });
      });

      await page.mouse.move(
        initialBox.x + initialBox.width / 2,
        initialBox.y + initialBox.height - 1
      );
      await page.waitForTimeout(450);

      const state = await page.evaluate(() => {
        const root = document.querySelector('#workskin .typewriter--hover');
        if (!root) {
          throw new Error('typewriter preview markup is missing the hover container');
        }

        return {
          hover: root.matches(':hover'),
          leaveCount: window.__typewriterHoverEvents.filter((type) => type === 'mouseleave').length,
        };
      });

      assert.equal(
        state.leaveCount,
        0,
        'typewriter hover should not oscillate on and off when the pointer stays on the initial lower edge'
      );
      assert.equal(
        state.hover,
        true,
        'typewriter should still be hovered while the pointer rests near the initial lower edge'
      );
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
});
