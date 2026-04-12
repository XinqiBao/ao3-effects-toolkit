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
