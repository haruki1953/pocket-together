import { type RoomsRecord, type RoomsResponse, type UsersResponse } from '@/lib'
import type { Group, KeyValueMirror } from '@/types'

/**
 * rooms集合响应类型，with expand 关联的类型
 * 将用于pbApi的响应泛型
 */
export type RoomsResponseWithExpandType = RoomsResponse<RoomsRecordExpandType>

/**
 * expand 关联的类型 rooms集合，将用于RoomPage中的查询
 * 指定集合中需要展开的关联字段及其响应类型
 */
export type RoomsRecordExpandType = {
  author?: UsersResponse
}

/** expand 字符串 rooms集合 */
export const roomsExpand = (() => {
  // 显式声明需要展开的字段键集合
  const recordKeys = {
    author: 'author',
  } as const satisfies Group<
    // 限制键必须来自 `[CollectionName]Record`，可选（允许只使用部分字段）
    Partial<Record<keyof RoomsRecord, string>>
  > satisfies Group<
    // 限制键集合必须与 `RecordExpand` 完全一致，且每个键的值必须与键名相同（KeyValueMirror）
    KeyValueMirror<keyof RoomsRecordExpandType>
  >

  // 将字段键拼接为 expand 查询字符串
  // 模板字面量类型（Template Literal Types）可以在类型层面进行字符串拼接、组合和约束。
  // type const = "author"
  return `${recordKeys.author}` as const
})()
