import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

import { previewUrlForEffect } from '../../tools/capture-gifs.mjs';

const VIEWPORT = { width: 1400, height: 1200 };
const PREVIEW_CASES = [
  { name: 'envelope', hoverSelector: '#workskin .envelope--hover' },
  { name: 'chat-messages', hoverSelector: '#workskin .chat--hover' },
  { name: 'polaroid', hoverSelector: '#workskin .polaroid--hover' },
  { name: 'secret-divider', hoverSelector: '#workskin .secret-divider--hover' },
  { name: 'typewriter', hoverSelector: '#workskin .typewriter--hover' },
  { name: 'marginalia', hoverSelector: '#workskin .marginalia--hover' },
  { name: 'casefile', hoverSelector: '#workskin .casefile--hover' },
  { name: 'route-map', hoverSelector: '#workskin .route-map--hover' },
];
const MAX_WIDTH_SLACK = 120;
const MAX_HEIGHT_SLACK = 160;

test('preview boundary contract keeps #workskin close to the visible effect without freezing exact pixel sizes', async () => {
  const browser = await chromium.launch();

  try {
    for (const effect of PREVIEW_CASES) {
      const page = await browser.newPage({
        viewport: VIEWPORT,
        deviceScaleFactor: 2,
      });

      try {
        await page.goto(previewUrlForEffect(effect.name));
        const workskin = page.locator('#workskin');
        const shell = page.locator('.shell');
        const hoverTarget = page.locator(effect.hoverSelector).first();
        await workskin.waitFor({ state: 'visible' });
        await hoverTarget.waitFor({ state: 'visible' });

        const workskinBox = await workskin.boundingBox();
        const shellBox = await shell.boundingBox();
        assert.ok(workskinBox, `${effect.name} preview should expose #workskin`);
        assert.ok(shellBox, `${effect.name} preview should expose the shared shell`);
        assert.ok(
          workskinBox.width < shellBox.width * 0.8,
          `${effect.name} preview should not stretch #workskin across most of the shared shell`
        );
        assert.ok(
          workskinBox.height < VIEWPORT.height * 0.85,
          `${effect.name} preview should keep #workskin from dominating most of the viewport`
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
        assert.ok(
          workskinBox.width + 1 >= openBox.width,
          `${effect.name} preview should keep #workskin wide enough for the visible effect`
        );
        assert.ok(
          workskinBox.height + 1 >= openBox.height,
          `${effect.name} preview should keep #workskin tall enough for the visible effect`
        );
        assert.ok(
          workskinBox.width <= openBox.width + MAX_WIDTH_SLACK,
          `${effect.name} preview should keep #workskin close to the visible effect instead of freezing an exact width window`
        );
        assert.ok(
          workskinBox.height <= openBox.height + MAX_HEIGHT_SLACK,
          `${effect.name} preview should keep #workskin close to the visible effect instead of freezing an exact height window`
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
