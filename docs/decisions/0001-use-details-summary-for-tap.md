# ADR 0001: Use `details/summary` for Tap Interaction

## Status

Accepted

## Date

2026-04-04

## Context

This project needs a touch-friendly interaction path that survives AO3's HTML filtering.

Earlier experiments used `:target`, but live AO3 validation showed that:

- AO3 strips `id` attributes from posted work HTML
- anchor-based interaction becomes unreliable once those `id` values disappear

The same validation confirmed that AO3 keeps:

- `details`
- `summary`

## Decision

Use `details/summary` as the canonical tap interaction pattern for published effects.

Do not treat `:target` as a supported production path.

## Consequences

Benefits:

- the structure matches AO3's confirmed HTML behavior
- touch interaction no longer depends on stripped attributes
- maintenance stays focused on one supported tap pattern

Tradeoffs:

- interaction behavior follows the browser's native `details` rules
- effect CSS needs to work with that structure rather than a custom state model

## Follow-up

- current tap examples live inside each effect's `example.html`
- future effects that need explicit touch interaction should prefer the same `details/summary` pattern
