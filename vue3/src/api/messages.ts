import {
  Collections,
  pb,
  type FilesResponse,
  type MessagesRecord,
  type MessagesResponse,
  type RoomsResponse,
  type UsersResponse,
} from '@/lib'
import type { Group, KeyValueMirror } from '@/types'
import { fetchWithTimeoutPreferred } from '@/utils'

/** pb messages集合，游标分页查询 */
export const pbMessagesListRoomCursorApi = async (data: {
  /** 指定房间（空字符串即为全局聊天） */
  roomId: string
  /** 作为游标的数据 */
  pageParam: MessagesResponse | null
}) => {
  const { roomId, pageParam } = data

  // 📦 定义 PocketBase 扩展字段的响应类型
  type Expand = MessagesResponse<RecordExpand>
  // 🎯 指定集合中需要展开的关联字段及其响应类型
  type RecordExpand = {
    author?: UsersResponse
    quoteRoom?: RoomsResponse
    quoteFile?: FilesResponse
  }

  // 🧠 类型安全地构造 expand 字符串
  const expand = (() => {
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
      KeyValueMirror<keyof RecordExpand>
    >

    // 🧩 将字段键拼接为 expand 查询字符串
    // author,quoteRoom,quoteFile
    return `${recordKeys.author},${recordKeys.quoteRoom},${recordKeys.quoteFile}`
  })()

  // 类型安全地构造 sort 字符串
  const sort = (() => {
    const recordKeys = {
      created: 'created',
      id: 'id',
    } as const satisfies Group<
      // 限制键必须来自 `MessagesRecord` 且每个键的值必须与键名相同（KeyValueMirror），可选（允许只使用部分字段）
      Partial<KeyValueMirror<keyof MessagesRecord>>
    >
    // 将字段键拼接为 sort 查询字符串
    // -created,id
    // 日期降序，（日期相同时）id升序
    return `-${recordKeys.created},${recordKeys.id}`
  })()

  // 类型安全地构造 filter 字符串
  const filter = (() => {
    const recordKeys = {
      created: 'created',
      id: 'id',
      room: 'room',
    } as const satisfies Group<
      // 限制键必须来自 `MessagesRecord` 且每个键的值必须与键名相同（KeyValueMirror），可选（允许只使用部分字段）
      Partial<KeyValueMirror<keyof MessagesRecord>>
    >
    // return `${recordKeys.created}>'2025-08-14 00:19:07.684Z'`
    // 无所属房间（房间id为空字符串）即为全局聊天
    /**
     * - 指定房间
     * - 控制游标
     */
    return (() => {
      // 第一次查询，无需游标
      if (pageParam == null) {
        return `${recordKeys.room}='${roomId}'`
      }
      // 不是第一次查询，需控制游标
      /**
       * 查询created比游标所指的小的，因为上面的sort是created降序排序。
       * 需要考虑到created相同的情况，所以需要借助id来固定顺序，
       * 上面的sort是（日期相同时）id升序，所以created相等时查询id比游标所指小的
       */
      return `
      (
        ${recordKeys.room}='${roomId}' &&
        (
          ${recordKeys.created}<'${pageParam.created}' ||
          (
            ${recordKeys.created}='${pageParam.created}' &&
            ${recordKeys.id}>'${pageParam.id}'
          )
        )
      )
      `
    })()
  })()

  // 🚀 发起 PocketBase 查询，携带类型安全的 expand 字段与 Expand 类型，并有 sort filter
  const pbRes = await pb
    .collection(Collections.Messages)
    .getList<Expand>(1, 2, {
      expand,
      sort,
      filter,
      // timeout为5000
      fetch: fetchWithTimeoutPreferred,
    })
  // pbRes.items[0].expand
  console.log(pbRes)
  return pbRes
}
