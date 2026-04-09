function evenCeil(value) {
  const rounded = Math.ceil(value);
  return rounded % 2 === 0 ? rounded : rounded + 1;
}

export function computeClipRect(...boxes) {
  const definedBoxes = boxes.filter(Boolean);
  if (definedBoxes.length === 0) {
    throw new Error('computeClipRect requires at least one bounding box');
  }

  const left = Math.min(...definedBoxes.map((box) => box.x));
  const top = Math.min(...definedBoxes.map((box) => box.y));
  const right = Math.max(...definedBoxes.map((box) => box.x + box.width));
  const bottom = Math.max(...definedBoxes.map((box) => box.y + box.height));

  const x = Math.floor(left);
  const y = Math.floor(top);

  return {
    x,
    y,
    width: evenCeil(right - x),
    height: evenCeil(bottom - y),
  };
}

export async function setPreviewOpenState(page, selector, openClass, isOpen) {
  const targetEl = page.locator(selector).first();
  await targetEl.waitFor({ state: 'visible' });
  await targetEl.evaluate(
    (element, { className, enabled }) => {
      element.classList.toggle(className, enabled);
    },
    { className: openClass, enabled: isOpen }
  );
}

export async function measureCaptureClip(page, options) {
  const {
    captureSelector,
    hoverSelector,
    toggleSelector,
    openClass,
    measureDurationMs = 320,
    sampleIntervalMs = 80,
    resetMs = 120,
  } = options;

  const captureEl = page.locator(captureSelector).first();
  const interactionSelector = toggleSelector ?? hoverSelector;
  const interactionEl = interactionSelector ? page.locator(interactionSelector).first() : null;

  await captureEl.waitFor({ state: 'visible' });
  if (interactionEl) {
    await interactionEl.waitFor({ state: 'visible' });
  }

  const closedBox = await captureEl.boundingBox();
  if (!closedBox) {
    throw new Error(`Element not found: ${captureSelector}`);
  }

  if (toggleSelector && openClass) {
    await setPreviewOpenState(page, toggleSelector, openClass, true);
  } else if (interactionEl) {
    await interactionEl.hover({ force: true });
  }
  const boxes = [closedBox];

  let elapsed = 0;
  while (elapsed < measureDurationMs) {
    const waitMs = Math.min(sampleIntervalMs, measureDurationMs - elapsed);
    await page.waitForTimeout(waitMs);
    elapsed += waitMs;

    const sampledBox = await captureEl.boundingBox();
    if (sampledBox) {
      boxes.push(sampledBox);
    }
  }

  if (toggleSelector && openClass) {
    await setPreviewOpenState(page, toggleSelector, openClass, false);
  } else {
    await page.mouse.move(0, 0);
  }
  await page.waitForTimeout(resetMs);

  return computeClipRect(...boxes);
}

export async function resetCaptureState(page, pageUrl, settleMs = 0) {
  await page.goto(pageUrl);
  if (settleMs > 0) {
    await page.waitForTimeout(settleMs);
  }
}
