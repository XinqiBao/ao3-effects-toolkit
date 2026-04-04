# FAQ

## 为什么会看到 `<div>`、`<span>` 这些原始标签

因为你贴进了 `Rich Text`，不是 `HTML`。

解决：

1. 回到编辑器
2. 切换到 `HTML`
3. 重新粘贴

## 为什么只看到普通文字，没有信封样式

通常是 Work Skin 没有成功挂到作品。

先用：

- `bundle/smoke-test.html`

如果 smoke test 都没有信封外观，就先不要上正式模板。

## 第一次该用哪个版本

顺序固定：

1. `bundle/smoke-test.html`
2. `bundle/hover-template-zh.html`
3. `bundle/tap-template-zh.html`

## 手机上 hover 不好用怎么办

改用：

- `bundle/tap-template-zh.html`

这个版本基于 `details/summary`，不再依赖 `id` 和锚点。

## 为什么不建议再用 `:target` 锚点版

因为 AO3 会剥掉正文里的 `id`，`#letter-open` 这类锚点在真实作品页里不会留下来。

这个仓库现在默认不再把那种方案当正式模板。

## 展开后文字太挤怎么办

把每一折的内容缩短。

这个项目的设计前提是：

- 每一折只放少量文字
- 动画是增强，不是正文排版系统

## 为什么我的预览和读者看到的不一样

可能原因：

- 读者关闭了 creator styles
- 读者使用下载阅读，下载不会保留 work skin

这不是模板坏了，是 AO3 的正常限制。

## 这个仓库里哪些是普通用户不用管的

普通用户可以忽略：

- `dev/`

那里面是本地预览和验证文件，不是拿去发 AO3 的。
