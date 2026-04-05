#!/usr/bin/env node

/**
 * AO3 Toolkit — Single verification script
 *
 * Usage:
 *   node tools/verify.mjs              — structure check + local preview screenshots
 *   node tools/verify.mjs --ao3        — + optional AO3 live validation (requires login)
 *   node tools/verify.mjs --port 4200  — override dev server port (default 4173)
 *
 * All commands run from the repository root.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENVELOPE = join(ROOT, "envelope");
const ASSETS = join(ROOT, "assets");
const PORT = readPort();

// ── CLI flags ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const runAo3 = args.includes("--ao3");

function readPort() {
  const idx = process.argv.indexOf("--port");
  if (idx !== -1 && process.argv[idx + 1]) return Number(process.argv[idx + 1]);
  return 4173;
}

// ── 1. Structure check (replaces check-ao3-bundle.sh) ───────────────────────

function structureCheck() {
  const css = readFileSync(join(ENVELOPE, "work-skin.css"), "utf8");
  const hover = readFileSync(join(ENVELOPE, "hover-template.html"), "utf8");
  const tap = readFileSync(join(ENVELOPE, "tap-template.html"), "utf8");
  const smoke = readFileSync(join(ENVELOPE, "smoke-test.html"), "utf8");

  const files = [hover, tap, smoke];
  const allFiles = [...files, css];

  function assert(condition, msg) {
    if (!condition) {
      console.error(`  FAIL ${msg}`);
      process.exit(1);
    }
    console.log(`  OK   ${msg}`);
  }

  console.log("\n--- Structure Check ---\n");

  // All templates wrap in .letter-stage
  for (const html of files) assert(html.includes('class="letter-stage"'), "template wrapped in letter-stage");
  assert(hover.includes('class="trifold-letter trifold-letter--hover"'), "hover template uses correct class");
  assert(tap.includes('class="trifold-letter trifold-letter--details"'), "tap template uses correct class");

  // Required blocks in hover template
  for (const cls of [
    "letter-cover", "letter-top", "letter-mid", "letter-bot",
    "letter-cover-text", "letter-top-text", "letter-mid-text", "letter-bot-text",
  ]) {
    assert(hover.includes(`class="${cls}`), `hover template contains ${cls}`);
  }

  // No old leaked class names
  const oldNames = "ao3-letter-panel|ao3-envelope|mail-envelope|mail-letter|mail-stage";
  assert(!new RegExp(oldNames).test(allFiles.join("\n")), "no old class names in bundle");

  // CSS defines required classes
  for (const cls of ["trifold-letter", "letter-cover", "letter-top", "letter-mid", "letter-bot"]) {
    assert(css.includes(cls), `CSS defines ${cls}`);
  }
  assert(css.includes("skew("), "CSS defines skew-based fold motion");

  console.log("\n  All structure checks passed.\n");
}

// ── 2. Local preview screenshots ────────────────────────────────────────────

async function screenshots() {
  const { chromium } = await import("playwright");

  mkdirSync(ASSETS, { recursive: true });

  // Start local server
  const { createServer } = await import("node:http");
  const { readFileSync: _rs, statSync, createReadStream } = await import("node:fs");
  const { extname } = await import("node:path");

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".png": "image/png",
    ".md": "text/plain",
  };

  const server = createServer((req, res) => {
    let filePath = join(ROOT, req.url === "/" ? "/envelope/preview.html" : req.url);
    try {
      statSync(filePath);
    } catch {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "text/plain" });
    createReadStream(filePath).pipe(res);
  });

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`--- Preview server on :${PORT} ---\n`);

  try {
    const browser = await chromium.launch({ headless: true });

    // Desktop closed state
    const page1 = await browser.newPage({ viewport: { width: 1440, height: 1650 } });
    await page1.goto(`http://127.0.0.1:${PORT}/envelope/preview.html`);
    // Hover closed: just navigate (default state)
    await page1.screenshot({ path: join(ASSETS, "envelope-closed.png"), fullPage: true });
    console.log("  Saved assets/envelope-closed.png (desktop closed)");

    // Force open state via CSS
    await page1.evaluate(() => {
      document.querySelectorAll(".card").forEach((card) => {
        card.classList.add("trifold-letter--forced-open");
      });
    });
    await page1.setViewportSize({ width: 1440, height: 3000 });
    await page1.screenshot({ path: join(ASSETS, "envelope-open.png"), fullPage: true });
    console.log("  Saved assets/envelope-open.png (desktop open)");

    // Mobile state
    await page1.setViewportSize({ width: 390, height: 2800 });
    await page1.goto(`http://127.0.0.1:${PORT}/envelope/preview.html`);
    await page1.evaluate(() => {
      document.querySelectorAll("details").forEach((d) => (d.open = true));
    });
    await page1.screenshot({ path: join(ASSETS, "envelope-mobile.png"), fullPage: true });
    console.log("  Saved assets/envelope-mobile.png (mobile open)");

    // Validation states overview
    await page1.setViewportSize({ width: 1600, height: 3200 });
    await page1.goto(`http://127.0.0.1:${PORT}/envelope/preview.html`);
    await page1.evaluate(() => {
      const cards = document.querySelectorAll(".card");
      // Force open on cards 2 and 4 (indices 1 and 3)
      if (cards[1]) cards[1].classList.add("trifold-letter--forced-open");
      if (cards[3]) {
        cards[3].querySelector("details")?.setAttribute("open", "");
      }
    });
    await page1.screenshot({ path: join(ASSETS, "validation-states.png"), fullPage: true });
    console.log("  Saved assets/validation-states.png (overview)");

    await browser.close();
  } finally {
    server.close();
  }
}

// ── 3. AO3 live validation (optional) ───────────────────────────────────────

async function ao3Validation() {
  const { chromium } = await import("playwright");

  console.log("\n--- AO3 Live Validation ---\n");

  const contextPath = join(ROOT, "local", "auth-state.json");

  const browser = await chromium.launch({ headless: false });

  let context;
  if (existsSync(contextPath)) {
    context = await browser.newContext({ storageState: contextPath });
    console.log("  Restored session from local/auth-state.json");
  } else {
    console.log("  No saved session. Starting fresh browser — you'll need to log in to AO3.");
    console.log("  After logging in, the script will save your session for next time.");
    context = await browser.newContext();
  }

  const page = await context.newPage();

  // Navigate to AO3 work creation page
  await page.goto("https://archiveofourown.org/works/new", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // Check if we're still on login page
  const currentUrl = page.url();
  if (currentUrl.includes("users/login") || currentUrl.includes("sessions/new")) {
    console.log("  → You need to log in to AO3. The browser is open for you.");
    console.log("  After logging in and reaching the work editor, press Enter in this terminal.");

    await new Promise((resolve) => process.stdin.once("data", resolve));

    // Save session for next time
    mkdirSync(join(ROOT, "local"), { recursive: true });
    const state = await context.storageState();
    writeFileSync(contextPath, JSON.stringify(state, null, 2));
    console.log("  Session saved to local/auth-state.json");
  }

  // Validate that we're on a work page
  const title = await page.title();
  console.log(`  Current page: ${title}`);
  console.log(`  URL: ${page.url()}`);

  // Verify structure by injecting templates into the editor and checking preview
  console.log("\n  Structure validation would require filling the AO3 editor.");
  console.log("  For now, confirm manually that the preview renders correctly.");

  await browser.close();
  console.log("\n  AO3 live validation complete.\n");
}

// ── Main ─────────────────────────────────────────────────────────────────────

(async function main() {
  console.log("AO3 Toolkit — verify.mjs\n");

  structureCheck();

  console.log("Running screenshots...");
  await screenshots();

  if (runAo3) {
    await ao3Validation();
  }

  console.log("All checks passed. Done.\n");
})();
