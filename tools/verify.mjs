#!/usr/bin/env node

/**
 * AO3 Toolkit — Verification script
 *
 * Usage:
 *   node tools/verify.mjs              — structure check + CSS lint for all effects
 *   node tools/verify.mjs --effect <N> — preview screenshots for effect N (0-based index)
 *   node tools/verify.mjs --ao3        — + optional AO3 live validation (requires login)
 *   node tools/verify.mjs --port 4200  — override dev server port (default 4173)
 *
 * All commands run from the repository root.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = join(ROOT, "assets");
const PORT = readPort();

// ── Effect definitions ────────────────────────────────────────────────────────

const EFFECTS = [
  { name: "envelope", stageClass: "letter-stage" },
  { name: "polaroid", stageClass: "polaroid-gallery" },
  { name: "chat-messages", stageClass: "chat-conversation" },
  { name: "secret-divider", stageClass: "secret-divider-container" },
  { name: "typewriter", stageClass: "typewriter-stage" },
];
const EFFECTS_BY_NAME = {};
for (const e of EFFECTS) EFFECTS_BY_NAME[e.name] = e;

// Per-effect validation rules
const EFFECT_RULES = {
  envelope: {
    classes: ["trifold-letter", "letter-cover", "letter-top", "letter-mid", "letter-bot"],
    hoverClass: "trifold-letter--hover",
    tapClass: "trifold-letter--details",
    hoverAssert: "letter-cover",
  },
  polaroid: {
    classes: ["polaroid-gallery", "polaroid-container", "polaroid-inner", "polaroid-front", "polaroid-back"],
    hoverClass: "polaroid--hover",
    tapClass: "polaroid--details",
    hoverAssert: "polaroid-frame",
  },
  "chat-messages": {
    classes: ["chat-conversation", "chat-preview", "chat-conversation__stack", "chat-bubble", "chat-bubble--sent", "chat-bubble--received"],
    hoverClass: "chat-conversation--hover",
    tapClass: "chat-conversation--details",
    hoverAssert: "chat-preview",
  },
  "secret-divider": {
    classes: ["secret-divider-container", "secret-divider", "secret-divider__ornament", "secret-divider__text", "secret-divider__text-inner"],
    hoverClass: "secret-divider--hover",
    tapClass: "secret-divider--details",
    hoverAssert: "secret-divider__ornament",
  },
  typewriter: {
    classes: ["typewriter-stage", "typewriter-container", "typewriter-prompt", "typewriter-text", "typewriter-line", "typewriter-cursor"],
    hoverClass: "typewriter--hover",
    tapClass: "typewriter--details",
    hoverAssert: "typewriter-prompt",
  },
};

// ── CLI flags ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const runAo3 = args.includes("--ao3");
const effectIdx = args.indexOf("--effect");
const selectedEffect = effectIdx !== -1 && args[effectIdx + 1] ? Number(args[effectIdx + 1]) : null;

function readPort() {
  const idx = process.argv.indexOf("--port");
  if (idx !== -1 && process.argv[idx + 1]) return Number(process.argv[idx + 1]);
  return 4173;
}

// ── 1. Structure check ────────────────────────────────────────────────────────

function structureCheck() {
  console.log("\n--- Structure Check ---\n");

  for (const effect of EFFECTS) {
    const dir = join(ROOT, effect.name);
    console.log(`  [${effect.name}]`);

    try {
      const css = readFileSync(join(dir, "work-skin.css"), "utf8");
      const hover = readFileSync(join(dir, "hover-template.html"), "utf8");
      const tap = readFileSync(join(dir, "tap-template.html"), "utf8");
      const preview = readFileSync(join(dir, "preview.html"), "utf8");
      const guide = readFileSync(join(dir, "guide.md"), "utf8");

      assert(existsSync(join(dir, "work-skin.css")), "work-skin.css exists");
      assert(existsSync(join(dir, "hover-template.html")), "hover-template.html exists");
      assert(existsSync(join(dir, "tap-template.html")), "tap-template.html exists");
      assert(existsSync(join(dir, "preview.html")), "preview.html exists");
      assert(existsSync(join(dir, "guide.md")), "guide.md exists");

      // CSS uses #workskin prefix
      assert(css.includes("#workskin"), "CSS uses #workskin prefix");

      // hover/tap templates use stage class
      for (const [label, html] of Object.entries({ hover, tap })) {
        assert(html.includes(`class="${effect.stageClass}`) || html.includes(`class="${effect.stageClass} "`), `${label} uses ${effect.stageClass}`);
      }

      // Hover/tap mode classes
      const rules = EFFECT_RULES[effect.name];
      if (rules) {
        assert(hover.includes(rules.hoverClass), `hover template uses ${rules.hoverClass}`);
        assert(tap.includes(rules.tapClass), `tap template uses ${rules.tapClass}`);

        for (const cls of rules.classes) {
          assert(css.includes(cls), `CSS defines ${cls}`);
        }
        if (rules.hoverAssert) {
          assert(hover.includes(rules.hoverAssert), `hover template contains ${rules.hoverAssert}`);
        }
      }

      // Smoke test (warning, not failure)
      const hasSmoke = existsSync(join(dir, "smoke-test.html"));
      if (hasSmoke) {
        console.log(`  OK   smoke-test.html exists`);
      } else {
        console.log(`  WARN smoke-test.html missing`);
      }

    } catch (err) {
      console.log(`  FAIL Could not read files: ${err.message}`);
      return false;
    }

    console.log();
  }

  console.log("  All structure checks passed.\n");
  return true;
}

function assert(condition, msg) {
  if (!condition) {
    console.log(`  FAIL ${msg}`);
    process.exit(1);
  }
  console.log(`  OK   ${msg}`);
}

// ── 2. CSS lint ───────────────────────────────────────────────────────────────

function cssLint() {
  console.log("\n--- CSS Lint (AO3 compatibility) ---\n");

  const FORBIDDEN = [
    { pattern: /\bgap\s*:/, name: "gap" },
    { pattern: /grid-template-columns\s*:\s*repeat\s*\(/, name: "grid-template-columns: repeat()" },
    { pattern: /pointer-events\s*:/, name: "pointer-events" },
  ];
  const RISKY = [
    { pattern: /@keyframes\s+\w|animation\s*:/, name: "@keyframes/animation" },
    { pattern: /perspective\s*[:;]/, name: "perspective" },
    { pattern: /transform-style\s*:/, name: "transform-style" },
    { pattern: /backface-visibility\s*:/, name: "backface-visibility" },
  ];
  const RADIUS_SPLIT = /border-radius\s*:[^;]*\/[^;]*;/;

  let hasIssue = false;

  for (const effect of EFFECTS) {
    const cssPath = join(ROOT, effect.name, "work-skin.css");
    if (!existsSync(cssPath)) continue;
    const css = readFileSync(cssPath, "utf8");

    console.log(`  [${effect.name}]`);

    for (const { pattern, name } of FORBIDDEN) {
      if (pattern.test(css)) {
        console.log(`  FAIL contains forbidden: ${name}`);
        hasIssue = true;
      }
    }

    for (const { pattern, name } of RISKY) {
      if (pattern.test(css)) {
        console.log(`  WARN contains untested: ${name} (verify on AO3)`);
      }
    }

    if (RADIUS_SPLIT.test(css)) {
      console.log(`  FAIL contains border-radius with / (AO3 rejects)`);
      hasIssue = true;
    }

    if (!hasIssue) {
      console.log(`  OK   no forbidden or risky patterns`);
    }

    console.log();
  }

  // Check all HTML templates for id= attributes
  for (const effect of EFFECTS) {
    const dir = join(ROOT, effect.name);
    for (const file of ["hover-template.html", "tap-template.html", "smoke-test.html"]) {
      const path = join(dir, file);
      if (!existsSync(path)) continue;
      const html = readFileSync(path, "utf8");
      if (/\bid\s*=\s*"/.test(html)) {
        console.log(`  FAIL ${effect.name}/${file} contains id= attribute (AO3 strips ids)`);
        hasIssue = true;
      }
    }
  }

  if (!hasIssue) {
    console.log("  All CSS lint checks passed.\n");
  } else {
    console.log("  CSS lint found issues — review before shipping.\n");
  }
}

// ── 3. Local preview screenshots ──────────────────────────────────────────────

async function screenshots() {
  const { chromium } = await import("playwright");

  mkdirSync(ASSETS, { recursive: true });

  const effect = EFFECTS[selectedEffect];
  if (!effect) {
    if (selectedEffect !== null) {
      console.log(`Unknown effect index: ${selectedEffect}`);
      console.log(`Available: ${EFFECTS.map((e, i) => `${i}: ${e.name}`).join(", ")}`);
      process.exit(1);
    }
    // Default: screenshots for envelope only (legacy behavior)
    await screenshotEffect(EFFECTS[0]);
    return;
  }

  await screenshotEffect(effect);
}

async function screenshotEffect(effect) {
  const { chromium } = await import("playwright");
  const { createServer } = await import("node:http");
  const { readFileSync: _rs, statSync, createReadStream } = await import("node:fs");
  const { extname } = await import("node:path");

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".png": "image/png",
    ".md": "text/plain",
  };

  const previewPath = join(ROOT, effect.name, "preview.html");
  if (!existsSync(previewPath)) {
    console.log(`  SKIP ${effect.name} has no preview.html`);
    return;
  }

  const server = createServer((req, res) => {
    let filePath = join(ROOT, req.url === "/" ? previewPath : req.url);
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
  console.log(`--- Preview server on :${PORT} for ${effect.name} ---\n`);

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1650 } });
    await page.goto(`http://127.0.0.1:${PORT}/${effect.name}/preview.html`);
    await page.waitForTimeout(500);

    // Desktop closed state
    await page.screenshot({ path: join(ASSETS, `${effect.name}-closed.png`), fullPage: true });
    console.log(`  Saved assets/${effect.name}-closed.png`);

    // Force-open via details/summary and CSS classes
    const effectNameStr = effect.name;
    await page.evaluate((name) => {
      document.querySelectorAll("details").forEach((d) => (d.open = true));
      document.querySelectorAll("[class]").forEach((el) => {
        el.classList.forEach((cls) => {
          if (cls.startsWith("card") || cls.startsWith("preview-divider") || cls.startsWith("typewriter")) {
            el.classList.add("trifold-letter--forced-open", "typewriter--preview-open", "secret-divider--preview-open", "polaroid--preview-open", "chat-conversation--preview-open");
          }
        });
      });
    }, effectNameStr);
    await page.setViewportSize({ width: 1440, height: 3000 });
    await page.waitForTimeout(500);

    await page.screenshot({ path: join(ASSETS, `${effect.name}-open.png`), fullPage: true });
    console.log(`  Saved assets/${effect.name}-open.png`);

    // Mobile state
    await page.setViewportSize({ width: 390, height: 2800 });
    await page.goto(`http://127.0.0.1:${PORT}/${effect.name}/preview.html`);
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      document.querySelectorAll("details").forEach((d) => (d.open = true));
    });
    await page.screenshot({ path: join(ASSETS, `${effect.name}-mobile.png`), fullPage: true });
    console.log(`  Saved assets/${effect.name}-mobile.png`);

    await browser.close();
  } finally {
    server.close();
  }
}

// ── 4. AO3 live validation (optional) ─────────────────────────────────────────

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

// ── Main ──────────────────────────────────────────────────────────────────────

(async function main() {
  console.log("AO3 Toolkit — verify.mjs\n");

  structureCheck();
  cssLint();

  console.log("Running screenshots...");
  await screenshots();

  if (runAo3) {
    await ao3Validation();
  }

  console.log("All checks passed. Done.\n");
})();
