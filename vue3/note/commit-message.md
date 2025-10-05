refactor(rooms): unify filter state naming and connect to view

**变更描述**

*   将 `useRoomsInfiniteQuery` 中的参数 `onlyUser` 重命名为 `onlyUserRooms`，以使其与 `room-query` store 中的状态变量名保持一致。
*   在 `HomePage.vue` 中，将 `onlyUserRooms` 状态从 store 传递给 `useRoomsInfiniteQuery` hook，从而将筛选状态与数据查询逻辑完全连接起来。

**变更原因**

*   **提高一致性:** 统一命名 (`onlyUserRooms`) 增强了代码的可读性和可维护性，减少了在不同文件间追踪状态时的混淆。
*   **完成功能:** 此前，筛选状态 (`onlyUserRooms`) 存在于 store 中，但并未传递给数据查询 hook。本次变更完成了这一连接，使得“只看我的房间”功能可以正常工作。

---
*标题中文翻译：*
重构(房间): 统一筛选状态命名并连接到视图
