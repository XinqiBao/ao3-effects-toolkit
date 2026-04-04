# START HERE

这是给普通 AO3 使用者的最短路径。

如果你不懂代码，只做下面这几件事：

1. 把 `bundle/work-skin.css` 复制到 AO3 的 `Work Skin`
2. 把 `bundle/smoke-test.html` 贴进 AO3 的 `HTML` 编辑器
3. 预览成功后，再换成正式模板

## 你真正需要的文件

- `bundle/work-skin.css`
- `bundle/smoke-test.html`
- `bundle/hover-template-zh.html`
- `bundle/tap-template-zh.html`

如果出问题，再看：

- `guides/FAQ-ZH.md`

## 第一步：创建 Work Skin

1. 登录 AO3
2. 打开 `My Dashboard`
3. 进入 `Skins`
4. 选择 `Create Work Skin`
5. 把 `bundle/work-skin.css` 全量复制进去
6. 保存

## 第二步：把 Skin 挂到作品

1. 新建作品，或者编辑已有作品
2. 在 `Associations` 里找到 `Select Work Skin`
3. 选中你刚刚创建的那个 Skin

## 第三步：先做最小测试

1. 把正文编辑器切到 `HTML`
2. 复制 `bundle/smoke-test.html`
3. 粘贴进去
4. 点击 `Preview`

如果你看到一个浅棕色信封，说明挂载成功了。

## 第四步：换成正式模板

### 最稳的正式版本

用：

- `bundle/hover-template-zh.html`

这个版本最适合第一次正式发文。

### 更适合手机的版本

用：

- `bundle/tap-template-zh.html`

这个版本基于 `details/summary`，更适合触屏。

## 如何改模板

模板里只改这些带 `【】` 的位置：

- `【寄件人名字】`
- `【寄件地址第一行】`
- `【寄件地址第二行】`
- `【收件人或信件标题】`
- `【第一折内容】`
- `【第二折内容】`
- `【第三折内容】`

不要删标签，不要乱改类名。

## 两个重要限制

- AO3 不允许 JavaScript
- 读者可以关闭 work skins，所以关键信息不要只靠视觉效果表达
