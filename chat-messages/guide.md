# AO3 对话气泡 — 使用指南

## 快速开始

不懂代码？只做这几步：

1. 把 `chat-messages/work-skin.css` 全量复制到 AO3 的 Work Skin
2. 把 `chat-messages/hover-template.html` 贴进 AO3 的 HTML 编辑器
3. 预览成功对话效果

⚠️ 两个硬限制：
- AO3 不允许 JavaScript
- 读者可以关闭 creator styles；关键信息不要只靠视觉效果表达

---

## 用户指南

### 第一步：创建 Work Skin

1. 登录 AO3 → My Dashboard → Skins → Create Work Skin
2. 把 `chat-messages/work-skin.css` 全量复制进去
3. 保存

### 第二步：把 Skin 挂到作品

1. 新建或编辑作品
2. 在 Associations 里找到 Select Work Skin
3. 选中刚创建的 Skin

### 第三步：测试

1. 正文编辑器切到 **HTML** 模式
2. 复制 `chat-messages/hover-template.html` 贴进去
3. 点 **Preview**

看到类似 iOS 消息的对话气泡，说明挂载成功。

### 第四步：换成正式模板

| 场景 | 文件 | 说明 |
|------|------|------|
| 默认推荐 | `hover-template.html` | 桌面端悬停展开 |
| 手机/平板用户多 | `tap-template.html` | 基于 details/summary |

### 如何改模板

把占位替换成真实内容：

- `【发送者名字】`
- `【第一条消息内容】` / `【第二条消息内容】` 等
- `Today 9:41 AM` — 时间戳

⚠️ 三不要：
- 不要删 `<div class="chat-meta">` / `<span class="chat-bubble">` 标签
- 不要改类名（`chat-bubble--sent`、`chat-bubble--received` 等）
- 不要用 Rich Text 模式——必须用 **HTML** 模式

---

## FAQ

### 为什么只有普通文字，没有对话气泡样式

Work Skin 没有成功挂到作品上。先用 hover-template 验证，确认 CSS 正确加载。

### 手机上 hover 不好用

改用 `tap-template.html`，基于 `<details>/<summary>`，触屏友好。

### 第一次该用哪个版本

顺序固定：
1. `hover-template.html` → 默认桌面端
2. `tap-template.html` → 触屏备选

### 怎么添加更多消息

复制一个 `<div class="chat-meta">` 块，改消息内容和类名（`--sent` 或 `--received`）。

### 气泡样式能换颜色吗

可以改 `work-skin.css` 里 `.chat-bubble--sent` 的 `background` 和 `.chat-bubble--received` 的 `background`。

### 我的预览和读者看到的不一样

常见原因：
- 读者关闭了 creator styles
- 读者用下载阅读（下载不会保留 work skin）

---

## 维护与验证

### 什么时候需要验证

- 改了 `chat-messages/work-skin.css`
- 改了 `chat-messages/*.html` 模板文件

### 验证流程

```bash
node tools/verify.mjs
```

如需真实 AO3 验证：
```bash
node tools/verify.mjs --ao3
```

### 验证成功标准

- 折叠态：只显示预览条，消息区域隐藏
- 展开态：对话气泡全部显示，气泡样式正确（绿色发送/灰色接收）
- 触屏版：`details` 展开后对话气泡全部可见，发送（绿色）/接收（灰色）气泡颜色正确

---

## 参考笔记

- 当前发布物覆盖：hover 展开/折叠、details 展开/折叠、移动端响应
- CSS 全部适配 AO3 限制：无 `gap`、无 `grid-template-columns: repeat()`、无 `pointer-events`
