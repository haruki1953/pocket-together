feat(home): prepare for PocketBase data integration

**功能描述**

本次提交为首页（`HomePage.vue`）接入 PocketBase 后端数据做好了准备，并同步更新了数据库结构以支持新功能。

**主要特性**

*   **移除模拟数据**: 删除了 `HomePage.vue` 中用于生成瀑布流卡片的硬编码模拟数据，为接入真实数据做准备。
*   **后端集成准备**: 在原模拟数据位置添加了 `TODO` 注释，明确了下一步将从 PocketBase `rooms` 集合中获取房间列表数据。
*   **数据库结构更新**:
    *   更新了 `pocketbase/pb_schema.json` 文件，以匹配新的后端需求。
    *   在 `rooms` 集合中增加了 `tags` (json) 和 `password` (text) 字段。
    *   扩展了 `rooms` 集合 `cover` 字段所支持的 `MIME types`，新增了 `image/png` 和 `image/svg+xml`。
*   **代码质量改进**: 为 `HomePage.vue` 中的多个 `ref` 变量添加了显式的 TypeScript 类型定义，增强了代码的类型安全性和可读性。

---
**对标题行的中文翻译**

功能(home): 为 PocketBase 数据集成做准备
