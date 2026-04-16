import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

import { previewUrlForEffect } from '../../tools/capture-gifs.mjs';

test('marginalia hover reveals notes without collapsing the sheet', async () => {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1400, height: 1200 },
      deviceScaleFactor: 2,
    });

    try {
      await page.goto(previewUrlForEffect('marginalia'));

      const hoverTarget = page.locator('#workskin .marginalia--hover').first();
      await hoverTarget.waitFor({ state: 'visible' });
      await hoverTarget.hover({ force: true });
      await page.waitForTimeout(250);

      const state = await page.evaluate(() => {
        const root = document.querySelector('#workskin .marginalia--hover');
        const addition = document.querySelector('#workskin .marginalia .addition');
        const notes = document.querySelector('#workskin .marginalia .notes');
        if (!root || !addition || !notes) {
          throw new Error('marginalia preview is missing the hover root, addition, or notes rail');
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
        'marginalia hover should preserve a visible sheet instead of collapsing the hover target'
      );
      assert.ok(
        state.notesOpacity > 0.5,
        'marginalia hover should reveal the notes rail'
      );
      assert.ok(
        state.additionOpacity > 0.2,
        'marginalia hover should reveal the added sentence'
      );
      assert.notEqual(
        state.additionMaxHeight,
        '0px',
        'marginalia hover should expand the addition block'
      );
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test('casefile hover pulls the tucked evidence slips into view', async () => {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1400, height: 1200 },
      deviceScaleFactor: 2,
    });

    try {
      await page.goto(previewUrlForEffect('casefile'));

      const hoverTarget = page.locator('#workskin .casefile--hover').first();
      await hoverTarget.waitFor({ state: 'visible' });

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

      await hoverTarget.hover({ force: true });
      await page.waitForTimeout(250);

      const after = await page.evaluate(() => {
        const root = document.querySelector('#workskin .casefile--hover');
        const ticket = document.querySelector('#workskin .casefile .slip--ticket');
        const note = document.querySelector('#workskin .casefile .slip--note');
        if (!root || !ticket || !note) {
          throw new Error('casefile preview is missing the hover root or evidence slips');
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
        'casefile hover should preserve a visible dossier surface instead of collapsing the hover target'
      );
      assert.notEqual(
        after.ticketLeft,
        before.ticketLeft,
        'casefile hover should pull the ticket slip farther out of the sleeve'
      );
      assert.ok(
        after.ticketTop !== before.ticketTop || after.noteLeft !== before.noteLeft,
        'casefile hover should shift at least one tucked slip into a new visible position'
      );
      assert.ok(
        after.noteOpacity > 0.6,
        'casefile hover should make the note slip clearly legible'
      );
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test('route-map hover expands stop notes while keeping the track readable', async () => {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1400, height: 1200 },
      deviceScaleFactor: 2,
    });

    try {
      await page.goto(previewUrlForEffect('route-map'));

      const hoverTarget = page.locator('#workskin .route-map--hover').first();
      await hoverTarget.waitFor({ state: 'visible' });
      await hoverTarget.hover({ force: true });
      await page.waitForTimeout(250);

      const state = await page.evaluate(() => {
        const root = document.querySelector('#workskin .route-map--hover');
        const firstNote = document.querySelector('#workskin .route-map .stop--start .note');
        const middlePlace = document.querySelector('#workskin .route-map .stop--mid .place');
        if (!root || !firstNote || !middlePlace) {
          throw new Error('route-map preview is missing the hover root, stop note, or place label');
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
        'route-map hover should preserve a visible route surface instead of collapsing the hover target'
      );
      assert.ok(
        state.noteOpacity > 0.4,
        'route-map hover should reveal the stop note'
      );
      assert.notEqual(
        state.noteMaxHeight,
        '0px',
        'route-map hover should expand the stop note block'
      );
      assert.ok(
        state.placeOpacity > 0.9,
        'route-map hover should keep the place labels readable'
      );
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
});
