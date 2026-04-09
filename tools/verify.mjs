#!/usr/bin/env node

/**
 * AO3 Toolkit — Verification script
 *
 * Usage:
 *   node tools/verify.mjs                 — structure check + CSS lint for all effects
 *   node tools/verify.mjs --effect <name> — structure check + CSS lint for one effect
 *
 * All commands run from the repository root.
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// ── Effect definitions ────────────────────────────────────────────────────────

const EFFECTS = [
  {
    name: "envelope",
    stageClass: "letter-stage",
    previewContract: { family: "tall" },
  },
  {
    name: "polaroid",
    stageClass: "polaroid-gallery",
    previewContract: { family: "standard" },
  },
  {
    name: "chat-messages",
    stageClass: "chat-conversation",
    previewContract: { family: "standard" },
  },
  {
    name: "secret-divider",
    stageClass: "secret-divider-container",
    previewContract: { family: "standard" },
  },
  {
    name: "typewriter",
    stageClass: "typewriter-stage",
    previewContract: { family: "tall" },
  },
];
const EFFECTS_BY_NAME = {};
for (const e of EFFECTS) EFFECTS_BY_NAME[e.name] = e;

const PREVIEW_CONTRACT = {
  requiredPanels: ["desktop-closed", "desktop-open", "mobile-closed", "mobile-open"],
  captureHook: "[data-capture-frame]",
  stageHook: "[data-stage]",
  anatomyClasses: [".card__stage-shell", ".card__prop-zone", ".card__hint"],
};

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
const effectIdx = args.indexOf("--effect");
const selectedEffectName = effectIdx !== -1 && args[effectIdx + 1] ? args[effectIdx + 1] : null;

if (selectedEffectName && !EFFECTS_BY_NAME[selectedEffectName]) {
  console.log(`Unknown effect: ${selectedEffectName}`);
  console.log(`Available: ${EFFECTS.map((e) => e.name).join(", ")}`);
  process.exit(1);
}

const targetEffects = selectedEffectName ? [EFFECTS_BY_NAME[selectedEffectName]] : EFFECTS;

// ── 1. Structure check ────────────────────────────────────────────────────────

function structureCheck() {
  console.log("\n--- Structure Check ---\n");

  for (const effect of targetEffects) {
    const dir = join(ROOT, effect.name);
    console.log(`  [${effect.name}]`);

    try {
      const css   = readFileSync(join(dir, "work-skin.css"), "utf8");
      const hover = readFileSync(join(dir, "hover-template.html"), "utf8");
      const tap   = readFileSync(join(dir, "tap-template.html"), "utf8");
      const preview = readFileSync(join(dir, "preview.html"), "utf8");

      assert(existsSync(join(dir, "work-skin.css")),          "work-skin.css exists");
      assert(existsSync(join(dir, "hover-template.html")),    "hover-template.html exists");
      assert(existsSync(join(dir, "tap-template.html")),      "tap-template.html exists");
      assert(existsSync(join(dir, "preview.html")),           "preview.html exists");
      assert(existsSync(join(dir, "guide.md")),               "guide.md exists");

      assert(css.includes("#workskin"), "CSS uses #workskin prefix");

      for (const [label, html] of Object.entries({ hover, tap })) {
        assert(
          html.includes(`class="${effect.stageClass}`) || html.includes(`class="${effect.stageClass} "`),
          `${label} uses ${effect.stageClass}`
        );
      }

      const rules = EFFECT_RULES[effect.name];
      if (rules) {
        assert(hover.includes(rules.hoverClass), `hover template uses ${rules.hoverClass}`);
        assert(tap.includes(rules.tapClass),     `tap template uses ${rules.tapClass}`);
        for (const cls of rules.classes) {
          assert(css.includes(cls), `CSS defines ${cls}`);
        }
        if (rules.hoverAssert) {
          assert(hover.includes(rules.hoverAssert), `hover template contains ${rules.hoverAssert}`);
        }
      }

      if (effect.previewContract) {
        assertPreviewContract(preview, effect.previewContract);
      }

      if (existsSync(join(dir, "smoke-test.html"))) {
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

function assertPreviewContract(preview, contract) {
  const tags = scanHtmlTags(preview);

  for (const panel of PREVIEW_CONTRACT.requiredPanels) {
    const sections = getPanelSections(tags, panel);
    assert(sections.length === 1, `preview defines exactly one ${panel} panel`);

    const section = sections[0];

    assert(
      section.openTag.attrs["data-preview-family"] === contract.family,
      `${panel} panel uses ${contract.family} preview family`
    );
    for (const className of PREVIEW_CONTRACT.anatomyClasses) {
      assert(
        countElementsWithClass(section.tags, className.slice(1)) === 1,
        `${panel} panel defines exactly one ${className}`
      );
    }
    assert(
      countElementsWithAttribute(section.tags, "data-stage") === 1,
      `${panel} panel defines exactly one ${PREVIEW_CONTRACT.stageHook}`
    );
    assert(
      countElementsWithAttribute(section.tags, "data-capture-frame") === 1,
      `${panel} panel defines exactly one ${PREVIEW_CONTRACT.captureHook}`
    );
    assert(
      hasCaptureFrameInsideStage(section.tags),
      `${panel} panel nests ${PREVIEW_CONTRACT.captureHook} inside ${PREVIEW_CONTRACT.stageHook}`
    );
  }
}

function getPanelSections(tags, panel) {
  const sections = [];

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    if (tag.name !== "section" || tag.closing || tag.attrs["data-panel"] !== panel) continue;

    let depth = 1;
    for (let j = i + 1; j < tags.length; j++) {
      const nextTag = tags[j];
      if (nextTag.name !== "section") continue;

      if (!nextTag.closing && !nextTag.selfClosing) {
        depth += 1;
      } else if (nextTag.closing) {
        depth -= 1;
      }

      if (depth === 0) {
        sections.push({ openTag: tag, tags: tags.slice(i, j + 1) });
        i = j;
        break;
      }
    }
  }

  return sections;
}

function countElementsWithAttribute(tags, attribute) {
  let count = 0;
  for (const tag of tags) {
    if (!tag.closing && attribute in tag.attrs) {
      count += 1;
    }
  }
  return count;
}

function countElementsWithClass(tags, className) {
  let count = 0;
  for (const tag of tags) {
    if (!tag.closing && hasClass(tag, className)) {
      count += 1;
    }
  }
  return count;
}

function hasCaptureFrameInsideStage(tags) {
  const stack = [];

  for (const tag of tags) {
    if (!tag.closing) {
      const insideStage = stack.some((ancestor) => "data-stage" in ancestor.attrs);
      if ("data-capture-frame" in tag.attrs && insideStage) {
        return true;
      }

      if (!tag.selfClosing) {
        stack.push(tag);
      }
      continue;
    }

    for (let index = stack.length - 1; index >= 0; index--) {
      if (stack[index].name === tag.name) {
        stack.splice(index, 1);
        break;
      }
    }
  }

  return false;
}

function hasClass(tag, className) {
  const classes = tag.attrs.class ? tag.attrs.class.split(/\s+/).filter(Boolean) : [];
  return classes.includes(className);
}

function scanHtmlTags(html) {
  const tags = [];

  for (let index = 0; index < html.length; index++) {
    if (html.startsWith("<!--", index)) {
      const commentEnd = html.indexOf("-->", index + 4);
      index = commentEnd === -1 ? html.length : commentEnd + 2;
      continue;
    }

    if (html[index] !== "<") continue;
    if (html.startsWith("</", index)) {
      const tagEnd = findTagEnd(html, index + 2);
      if (tagEnd === -1) break;

      const name = readTagName(html.slice(index + 2, tagEnd));
      if (name) {
        tags.push({ name, closing: true, selfClosing: false, attrs: {} });
      }
      index = tagEnd;
      continue;
    }

    if (html.startsWith("<!", index) || html.startsWith("<?", index)) {
      const tagEnd = findTagEnd(html, index + 1);
      if (tagEnd === -1) break;
      index = tagEnd;
      continue;
    }

    const tagEnd = findTagEnd(html, index + 1);
    if (tagEnd === -1) break;

    const rawContent = html.slice(index + 1, tagEnd);
    const name = readTagName(rawContent);
    if (name) {
      tags.push({
        name,
        closing: false,
        selfClosing: /\/\s*$/.test(rawContent),
        attrs: parseAttributes(rawContent, name),
      });
    }
    index = tagEnd;
  }

  return tags;
}

function findTagEnd(html, start) {
  let quote = null;

  for (let index = start; index < html.length; index++) {
    const char = html[index];
    if (quote) {
      if (char === quote) quote = null;
      continue;
    }

    if (char === `"` || char === `'`) {
      quote = char;
      continue;
    }

    if (char === ">") return index;
  }

  return -1;
}

function readTagName(content) {
  const match = content.match(/^\s*([a-zA-Z][\w:-]*)\b/);
  return match ? match[1].toLowerCase() : null;
}

function parseAttributes(content, tagName) {
  const attributes = {};
  const body = content.slice(content.toLowerCase().indexOf(tagName) + tagName.length);
  const attrPattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;

  for (const match of body.matchAll(attrPattern)) {
    const [, name, doubleQuoted, singleQuoted, bare] = match;
    attributes[name] = doubleQuoted ?? singleQuoted ?? bare ?? "";
  }

  return attributes;
}

// ── 2. CSS lint ───────────────────────────────────────────────────────────────

function cssLint() {
  console.log("\n--- CSS Lint (AO3 compatibility) ---\n");

  const FORBIDDEN = [
    { pattern: /\bgap\s*:/,                                    name: "gap" },
    { pattern: /grid-template-columns\s*:\s*repeat\s*\(/,     name: "grid-template-columns: repeat()" },
    { pattern: /pointer-events\s*:/,                           name: "pointer-events" },
  ];
  const RISKY = [
    { pattern: /@keyframes\s+\w|animation\s*:/, name: "@keyframes/animation" },
    { pattern: /perspective\s*[:;]/,             name: "perspective" },
    { pattern: /transform-style\s*:/,            name: "transform-style" },
    { pattern: /backface-visibility\s*:/,        name: "backface-visibility" },
  ];
  const RADIUS_SPLIT = /border-radius\s*:[^;]*\/[^;]*;/;

  let hasIssue = false;

  for (const effect of targetEffects) {
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

  // Check HTML templates for id= attributes (AO3 strips them)
  for (const effect of targetEffects) {
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

    if (effect.name !== "polaroid") continue;

    for (const file of ["hover-template.html", "tap-template.html", "smoke-test.html", "preview.html"]) {
      const path = join(dir, file);
      if (!existsSync(path)) continue;
      const html = readFileSync(path, "utf8");
      if (/<p class="polaroid-message">/.test(html)) {
        console.log(`  FAIL ${effect.name}/${file} should use <span class="polaroid-message"> to preserve inline-safe card structure`);
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

// ── Main ──────────────────────────────────────────────────────────────────────

console.log("AO3 Toolkit — verify.mjs\n");
structureCheck();
cssLint();
console.log("All checks passed. Done.");
