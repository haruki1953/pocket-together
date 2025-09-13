refactor(queries): enhance type safety for room queries

**重构背景**

在之前的实现中，从 PocketBase 获取关联（`expand`）字段时，返回的数据是 `any` 类型，这导致在访问 `room.expand.author` 等属性时缺乏类型安全和自动补全，容易引发潜在的运行时错误。

**主要变更**

*   **增强类型安全**:
    *   在 `useRoomsInfiniteQuery` 钩子中，调用 `pb.collection(...).getList` 时，通过泛型参数 `<RoomsResponse<{ author: UsersResponse }>>` 明确指定了 `expand` 字段的类型。
    *   这一变更使得 TypeScript 能够精确推断出 `room.expand.author` 的数据结构，从而提供了完整的类型检查和编辑器自动补全功能。

*   **同步 PocketBase 类型定义**:
    *   更新了 `pocketbase-types.ts` 文件中的 `RoomsRecord` 和 `RoomsResponse` 类型，使其与最新的数据库 `rooms` 集合结构保持一致（例如，添加了 `tags` 和 `password` 字段）。

*   **提高代码清晰度**:
    *   在 `rooms.ts` 中为 `queryKey`、`queryFn` 和 `getNextPageParam` 等关键选项添加了更详尽的中文注释，使代码意图更易于理解。

*   **调整分页参数**:
    *   将每次请求获取的条目数（`perPage`）从 `10` 调整为 `8`。

---
**对标题行的中文翻译**

重构(queries): 增强房间查询的类型安全性
