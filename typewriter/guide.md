# AO3 打字机效果 — 使用指南

## 快速开始

不懂代码？只做这几步：

1. 把 `typewriter/work-skin.css` 全量添加到 AO3 的 Work Skin
2. 把 `typewriter/hover-template.html` 贴进 AO3 的 HTML 编辑器
3. 预览成功后再根据需要改成 tap 版本

你真正需要关心的文件全在 `typewriter/` 目录下：

- `work-skin.css` — 全部 CSS 样式
- `hover-template.html` — 默认正式模板（:hover 交互）
- `tap-template.html` — 触屏/手机友好版（details/summary）
- `preview.html` — 本地预览页面

其他目录（`docs/`、`local/`、`tools/`）普通用户都不需要碰。

两个硬限制：
- AO3 不允许 JavaScript
- 读者可以关闭 creator styles，关键信息不要只靠视觉效果表达

---

## 用户指南

### 第一步：挂载 Work Skin

1. 登录 AO3 → My Dashboard → Skins → Create Work Skin
2. 把 `typewriter/work-skin.css` 全量复制进去（可以追加到已有的 work skin 里）
3. 保存

### 第二步：把 Skin 挂到作品

1. 新建或编辑作品
2. 在 Associations 里找到 Select Work Skin
3. 选中刚创建的 Skin

### 第三步：最小测试

1. 正文编辑器切到 **HTML** 模式
2. 复制 `typewriter/hover-template.html` 贴进去
3. 点 **Preview**

悬停后应该看到文字逐行出现，末尾有闪烁光标。

### 第四步：选择正式模板

| 场景 | 文件 | 说明 |
|------|------|------|
| 默认推荐 | `hover-template.html` | :hover 交互，最稳 |
| 手机/平板用户多 | `tap-template.html` | 基于 details/summary |

### 如何改模板

把占位文字换成你的内容即可：

- `.typewriter-line` 里的文字逐行替换
- `.typewriter-prompt` 替换成你想要的初始提示
- `.typewriter-hint` 替换成你想要的提示文字
- 增加/减少 `.typewriter-line` 数量都可以（CSS 默认支持前 8 行的交错延迟）

三不要：
- 不要删 `.typewriter-container`、`.typewriter-text` 等外层包装
- 不要乱改类名（`typewriter--hover`、`typewriter-line` 等）
- 不要用 Rich Text 模式粘贴——必须用 **HTML** 模式

---

## FAQ

### 为什么看到原始 HTML 标签（`<div>`、`<span>`）

编辑器模式切错了。解决：

1. 回到编辑器
2. 切到 **HTML** 模式
3. 重新粘贴

### 为什么只有普通文字，没有打字机效果

Work Skin 没有成功挂到作品上。先用 hover-template.html 测试（悬停应看到文字出现），通过前不要上正式内容。

### 第一次该用哪个版本

顺序固定：

1. `hover-template.html` → 默认
2. `tap-template.html` → 触屏备选

### 手机上 hover 不好用

改用 `tap-template.html`，基于 `details/summary`，不依赖鼠标悬停。

### 可以加很多行吗？

可以。CSS 默认覆盖了前 8 行的交错延迟，超过 8 行的内容同样会显示，只是没有额外的延迟。如果需要更多行，在 `work-skin.css` 里追加 `:nth-child(N)` 规则即可。

### 光标能不能去掉？

可以。不需要闪烁光标的话，从模板里删掉 `.typewriter-cursor-wrapper` 那段即可。

### 我的预览和读者看到的不一样

常见原因：
- 读者关闭了 creator styles
- 读者用下载阅读（下载不会保留 work skin）

这是 AO3 的正常限制，不是模板坏了。

---

## 维护与验证

> 本节面向维护者和协作者。如果你只是想发文，看上面两节就够了。

### 什么时候需要验证

- 改了 `typewriter/work-skin.css`
- 改了 `typewriter/*.html` 模板文件
- 想确认 AO3 真实解析会不会过滤某种 HTML 或 CSS

### 验证流程

1. 修改 `typewriter/work-skin.css` 或模板文件
2. 在本地打开 `typewriter/preview.html`，检查四种状态
3. 确认 hover 和 tap 都能正常工作

### 验证成功标准

- 收起态：只显示提示文字和光标占位
- 展开态（`.typewriter--preview-open` 或 hover 或 `[open]`）：所有行依次淡入，光标闪烁
- 光标使用 `@keyframes typewriter-blink` 做 step-end 闪烁动画
- 各行之间使用 `transition-delay` 做交错延迟

---

## 参考笔记

### 设计要点

- 暗色背景（#1a1a1a），模拟旧式终端/打字机
- 等宽字体：`Courier New`, `Courier`, `Lucida Sans Typewriter`
- 文字颜色：浅灰（#c8c8c8），与暗背景形成足够对比
- 每行使用 `max-height` + `opacity` + `transform` 联合过渡
- 光标用 `border-right` 模拟，通过 `@keyframes` 做 step-end 闪烁
- 交错延迟：每行间隔约 170ms

### AO3 限制

- `id` 属性会被剥掉，不能用于锚点交互
- 不用 `gap`、`grid-template-columns: repeat()`、`pointer-events`、带 `/` 的 `border-radius`
- 所有 CSS 选择器用 `#workskin` 前缀
