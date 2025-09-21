```
feat(room): Implement room creation functionality

### 功能描述

实现了用户创建新房间的功能，包括表单验证、数据提交至 PocketBase 以及成功后的页面跳转。

### 主要特性

- **房间创建逻辑**: 添加了 `createRoom` 异步函数，负责收集房间标题、描述和作者信息。
- **用户认证检查**: 在创建前验证用户是否已登录 (`authStore.record == null`)。
- **标题验证**: 确保房间标题不为空 (`roomTitle.value.trim() == null`)。
- **数据持久化**: 使用 `pb.collection('rooms').create()` 将房间数据存储到 PocketBase。
- **页面导航**: 房间创建成功后，自动跳转到新创建房间的详情页面 (`RoomDetailPage`)。
- **错误处理**: 包含 `try...catch` 块，处理房间创建失败的情况。
- **依赖引入**: 引入了 `useRouter` 和 `useAuthStore` 以支持导航和用户认证。
- **UI 绑定**: 将 `createRoom` 函数绑定到创建按钮的点击事件。

```

---
**标题行中文翻译：**

功能(room): 实现房间创建功能
