# AO3 拍立得相框 — 使用指南

## 快速开始

不懂代码？只做这几步：

1. 把 `effects/polaroid/work-skin.css` 全量复制到 AO3 的 Work Skin
2. 把 `effects/polaroid/hover-template.html` 贴进 AO3 的 HTML 编辑器
3. 预览成功看到拍立得效果后，再根据需求调整

你真正需要关心的文件全在 `effects/polaroid/` 目录下：

- `work-skin.css` — 全部 CSS 样式
- `hover-template.html` — 默认 hover 版（桌面优先）
- `tap-template.html` — 触屏/手机友好版
- `preview.html` — 本地预览页面

其他目录（`docs/`、`tools/`）普通用户都不需要碰。

两个硬限制：
- AO3 不允许 JavaScript
- 读者可以关闭 creator styles，关键信息不要只靠视觉效果表达

---

## 用户指南

### 第一步：创建 Work Skin

1. 登录 AO3 → My Dashboard → Skins → Create Work Skin
2. 把 `effects/polaroid/work-skin.css` 全量复制进去
3. 保存

### 第二步：把 Skin 挂到作品

1. 新建或编辑作品
2. 在 Associations 里找到 Select Work Skin
3. 选中刚创建的 Skin

### 第三步：粘贴模板

| 场景 | 文件 | 说明 |
|------|------|------|
| 默认推荐（第一次发文） | `hover-template.html` | 最简单，桌面效果好 |
| 手机/平板用户多 | `tap-template.html` | 基于 details/summary，触屏友好 |

1. 正文编辑器切到 **HTML** 模式
2. 复制对应模板文件内容贴进去
3. 点 **Preview**

看到拍立得相框和悬停/点击翻转效果，说明挂载成功。

### 如何改模板

每个相块包含正面和背面：

**正面（照片侧）：**
- 修改 `.polaroid-image` 的 `background` 可以更换"照片"颜色
- 修改 `.polaroid-caption` 里的文字作为照片底部标题

**背面（翻转后可见）：**
- 修改 `.polaroid-message` 里的文字作为背面留言
- 使用 `&#10;` 表示换行

三不要：
- 不要删标签
- 不要乱改类名（`polaroid-container`、`polaroid-front`、`polaroid-back` 等）
- 不要用 Rich Text 模式粘贴——必须用 **HTML** 模式

### 如何替换照片

AO3 不支持 `background-image` 的 `url()` 引用外部图片，但你可以：

1. 在 `.polaroid-image` 的 `style` 属性里直接写：
   ```html
   <span class="polaroid-image" style="background: linear-gradient(...) !important;"></span>
   ```
2. 或者干脆在 `.polaroid-image` 里嵌套 `<img>` 标签（如果 AO3 的 HTML 模式允许）

---

## FAQ

### 为什么看到原始 HTML 标签（`<div>`、`<span>`）

编辑器模式切错了。解决：

1. 回到编辑器
2. 切到 **HTML** 模式
3. 重新粘贴

### 为什么只有普通文字，没有相框样式

Work Skin 没有成功挂到作品上。先用 hover 模板验证，模板通过前不要调整样式。

### 第一次该用哪个版本

顺序固定：

1. `hover-template.html` → 默认正式版
2. `tap-template.html` → 触屏备选

### 手机上 hover 不好用

改用 `tap-template.html`，基于 `details/summary`，不依赖鼠标悬停。

### 翻转后看不到背面文字

检查以下几点：
- 模板里的 `polaroid-back` 和 `polaroid-back-inner` 标签是否完整
- 内容不要太长——拍立得背面空间有限
- 确认读者没有关闭 creator styles

### 可以放几张拍立得？

模板默认提供 3 张。你可以复制/删除 `.polaroid-container` 块来增减数量。建议不超过 4-5 张以保持可读性。

### 我的预览和读者看到的不一样

常见原因：
- 读者关闭了 creator styles
- 读者用下载阅读（下载不会保留 work skin）

这是 AO3 的正常限制，不是模板坏了。

### 我该忽略哪些文件

普通用户只需要关心 `effects/polaroid/` 下的内容，其他都可以忽略。

---

## 维护与验证

> 本节面向维护者和协作者。如果你只是想发文，看上面两节就够了。

### 什么时候需要验证

- 改了 `effects/polaroid/work-skin.css`
- 改了 `effects/polaroid/*.html` 模板文件
- 想确认 AO3 真实解析会不会过滤某种 HTML 或 CSS
- 想确认模板不是只在本地好看

### 验证流程

1. 修改 `effects/polaroid/work-skin.css` 或模板文件
2. 打开 `effects/polaroid/preview.html` 在浏览器中查看效果
3. 运行 `node tools/verify.mjs`
4. 如需真实 AO3 验证，按 `docs/ao3-live-validation.md` 的流程执行

### 验证成功标准

- **hover 模板**：悬停时相框翻转为 `rotateY(180deg)`，正面透明度变为 0，背面透明度变为 1
- **tap 模板**：点击 `details` 后触发相同翻转效果
- **预览页**：关闭态、翻转态、移动端三态均正确显示

### AO3 兼容性注意事项

已规避的 AO3 限制：
- 不使用 `backface-visibility`（可能被过滤）——使用 `opacity` + `rotateY` 组合
- 不使用 `gap`（flex 中可能被过滤）——使用 `margin` 间距
- 不使用 `grid-template-columns: repeat()` ——使用 `flex-wrap` 布局
- 不使用 `pointer-events` ——通过 `cursor: pointer` 指示交互
- 不使用 `/` 语法在 `border-radius` ——使用标准单值写法
- 不使用 `id` 属性作锚点——AO3 会剥掉

---

## 设计说明

### 翻转技术细节

由于 AO3 可能过滤 `backface-visibility`，本效果使用以下替代方案：

1. 相框容器 `.polaroid-inner` 添加 `transform-style: preserve-3d`
2. 翻转时整个容器 `transform: rotateY(180deg)`
3. 正面 `.polaroid-front` 和背面 `.polaroid-back` 通过 `opacity` 控制显隐
4. 翻转时：正面 `opacity: 0` 先消失，背面 `opacity: 1` 带延迟渐入
5. 配合 CSS `transition-delay` 实现"先翻再显"的视觉效果

### 类名说明

| 类名 | 用途 |
|------|------|
| `polaroid-gallery` | 包含多个相框的 flex 容器 |
| `polaroid-container` | 单个相框的 wrapper，负责 perspective |
| `polaroid-inner` | 实际翻转的动画层 |
| `polaroid--hover` | hover 交互模式标记 |
| `polaroid--details` | details/summary 触屏模式标记 |
| `polaroid--preview-open` | 验证用的强制翻转标记 |
| `polaroid-front` | 正面（照片侧） |
| `polaroid-back` | 背面（文字侧） |
| `polaroid-frame` | 白色相框边框 |
| `polaroid-image` | "照片"占位区域 |
| `polaroid-caption` | 照片底部标题 |
| `polaroid-back-inner` | 背面容器，带背景色和边框 |
| `polaroid-message` | 背面文字内容 |
| `polaroid-hint` | 底部交互提示文字 |
