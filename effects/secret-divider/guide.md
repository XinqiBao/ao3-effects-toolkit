# AO3 装饰分隔器 — 使用指南

## 快速开始

不懂代码？只做这几步：

1. 把 `effects/secret-divider/work-skin.css` 全量复制到 AO3 的 Work Skin
2. 把 `effects/secret-divider/smoke-test.html` 贴进 AO3 的 HTML 编辑器
3. 预览成功后，再换成正式模板

你真正需要关心的文件全在 `effects/secret-divider/` 目录下：

- `work-skin.css` — 全部 CSS 样式
- `hover-template.html` — 默认桌面悬停模板
- `tap-template.html` — 触屏/手机友好版
- `preview.html` — 本地预览页面

⚠️ 两个硬限制：
- AO3 不允许 JavaScript
- 读者可以关闭 creator styles，关键信息不要只藏在这个装饰里

---

## 效果说明

装饰分隔器看起来像一条精美的装饰线（如 ✦ ❋ ✿ ✶ ⟡ 组成的花纹），
但悬停或轻触后，花纹会微微放大、间距变宽，隐藏的淡色文字从下方淡入浮现。

适合放置：
- 角色未说出口的真心话
- 作者的悄悄话
- 平行世界的隐藏小片段
- 彩蛋或剧透提示

---

## 用户指南

### 第一步：创建 Work Skin

1. 登录 AO3 → My Dashboard → Skins → Create Work Skin（或使用现有 Skin）
2. 在现有 Skin 末尾追加 `effects/secret-divider/work-skin.css` 的全部内容
3. 保存

### 第二步：把 Skin 挂到作品

1. 新建或编辑作品
2. 在 Associations 里找到 Select Work Skin
3. 选中目标 Skin

### 第三步：最小测试

1. 正文编辑器切到 **HTML** 模式
2. 复制以下最小测试代码粘贴：

```html
<div class="secret-divider-container">
  <div class="secret-divider secret-divider--hover secret-divider--with-flanks">
    <span class="secret-divider__ornament">&#10044;&#160;&#160;&#8226;&#160;&#10043;&#160;&#160;&#8226;&#160;&#10044;</span>
    <span class="secret-divider__text">
      <span class="secret-divider__text-inner">测试文字</span>
    </span>
  </div>
</div>
```

3. 点 **Preview**，悬停分隔符，看到隐藏的"测试文字"即为成功。

⚠️ 如果测试都没效果，先不要上正式模板——回到第一步排查。

### 第四步：换成正式模板

| 场景 | 文件 | 说明 |
|------|------|------|
| 默认推荐（第一次发文） | `hover-template.html` | 最稳 |
| 手机/平板用户多 | `tap-template.html` | 基于 details/summary，不依赖 hover |

### 如何改模板

- 替换 `secret-divider__text-inner` 中的内容为你自己的秘密文字
- 可以修改 `secret-divider__ornament` 中的 Unicode 装饰字符（✦ ❋ ✿ ❀ ✶ ⟡ ⟡ ❊ 等）
- 可以添加多个独立分隔器（每个 `<details>` 或 `.secret-divider` 各自独立）

⚠️ 三不要：
- 不要删标签
- 不要改类名（`secret-divider-container`、`secret-divider__ornament` 等）
- 不要用 Rich Text 模式粘贴——必须用 **HTML** 模式

---

## FAQ

### 为什么看到原始 HTML 标签

编辑器模式切错了。解决：

1. 回到编辑器
2. 切到 **HTML** 模式
3. 重新粘贴

### 为什么只有装饰线，隐藏部分没出来

Work Skin 没有成功挂到作品上，或 CSS 不完整。先用最小测试验证。

### 第一次该用哪个版本

顺序固定：

1. 最小测试 → 确认挂载成功
2. `hover-template.html` → 默认正式版
3. `tap-template.html` → 触屏备选

### 手机上 hover 不好用

改用 `tap-template.html`，基于 `<details>/<summary>`，不依赖鼠标悬停。

### 可以放多少段隐藏文字

建议每段不超过 3-5 行。`max-height` 设为 15em，超长内容会被截断。

### 可以在同一段正文里用多个分隔器吗

可以。每个 `<div class="secret-divider ...">` 或 `<details class="secret-divider ...">` 都是独立的。

### 我的预览和读者看到的不一样

常见原因：
- 读者关闭了 creator styles
- 读者用下载阅读（下载不会保留 work skin）
- 不同浏览器/设备对 `transition` 渲染略有差异

这是 AO3 的正常限制，不是模板坏了。

### 我该忽略哪些文件

普通用户只需要关心 `effects/secret-divider/` 下的内容，其他都可以忽略。

---

## 维护与验证

> 本节面向维护者和协作者。如果你只是想发文，看上面两节就够了。

### 什么时候需要验证

- 改了 `effects/secret-divider/work-skin.css`
- 改了模板文件
- 想确认 AO3 真实解析不会过滤某种 HTML 或 CSS

### 验证流程

1. 修改 CSS 或模板
2. 在本地打开 `effects/secret-divider/preview.html`，确认四种预览状态都正常
3. 运行 `node tools/verify.mjs`
4. 如需真实 AO3 验证，按 `docs/ao3-live-validation.md` 的流程执行

### 验证成功标准

**hover-template**：结构节点完整，加上 `secret-divider--preview-open` 后文字区域出现非零 `max-height` 和 `opacity`。

**tap-template**：找到 `details.secret-divider--details`，打开后文字区域出现非零 `max-height` 和 `opacity`。

---

## 参考笔记

### 关键设计决策

- 花纹分隔符始终可见，即使隐藏文字没有触发也不会显得缺少内容
- 使用 `max-height` + `opacity` 双重过渡，避免 AO3 不支持 `gap` / `grid` 的限制
- `details/summary` 兼容触屏设备
- 使用 `secret-divider--preview-open` 类做验证时强制展开（对应 AO3 不允许 `id` 的问题）

### Unicode 装饰字符参考

可在 `secret-divider__ornament` 中使用的字符：

| 字符 | HTML 实体 | 说明 |
|------|-----------|------|
| ✦ | `&#10022;` | 四角星 |
| ✶ | `&#10038;` | 六角星 |
| ❋ | `&#10059;` | 八瓣花 |
| ✿ | `&#10047;` | 花 |
| ❀ | `&#10048;` | 白花 |
| ⟡ | `&#10209;` | 菱形 |
| • | `&#8226;` | 圆点 |
