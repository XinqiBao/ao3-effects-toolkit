import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

import { previewUrlForEffect } from '../../tools/capture-gifs.mjs';

const EFFECTS = [
  { name: 'envelope', root: '.envelope' },
  { name: 'chat-messages', root: '.chat' },
  { name: 'polaroid', root: '.polaroid' },
  { name: 'secret-divider', root: '.secret-divider' },
  { name: 'typewriter', root: '.typewriter' },
  { name: 'marginalia', root: '.marginalia' },
  { name: 'casefile', root: '.casefile' },
  { name: 'route-map', root: '.route-map' },
];

test('every effect uses the same trigger to open and close', async () => {
  const browser = await chromium.launch();

  try {
    for (const effect of EFFECTS) {
      const page = await browser.newPage({
        viewport: { width: 1400, height: 1200 },
        deviceScaleFactor: 2,
      });

      try {
        await page.goto(previewUrlForEffect(effect.name));
        const root = page.locator(`#workskin ${effect.root}`).first();
        const trigger = root.locator(':scope > .trigger');
        await trigger.waitFor({ state: 'visible' });

        assert.equal(await root.evaluate((element) => element.open), false);
        await trigger.click({ force: true });
        assert.equal(await root.evaluate((element) => element.open), true);
        await trigger.click({ force: true });
        assert.equal(await root.evaluate((element) => element.open), false);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
});

test('every effect toggles with touch input', async () => {
  const browser = await chromium.launch();

  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();

    try {
      for (const effect of EFFECTS) {
        await page.goto(previewUrlForEffect(effect.name));
        const root = page.locator(`#workskin ${effect.root}`).first();
        const trigger = root.locator(':scope > .trigger');
        await trigger.waitFor({ state: 'visible' });

        await trigger.tap({ force: true });
        assert.equal(await root.evaluate((element) => element.open), true);
        await trigger.tap({ force: true });
        assert.equal(await root.evaluate((element) => element.open), false);
      }
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
  }
});

test('envelope stays rendered while its close transition returns to the base state', async () => {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1400, height: 1200 },
      deviceScaleFactor: 2,
    });

    try {
      await page.goto(previewUrlForEffect('envelope'));
      const root = page.locator('#workskin .envelope').first();
      const trigger = root.locator(':scope > .trigger');
      const closedHeight = await root.evaluate((element) => element.getBoundingClientRect().height);

      await trigger.click({ force: true });
      await page.waitForTimeout(1150);
      const openHeight = await root.evaluate((element) => element.getBoundingClientRect().height);

      await trigger.click({ force: true });
      await page.waitForTimeout(150);
      const closingHeight = await root.evaluate((element) => element.getBoundingClientRect().height);

      assert.equal(await root.evaluate((element) => element.open), false);
      assert.ok(closingHeight < openHeight, 'closing should begin moving toward the base height');
      assert.ok(closingHeight > closedHeight, 'closing content should remain rendered during the transition');

      await page.waitForTimeout(1000);
      const settledHeight = await root.evaluate((element) => element.getBoundingClientRect().height);
      assert.ok(Math.abs(settledHeight - closedHeight) <= 2, 'closing should settle at the base height');
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test('marginalia tap reveals notes without collapsing the sheet', async () => {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1400, height: 1200 },
      deviceScaleFactor: 2,
    });

    try {
      await page.goto(previewUrlForEffect('marginalia'));

      const interactionTarget = page.locator('#workskin .marginalia > .trigger').first();
      await interactionTarget.waitFor({ state: 'visible' });
      await interactionTarget.click({ force: true });
      await page.waitForTimeout(250);

      const state = await page.evaluate(() => {
        const root = document.querySelector('#workskin .marginalia');
        const addition = document.querySelector('#workskin .marginalia .addition');
        const notes = document.querySelector('#workskin .marginalia .notes');
        if (!root || !addition || !notes) {
          throw new Error('marginalia preview is missing the effect root, addition, or notes rail');
        }

        const rootRect = root.getBoundingClientRect();
        const notesStyle = getComputedStyle(notes);
        const additionStyle = getComputedStyle(addition);

        return {
          rootWidth: rootRect.width,
          notesOpacity: Number(notesStyle.opacity),
          additionOpacity: Number(additionStyle.opacity),
          additionMaxHeight: additionStyle.maxHeight,
        };
      });

      assert.ok(
        state.rootWidth > 260,
        'marginalia tap should preserve a visible sheet instead of collapsing the trigger'
      );
      assert.ok(
        state.notesOpacity > 0.5,
        'marginalia tap should reveal the notes rail'
      );
      assert.ok(
        state.additionOpacity > 0.2,
        'marginalia tap should reveal the added sentence'
      );
      assert.notEqual(
        state.additionMaxHeight,
        '0px',
        'marginalia tap should expand the addition block'
      );
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test('casefile tap pulls the tucked evidence slips into view', async () => {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1400, height: 1200 },
      deviceScaleFactor: 2,
    });

    try {
      await page.goto(previewUrlForEffect('casefile'));

      const interactionTarget = page.locator('#workskin .casefile > .trigger').first();
      await interactionTarget.waitFor({ state: 'visible' });

      const before = await page.evaluate(() => {
        const ticket = document.querySelector('#workskin .casefile .slip--ticket');
        const note = document.querySelector('#workskin .casefile .slip--note');
        if (!ticket || !note) {
          throw new Error('casefile preview is missing the tucked evidence slips');
        }

        return {
          ticketLeft: ticket.getBoundingClientRect().left,
          ticketTop: ticket.getBoundingClientRect().top,
          noteLeft: note.getBoundingClientRect().left,
        };
      });

      await interactionTarget.click({ force: true });
      await page.waitForTimeout(250);

      const after = await page.evaluate(() => {
        const root = document.querySelector('#workskin .casefile');
        const ticket = document.querySelector('#workskin .casefile .slip--ticket');
        const note = document.querySelector('#workskin .casefile .slip--note');
        if (!root || !ticket || !note) {
          throw new Error('casefile preview is missing the effect root or evidence slips');
        }

        return {
          rootHeight: root.getBoundingClientRect().height,
          ticketLeft: ticket.getBoundingClientRect().left,
          ticketTop: ticket.getBoundingClientRect().top,
          noteLeft: note.getBoundingClientRect().left,
          noteOpacity: Number(getComputedStyle(note).opacity),
        };
      });

      assert.ok(
        after.rootHeight > 180,
        'casefile tap should preserve a visible dossier surface instead of collapsing the trigger'
      );
      assert.notEqual(
        after.ticketLeft,
        before.ticketLeft,
        'casefile tap should pull the ticket slip farther out of the sleeve'
      );
      assert.ok(
        after.ticketTop !== before.ticketTop || after.noteLeft !== before.noteLeft,
        'casefile tap should shift at least one tucked slip into a new visible position'
      );
      assert.ok(
        after.noteOpacity > 0.6,
        'casefile tap should make the note slip clearly legible'
      );
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test('route-map tap expands stop notes while keeping the track readable', async () => {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1400, height: 1200 },
      deviceScaleFactor: 2,
    });

    try {
      await page.goto(previewUrlForEffect('route-map'));

      const interactionTarget = page.locator('#workskin .route-map > .trigger').first();
      await interactionTarget.waitFor({ state: 'visible' });
      await interactionTarget.click({ force: true });
      await page.waitForTimeout(250);

      const state = await page.evaluate(() => {
        const root = document.querySelector('#workskin .route-map');
        const firstNote = document.querySelector('#workskin .route-map .stop--start .note');
        const middlePlace = document.querySelector('#workskin .route-map .stop--mid .place');
        if (!root || !firstNote || !middlePlace) {
          throw new Error('route-map preview is missing the effect root, stop note, or place label');
        }

        return {
          rootWidth: root.getBoundingClientRect().width,
          noteOpacity: Number(getComputedStyle(firstNote).opacity),
          noteMaxHeight: getComputedStyle(firstNote).maxHeight,
          placeOpacity: Number(getComputedStyle(middlePlace).opacity),
        };
      });

      assert.ok(
        state.rootWidth > 320,
        'route-map tap should preserve a visible route surface instead of collapsing the trigger'
      );
      assert.ok(
        state.noteOpacity > 0.4,
        'route-map tap should reveal the stop note'
      );
      assert.notEqual(
        state.noteMaxHeight,
        '0px',
        'route-map tap should expand the stop note block'
      );
      assert.ok(
        state.placeOpacity > 0.9,
        'route-map tap should keep the place labels readable'
      );
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
});
