import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

import { previewUrlForEffect } from '../../tools/capture-gifs.mjs';

test('preview boundary contract keeps reviewed #workskin frames bounded to the visible effect', async () => {
  const browser = await chromium.launch();

  try {
    const cases = [
      { name: 'envelope', hoverSelector: '#workskin .envelope--hover', minWidth: 520, maxWidth: 580, minHeight: 600, maxHeight: 660 },
      { name: 'chat-messages', hoverSelector: '#workskin .chat--hover', minWidth: 500, maxWidth: 540, minHeight: 560, maxHeight: 620 },
      { name: 'polaroid', hoverSelector: '#workskin .polaroid--hover', minWidth: 230, maxWidth: 270, minHeight: 330, maxHeight: 380 },
      { name: 'secret-divider', hoverSelector: '#workskin .secret-divider--hover', minWidth: 380, maxWidth: 460, minHeight: 160, maxHeight: 220 },
      { name: 'typewriter', hoverSelector: '#workskin .typewriter--hover', minWidth: 460, maxWidth: 540, minHeight: 160, maxHeight: 220 },
      { name: 'marginalia', hoverSelector: '#workskin .marginalia--hover', minWidth: 560, maxWidth: 620, minHeight: 220, maxHeight: 280 },
      { name: 'casefile', hoverSelector: '#workskin .casefile--hover', minWidth: 560, maxWidth: 620, minHeight: 280, maxHeight: 330 },
      { name: 'route-map', hoverSelector: '#workskin .route-map--hover', minWidth: 620, maxWidth: 680, minHeight: 220, maxHeight: 260 },
    ];

    for (const effect of cases) {
      const page = await browser.newPage({
        viewport: { width: 1400, height: 1200 },
        deviceScaleFactor: 2,
      });

      try {
        await page.goto(previewUrlForEffect(effect.name));
        const workskin = page.locator('#workskin');
        await workskin.waitFor({ state: 'visible' });

        const workskinBox = await workskin.boundingBox();
        const hoverTarget = page.locator(effect.hoverSelector).first();
        assert.ok(workskinBox, `${effect.name} preview should expose #workskin`);
        assert.ok(
          workskinBox.width >= effect.minWidth,
          `${effect.name} preview should keep #workskin wide enough for the visible effect`
        );
        assert.ok(
          workskinBox.width <= effect.maxWidth,
          `${effect.name} preview should not leave #workskin stretched across the full shell width`
        );
        assert.ok(
          workskinBox.height >= effect.minHeight,
          `${effect.name} preview should keep #workskin tall enough for the visible effect`
        );
        assert.ok(
          workskinBox.height <= effect.maxHeight,
          `${effect.name} preview should keep #workskin from growing past the visible effect`
        );

        await hoverTarget.hover({ force: true });
        await page.waitForTimeout(1800);

        const openBox = await hoverTarget.boundingBox();
        assert.ok(openBox, `${effect.name} preview should expose the hovered effect root`);
        assert.ok(
          openBox.x >= workskinBox.x - 1,
          `${effect.name} hover state should stay inside the #workskin left boundary`
        );
        assert.ok(
          openBox.y >= workskinBox.y - 1,
          `${effect.name} hover state should stay inside the #workskin top boundary`
        );
        assert.ok(
          openBox.x + openBox.width <= workskinBox.x + workskinBox.width + 1,
          `${effect.name} hover state should stay inside the #workskin right boundary`
        );
        assert.ok(
          openBox.y + openBox.height <= workskinBox.y + workskinBox.height + 1,
          `${effect.name} hover state should stay inside the #workskin bottom boundary`
        );
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
});

test('preview example images stay inside their published slots', async () => {
  const browser = await chromium.launch();

  try {
    const cases = [
      {
        name: 'envelope',
        imageSelector: '#workskin .envelope .stamp img',
        slotSelector: '#workskin .envelope .stamp',
        requireFullWidth: false,
      },
      {
        name: 'polaroid',
        imageSelector: '#workskin .polaroid .photo img',
        slotSelector: '#workskin .polaroid .photo',
        requireFullWidth: true,
      },
    ];

    for (const effect of cases) {
      const page = await browser.newPage({
        viewport: { width: 1400, height: 1200 },
        deviceScaleFactor: 2,
      });

      try {
        await page.goto(previewUrlForEffect(effect.name));

        const image = page.locator(effect.imageSelector);
        const slot = page.locator(effect.slotSelector);
        await image.waitFor({ state: 'visible' });
        await slot.waitFor({ state: 'visible' });

        const imageBox = await image.boundingBox();
        const slotBox = await slot.boundingBox();

        assert.ok(imageBox, `${effect.name} preview should expose the example image`);
        assert.ok(slotBox, `${effect.name} preview should expose the published image slot`);
        assert.ok(
          imageBox.width <= slotBox.width + 1,
          `${effect.name} preview image should not render wider than its slot`
        );
        if (effect.requireFullWidth) {
          assert.ok(
            imageBox.width >= slotBox.width - 4,
            `${effect.name} preview image should still read as a filled photo surface`
          );
        } else {
          assert.ok(
            imageBox.height <= slotBox.height + 1,
            `${effect.name} preview image should not render taller than its slot`
          );
        }
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
});
