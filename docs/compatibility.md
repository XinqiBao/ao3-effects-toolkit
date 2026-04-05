# AO3 Compatibility

来自 2026-04-04 对已登录 AO3 账号的真实验证记录。

只记录结果结论，具体操作步骤看 [`envelope/guide.md`](../envelope/guide.md) 的维护者部分。

## 已确认可工作

- `envelope/work-skin.css` 可成功更新到 AO3 work skin
- `envelope/smoke-test.html`、`hover-template.html`、`tap-template.html` 均可正常渲染
- 通用的 `trifold-letter / letter-cover / letter-top / letter-mid / letter-bot` 结构在 AO3 Preview 中可完整保留
- 两条交互路径均有效：
  - hover 版本可通过 `.trifold-letter--preview-open` 验证展开态
  - tap 版本可通过设置 `details.open = true` 验证展开态
- 移动端断点（<= 720px）下，三折位移和交替倾斜均成立

## AO3 解析限制

以下 CSS 属性 AO3 会拒绝或过滤，在编写 work skin 时注意避免：

| 被拒绝的 CSS                    | 替代方案                     |
|---------------------------------|------------------------------|
| `gap`                           | 用 `margin`                  |
| `grid-template-columns: repeat()` | 用 `inline-block` / `flex`   |
| `pointer-events`                | 避免使用                     |
| 带 `/` 的 `border-radius`椭圆   | 去掉 `/` 部分                |
| HTML 中的 `id` 属性              | AO3 会剥掉，不能用于锚点       |

已确认 AO3 会保留的 HTML 标签：

- `<details>` / `<summary>`
- `<div>` / `<span>`（需在 HTML 模式下粘贴）

## 移动端方案

- 默认推荐触屏版：`tap-template.html`（基于 details/summary）
- 旧的 `:target` 锚点交互已退役

## 更新方式

如果你改了 `envelope/` 下的正式发布物，至少跑一次验证：

```bash
node tools/verify.mjs
```

如需真实 AO3 验证（需手动登录一次）：

```bash
node tools/verify.mjs --ao3
```
