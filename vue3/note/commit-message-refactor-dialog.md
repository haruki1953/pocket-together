refactor(room): use ElMessageBox for delete confirmation

### 重构内容

将删除房间时的确认提示框从浏览器原生的 `confirm()` 方法替换为 Element Plus 的 `ElMessageBox.confirm` 组件。

### 重构原因

- **提升用户体验**: `ElMessageBox` 提供了与项目整体风格一致、更美观的 UI。
- **解决 Lint 警告**: 遵循现代前端开发规范，移除了会触发 `no-alert` Eslint 规则的浏览器原生 `confirm()` 调用。
- **异步流程改进**: `ElMessageBox` 基于 Promise，能更优雅地融入 `async/await` 流程，通过 `try/catch` 块清晰地处理用户确认和取消两种情况。

---
**标题中文翻译**：重构(房间): 使用 ElMessageBox 作为删除确认框
