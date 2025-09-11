import { useInfiniteQuery, useQuery } from '@tanstack/vue-query'
import { type MessagesResponse } from '@/lib'
import { pbMessagesGetOneApi, pbMessagesListRoomCursorApi } from '@/api'
import { queryKeys } from './query-keys'
import { queryConfig } from '@/config'
import { queryRetryPbNetworkError } from './query-retry'

/** 聊天页消息 游标分页无限查询 */
export const useChatRoomMessagesInfiniteQuery = (data: { roomId: string }) => {
  const { roomId } = data

  const infiniteQuery = useInfiniteQuery({
    queryKey: queryKeys.chatRoomMessagesInfinite(roomId),
    queryFn: async ({ pageParam }: { pageParam: MessagesResponse | null }) => {
      const pbRes = await pbMessagesListRoomCursorApi({
        roomId,
        pageParam,
      })

      return pbRes
    },
    initialPageParam: null,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.items.length === 0 || lastPage.totalPages === 1) {
        return undefined
      }
      return lastPage.items[lastPage.items.length - 1]
    },
    // 缓存时间
    // gcTimeInfinity staleTimeStatic 避免useInfiniteQuery的多页refetch
    // note\笔记\250911-避免useInfiniteQuery的多页refetch.md
    gcTime: queryConfig.gcTimeInfinity,
    staleTime: queryConfig.staleTimeStatic,
    // ✅ 在网络错误时重试
    retry: queryRetryPbNetworkError,
  })

  return infiniteQuery
}

/** 聊天页消息 GetOne */
export const useChatRoomMessagesGetOneQuery = (data: {
  messageId: ComputedRef<string | null | undefined>
}) => {
  const { messageId } = data

  const query = useQuery({
    // 查询依赖，需 messageId
    enabled: computed(() => messageId.value != null),
    // 查询键（响应式）
    queryKey: computed(() => queryKeys.chatRoomMessagesGetOne(messageId.value)),
    queryFn: async () => {
      // 无消息id，抛出错误
      if (messageId.value == null) {
        throw new Error('dialogMessageId.value == null')
      }
      // pb请求
      const pbRes = await pbMessagesGetOneApi(messageId.value)

      // TODO 持久化

      return pbRes
    },
    // TODO 占位数据
    // 缓存时间
    gcTime: queryConfig.gcTimeLong,
    staleTime: queryConfig.staleTimeLong,
    // ✅ 在网络错误时重试
    retry: queryRetryPbNetworkError,
  })

  return query
}
