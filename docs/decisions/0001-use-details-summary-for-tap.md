# ADR 0001: Use `details/summary` for Tap Interaction

## Status

Accepted

## Date

2026-04-04

## Context

这个项目需要一条适合触屏设备的正式交互路径。

过去试过 `:target` 锚点方案，但真实 AO3 验证发现：

- AO3 会剥掉作品 HTML 里的 `id`
- 这会让依赖 `#anchor` 的交互失效

同时，真实 AO3 验证确认：

- `details`
- `summary`

这两个标签可以在作品里保留下来。

## Decision

正式的 tap/mobile 交互统一使用 `details/summary`。

不再把 `:target` 锚点版作为正式模板，也不再在用户文档里推荐它。

## Consequences

好处：

- 结构更稳定
- 和 AO3 真实过滤规则更匹配
- 维护路径更清晰

代价：

- 交互行为会受浏览器原生 `details` 机制约束
- 视觉层需要围绕这个结构去适配

## Follow-up

- `envelope/tap-template.html` 保持为唯一正式触屏模板
- `docs/user/faq.md` 明确说明为什么不用 `:target`
