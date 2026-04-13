import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { startCaptureServer } from './capture-gifs.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('lean preview pages keep #workskin bounded to the visible effect', async () => {
  const server = startCaptureServer(ROOT, 0);
  await once(server, 'listening');
  const { port } = server.address();
  const browser = await chromium.launch();

  try {
    const cases = [
      { name: 'chat-messages', minWidth: 300, maxWidth: 560 },
      { name: 'polaroid', minWidth: 200, maxWidth: 320 },
      { name: 'secret-divider', minWidth: 320, maxWidth: 620 },
      { name: 'typewriter', minWidth: 420, maxWidth: 760 },
      { name: 'envelope', minWidth: 500, maxWidth: 820 },
    ];

    for (const effect of cases) {
      const page = await browser.newPage({
        viewport: { width: 1400, height: 1200 },
        deviceScaleFactor: 2,
      });

      try {
        const url = `http://127.0.0.1:${port}/effects/${effect.name}/preview.html`;
        await page.goto(url);
        const workskin = page.locator('#workskin');
        await workskin.waitFor({ state: 'visible' });

        const workskinBox = await workskin.boundingBox();
        assert.ok(workskinBox, `${effect.name} preview should expose #workskin`);
        assert.ok(
          workskinBox.width >= effect.minWidth,
          `${effect.name} preview should keep #workskin wide enough for the visible effect`
        );
        assert.ok(
          workskinBox.width <= effect.maxWidth,
          `${effect.name} preview should not leave #workskin stretched across the full shell width`
        );
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
});

test('preview example images stay inside their published slots', async () => {
  const server = startCaptureServer(ROOT, 0);
  await once(server, 'listening');
  const { port } = server.address();
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
        const url = `http://127.0.0.1:${port}/effects/${effect.name}/preview.html`;
        await page.goto(url);

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
    server.close();
  }
});
