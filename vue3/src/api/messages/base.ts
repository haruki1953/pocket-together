/** messages pb查询时一般要用的 Expand ，将在多个api中使用 */

import type {
  FilesResponse,
  MessagesRecord,
  MessagesResponse,
  RoomsResponse,
  UsersResponse,
} from '@/lib'
import type { Group, KeyValueMirror } from '@/types'

// 📦 定义 PocketBase 扩展字段的响应类型
export type MessagesResponseWidthExpand = MessagesResponse<MessagesRecordExpand>
// 🎯 指定集合中需要展开的关联字段及其响应类型
type MessagesRecordExpand = {
  author?: UsersResponse
  quoteRoom?: RoomsResponse
  quoteFile?: FilesResponse
}
// 🧠 类型安全地构造 expand 字符串
export const messagesExpand = (() => {
  /**
   * ✅ 显式声明需要展开的字段键集合
   * - 意义在于当pocketbase集合字段修改时，此处会报错以实现类型安全
   * - 防止拼写错误
   *
   * 类型约束说明：
   * 1. `Partial<Record<keyof [CollectionName]Record, string>>`
   *    - 限制键必须来自 `[CollectionName]Record`，可选（允许只使用部分字段）
   *
   * 2. `KeyValueMirror<keyof RecordExpand>`
   *    - 限制键集合必须与 `RecordExpand` 完全一致
   *    - 且每个键的值必须与键名相同（KeyValueMirror）
   *    - 结合类型约束说明1，不仅是对recordKeys的约束，更是对RecordExpand的校验
   *
   * `type Group<T> = T` 是一个语义占位类型，用于在复杂类型表达式中进行视觉分组。
   * 它不会对类型 `T` 做任何变换，仅用于替代括号分组，因Prettier会移除括号而导致混乱，所以使用Group<T>来替代括号
   */
  const recordKeys = {
    author: 'author',
    quoteRoom: 'quoteRoom',
    quoteFile: 'quoteFile',
  } as const satisfies Group<
    // 限制键必须来自 `[CollectionName]Record`，可选（允许只使用部分字段）
    Partial<Record<keyof MessagesRecord, string>>
  > satisfies Group<
    // 限制键集合必须与 `RecordExpand` 完全一致，且每个键的值必须与键名相同（KeyValueMirror）
    KeyValueMirror<keyof MessagesRecordExpand>
  >

  // 🧩 将字段键拼接为 expand 查询字符串
  // 模板字面量类型（Template Literal Types）可以在类型层面进行字符串拼接、组合和约束。
  // type const = "author,quoteRoom,quoteFile"
  return `${recordKeys.author},${recordKeys.quoteRoom},${recordKeys.quoteFile}` as const
})()
