# AO3 三折信纸 — 使用指南

## 快速开始

不懂代码？只做这几步：

1. 把 `envelope/work-skin.css` 全量复制到 AO3 的 Work Skin
2. 把 `envelope/smoke-test.html` 贴进 AO3 的 HTML 编辑器
3. 预览成功看到信封效果后，再换成正式模板

你真正需要关心的文件全在 `envelope/` 目录下：

- `work-skin.css` — 全部 CSS 样式
- `templates/smoke-test.html` — 最小测试
- `templates/hover-template.html` — 默认正式模板
- `templates/tap-template.html` — 触屏/手机友好版

其他所有目录（`dev/`、`docs/`、`local/`）普通用户都不需要碰。

⚠️ 两个硬限制：
- AO3 不允许 JavaScript
- 读者可以关闭 creator styles，关键信息不要只靠视觉效果表达

---

## 用户指南

### 第一步：创建 Work Skin

1. 登录 AO3 → My Dashboard → Skins → Create Work Skin
2. 把 `envelope/work-skin.css` 全量复制进去
3. 保存

### 第二步：把 Skin 挂到作品

1. 新建或编辑作品
2. 在 Associations 里找到 Select Work Skin
3. 选中刚创建的 Skin

### 第三步：最小测试

1. 正文编辑器切到 **HTML** 模式
2. 复制 `envelope/templates/smoke-test.html` 贴进去
3. 点 **Preview**

看到带地址的背卡和三折信纸，说明挂载成功。

⚠️ 如果 smoke test 都没效果，**先不要上正式模板**——回到第一步排查。

### 第四步：换成正式模板

| 场景 | 文件 | 说明 |
|------|------|------|
| 默认推荐（第一次发文） | `hover-template.html` | 最稳 |
| 手机/平板用户多 | `tap-template.html` | 基于 details/summary，不依赖 hover |

### 如何改模板

只改这些占位替换成你的内容：

- `【寄件人或小标题】`
- `【寄件地址第一行】`
- `【寄件地址第二行】`
- `【收件人名字或信件标题】`
- `【第一折内容】`
- `【第二折内容】`
- `【第三折内容】`

⚠️ 三不要：
- 不要删标签
- 不要乱改类名（`trifold-letter`、`letter-cover` 等）
- 不要用 Rich Text 模式粘贴——必须用 **HTML** 模式

---

## FAQ

### 为什么看到原始 HTML 标签（`<div>`、`<span>`）

编辑器模式切错了。解决：

1. 回到编辑器
2. 切到 **HTML** 模式
3. 重新粘贴

### 为什么只有普通文字，没有信封样式

Work Skin 没有成功挂到作品上。先用 smoke-test 验证，smoke-test 通过前不要上正式模板。

### 第一次该用哪个版本

顺序固定：

1. `smoke-test.html` → 确认挂载成功
2. `hover-template.html` → 默认正式版
3. `tap-template.html` → 触屏备选

### 手机上 hover 不好用

改用 `tap-template.html`，基于 `details/summary`，不依赖鼠标悬停。

### 为什么不建议用 `:target` 锚点版

AO3 会剥掉正文里的 `id` 属性，`#letter-open` 这类锚点在真实作品页不会保留。默认不再将其当正式模板。

### 展开后文字太挤

每折内容太长了。这个效果的设计前提是每折只放少量文字——动画是增强，不是排版系统。

### 我的预览和读者看到的不一样

常见原因：
- 读者关闭了 creator styles
- 读者用下载阅读（下载不会保留 work skin）

这是 AO3 的正常限制，不是模板坏了。

### 我该忽略哪些文件

普通用户只需要关心 `envelope/` 下的内容，其他都可以忽略。

---

## 维护与验证

> 本节面向维护者和协作者。如果你只是想发文，看上面两节就够了。

### 什么时候需要验证

- 改了 `envelope/work-skin.css`
- 改了 `envelope/templates/*.html`
- 想确认 AO3 真实解析会不会过滤某种 HTML 或 CSS
- 想确认模板不是只在本地好看

### 验证流程

1. 修改 `envelope/work-skin.css` 或模板文件
2. 运行 `node tools/verify.mjs` — 自动完成结构检查 + 本地预览截图
3. 如需真实 AO3 验证（首次需手动登录），脚本会贴入模板并检查 DOM 结构

### 验证成功标准

**smoke-test**：找到 `.letter-stage`、`.trifold-letter`、`.letter-cover`、`.letter-top`、`.letter-mid`、`.letter-bot`，背卡和三折有真实背景样式。

**hover-template**：结构节点完整，强制加上 `trifold-letter--preview-open` 后三折出现非零位移和非零 skew，保留交替倾斜。

**tap-template**：找到 `details.trifold-letter--details` 和 `summary.trifold-letter__stack`，打开 `details.open = true` 后三折出现非零位移和交替倾斜。

### 验证失败排查

- **截图不生成**：确认本地 HTTP 服务器正常启动（`node --version` 可用）
- **AO3 结构检查不通过**：窗口宽度可能触发移动断点（<= 720px），拉宽窗口重试或对照 `envelope/work-skin.css` 中的 `@media` 规则

### 维护者本地工作空间

**永远不要提交**：AO3 work id、skin id、个人调试笔记、Playwright session 数据。放在 `local/` 目录（已被 gitignore）。

**首次 AO3 验证**：Playwright 打开 AO3 登录页，你手动登录后 session 自动持久化到 `local/`。不存密码。

---

## 参考笔记

### Works/82088401

- 参考页：`https://archiveofourown.org/works/82088401/chapters/216016191`
- 最近人工核对：2026-04-04

### 关键观察

- 外层容器有 work-specific 命名，不适合作为通用类名
- 背卡、第一折、第二折、第三折明确分层
- hover 打开时：
  - 背卡会后移并旋转
  - 第一折和第三折同向倾斜
  - 第二折反向倾斜

### 我们刻意不照搬的部分

- 不复用参考页的 work-specific 后缀类名
- 不追求一模一样页面主题
- 不把参考页的所有视觉装饰原样搬进来
- 不使用对 AO3 不稳的交互方式

本仓库据此抽象出通用命名：`trifold-letter`、`letter-cover`、`letter-top`、`letter-mid`、`letter-bot`。

### 2026-04-04 验证结论

- `envelope/work-skin.css` 已成功写入并更新 AO3 work skin
- smoke-test、hover-template、tap-template 全部通过
- 验证窗口宽度落在移动端断点内，tap 和 hover 均成立
- 当前正式发布物覆盖了：AO3 真实解析、真实 Preview 渲染、移动端断点下的三折展开逻辑

### 更新参考笔记

参考页是灵感来源，不是绑定依赖。更新顺序：

1. 在真实浏览器里打开参考页
2. 用浏览器检查工具或 CDP 观察结构和状态变化
3. 更新笔记
4. 如果影响正式模板，同步更新 `envelope/` 下的正式文件
