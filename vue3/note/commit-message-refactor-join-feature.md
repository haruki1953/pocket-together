refactor(room): complete favorite to join functionality rename

### 重构内容

全面完成了将房间的“收藏”功能重命名并转换为“加入群组”功能。

### 主要变更

- **数据模型与查询**:
    - 更新了 `query-keys.ts` 和 `rooms.ts` 中 `useRoomsInfiniteQuery` 的参数、接口定义、函数签名及内部过滤逻辑，将所有 `onlyFavoriteRooms` 和 `favorites` 替换为 `onlyJoinRooms` 和 `join`。
- **状态管理**:
    - `room-query.ts` store 中 `onlyFavoriteRooms` ref 及其在 `HomePage.vue` 中的解构和传递均已更新为 `onlyJoinRooms`。
- **用户界面与交互**:
    - `Menudesu.vue` 中与“收藏房间”相关的函数名、变量名、i18n 键以及模板绑定均已更新为“加入群组”相关命名。
    - `home.ts` 中 `homeMenuFavoriteRooms` 的翻译文本已更新为“Joined Rooms”/“进驻房间”。
- **其他**:
    - `home.ts` 中 `createRoomError_fileTooLarge` 的图片大小限制从 10MB 调整为 5MB。

---
**标题中文翻译**：重构(房间): 完成收藏到加入功能的重命名
