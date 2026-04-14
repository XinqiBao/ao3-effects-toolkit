# ADR 0002: Standardize Effect Structure Around Root-Scoped Modules

## Status

Accepted

## Date

2026-04-12

## Context

This repository has already gone through several rounds of simplification across previews, examples, and desktop interaction paths.

Those passes removed a large amount of obsolete preview-only structure and deprecated tap-specific branches, but the remaining published effect markup still uses inconsistent naming and wrapper patterns across effects.

Current pain points:

- root nodes are not named consistently across effects
- trigger/state classes are not attached consistently to the root node
- many descendant classes repeat the effect prefix even when the root already defines the scope
- some effects still use parallel class families where a base class plus modifier would be clearer
- some wrappers remain harder to justify because they mainly preserve historical structure rather than a current responsibility

The goal of the next cleanup pass is to reduce naming and structural bloat without changing the current visual result or interaction behavior.

## Decision

Adopt one repository-wide structure contract for published effect markup and effect-local CSS:

1. Each effect uses the effect name itself as the root class.
2. Trigger or state modifiers attach to that root class.
3. Descendant module classes stay effect-local through root scoping instead of repeating the effect prefix.
4. Repeated sibling variants should prefer a base class plus modifier when that produces a clearer model.
5. Wrappers should remain only when they carry a real responsibility.

Examples of the intended direction:

- `polaroid polaroid--hover` instead of `polaroid-container > polaroid-card polaroid--hover`
- `chat chat--hover` with descendants such as `preview`, `stack`, `entry`, `bubble`
- `envelope envelope--hover` with descendants such as `cover`, `panel`, `panel--top`

## Structure Contract

### Root And State

- The root class is the canonical effect identifier.
- Interaction modifiers such as `--hover` live on that same root.
- Published selectors should anchor from `#workskin .<effect-root>`.

Examples:

- `#workskin .polaroid`
- `#workskin .polaroid--hover:hover`
- `#workskin .chat .bubble`

### Descendant Modules

- Descendant classes should be short, local, and role-based.
- Do not repeat the effect prefix on descendants unless the class needs to stand alone outside the root scope.
- Prefer names such as `front`, `back`, `panel`, `bubble`, `entry`, `cursor`, `caption`, `message`.

Avoid vague utility-like names unless the element truly has no stronger role:

- `inner`
- `wrapper`
- `container`
- `box`
- `part`

### Base Plus Modifier

Prefer a shared base class plus modifiers when sibling structures are the same kind of thing with small role differences.

Prefer:

- `panel panel--top`
- `panel panel--mid`
- `panel panel--bottom`
- `entry entry--sent`
- `bubble bubble--received`

Over separate parallel names:

- `letter-top`
- `letter-mid`
- `letter-bot`

### Wrapper Retention Rule

Keep a wrapper only if it provides at least one of these responsibilities:

- positioning context
- 3D transform context
- overflow or clipping boundary
- spacing or geometry control that cannot live on a more meaningful element
- pseudo-element attachment point
- hover area preservation

If a wrapper does not carry one of those responsibilities, remove it.

## CSS Management Rules

This cleanup should standardize effect-local CSS organization without introducing a new shared CSS abstraction layer.

### File Scope

- Keep each effect self-contained inside its own `work-skin.css`.
- Do not introduce new repository-wide utility CSS for published effect internals.
- Keep preview-only helpers in `preview.html`.

### Selector Style

- Anchor selectors from `#workskin .<effect-root>`.
- Let descendant names stay short because the root already provides the namespace.
- Keep state selectors attached to the root.

Example pattern:

```css
#workskin .polaroid {
  /* root geometry */
}

#workskin .polaroid .front,
#workskin .polaroid .back {
  /* shared face rules */
}

#workskin .polaroid--hover:hover .card {
  /* interaction */
}
```

### Internal Organization

Arrange effect CSS in a consistent order:

1. root and geometry
2. shared structural parts
3. named modules
4. state and interaction rules
5. motion and keyframes
6. narrow effect-specific exceptions

### Variables

Do not introduce repository-wide design tokens or a broad custom-property system as part of this cleanup.

Local custom properties are allowed only when a single effect repeats the same design parameter enough times that the variable clearly improves maintainability.

## Effect-Level Guidance

### Polaroid

- Use `polaroid` as the root.
- Keep only the wrappers needed for the 3D flip and face layering.
- Prefer descendants such as `card`, `front`, `back`, `frame`, `photo`, `caption`, `message`.

### Chat Messages

- Use `chat` as the root.
- Keep the collapsed preview and revealed stack structure.
- Prefer descendants such as `preview`, `stack`, `entry`, `time`, `bubbles`, `bubble`.

### Envelope

- Use `envelope` as the root.
- Preserve the staged fold behavior and absolute-positioned layers.
- Favor `cover`, `cover-copy`, `from`, `to`, `stamp`, and `panel panel--top|mid|bottom`.

### Typewriter

- Use `typewriter` as the root.
- Be conservative about wrapper removal because hover-area stability and staged reveal timing are behavior-critical.
- Prefer descendants such as `prompt`, `lines`, `line`, `cursor-row`, `cursor`.

### Secret Divider

- Use `secret-divider` as the root.
- Keep the structure lean; only retain inner text wrappers if they are still needed for reveal clipping versus readable text styling.

## Non-Goals

This cleanup does not attempt to:

- redesign the visual language of the effects
- add new AO3-facing behavior
- introduce JavaScript into published artifacts
- create a shared component system across effects
- convert the repository into a strict global BEM codebase

## Migration Strategy

Apply the cleanup effect by effect instead of as one repository-wide rename pass.

Recommended order:

1. `polaroid`
2. `chat-messages`
3. `envelope`
4. `typewriter`
5. `secret-divider`

For each effect:

1. simplify the published HTML structure
2. rename classes to the new contract
3. reorganize the effect-local CSS
4. update `preview.html` and `guide.md`
5. run local review
6. run AO3 live validation if the published structure changed

## Verification

Verification remains two-layered:

1. local review in this repository
2. live AO3 validation when published HTML or CSS changes

For this cleanup, local review should confirm:

- `example.html`, `preview.html`, and `work-skin.css` still describe the same structure
- hover targets still remain stable
- absolute-positioned and transformed layers still use the correct positioning context
- the effect looks and behaves the same before and after the rename and wrapper cleanup

Because this decision affects published AO3-facing structure, each migrated effect should be treated as requiring follow-up live validation before being considered fully verified on AO3.

## Consequences

Benefits:

- published examples become easier to read and edit
- CSS selectors become shorter without losing scope safety
- effect internals become easier to reason about because roots, modules, and modifiers follow the same contract
- future effect cleanup can focus on responsibilities instead of historical naming drift

Tradeoffs:

- each migrated effect will require coordinated changes across HTML, CSS, guides, previews, and validation notes
- existing class names in examples will change even if the rendered behavior does not
- some effects will still need a few wrappers because behavior depends on them

## Follow-Up

- implement the cleanup one effect at a time
- update maintainer guidance after the contract is reflected in real effect files
- update compatibility notes after live AO3 validation confirms the migrated structures
