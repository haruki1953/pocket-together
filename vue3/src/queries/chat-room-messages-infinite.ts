import { useInfiniteQuery } from '@tanstack/vue-query'
import { type MessagesResponse } from '@/lib'
import { pbMessagesListRoomCursorApi } from '@/api'
import { queryKeys } from './query-keys'

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
  })

  return infiniteQuery
}
