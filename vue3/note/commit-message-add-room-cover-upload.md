```
feat(room): Add cover image upload and preview for room creation

### 功能描述

为创建房间功能增加了封面图片上传和实时预览的能力，提升了用户创建房间的体验和视觉丰富性。

### 主要特性

- **图片上传**: 实现了文件输入 (`<input type="file">`) 的处理逻辑 (`onImgFile` 函数)，允许用户选择本地图片作为房间封面。
- **实时预览**: 利用 `URL.createObjectURL` 实现了封面图片的即时预览，并在图片更换时进行内存清理 (`URL.revokeObjectURL`)。
- **数据集成**: 将上传的图片文件 (`roomImage`) 集成到 `createRoom` 函数的 `roomData` 中，以便提交至 PocketBase。
- **上传验证**: 在创建房间前增加了封面图片是否已上传的验证 (`roomImageUrl.value == null`)。
- **UI 交互**: 设计了用户友好的上传区域，通过点击装饰框触发文件选择，并根据是否有图片显示上传提示或预览图。
- **状态管理**: 引入 `roomImageUrl` 和 `roomImage` 两个响应式变量来管理图片预览和文件数据。

```

---
**标题行中文翻译：**

功能(room): 为创建房间添加封面图片上传和预览
