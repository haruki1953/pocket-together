import { useChatRoomMessagesInfiniteQuery } from '@/queries'
import { useRealtimeMessagesStore } from '@/stores'

/** 封装了聊天页的数据及其处理相关内容 */
export const useChatDataProcessMessages = () => {
  // 聊天页消息 游标分页无限查询
  const chatRoomMessagesInfiniteQuery = useChatRoomMessagesInfiniteQuery({
    roomId: '',
  })
  // 将分页数据处理为消息数组，反转（从旧到新）
  const chatRoomMessagesList = computed(() => {
    if (chatRoomMessagesInfiniteQuery.data.value == null) {
      return null
    }
    // 处理为数组
    const messagesListData: Array<
      (typeof chatRoomMessagesInfiniteQuery.data.value)['pages'][number]['items'][number]
    > = []
    chatRoomMessagesInfiniteQuery.data.value.pages.forEach((pagesItem) => {
      messagesListData.push(...pagesItem.items)
    })
    // 反转
    const messagesListReverseData = messagesListData.reverse()
    return messagesListReverseData
  })

  // 实时消息Store
  const realtimeMessagesStore = useRealtimeMessagesStore()
  // 从实时消息中，获取本房间的消息
  const chatRoomMessagesRealtime = computed(() => {
    return realtimeMessagesStore.createList.filter((i) => i.room === '')
  })

  // 将 MessagesRealtime 和 MessagesList 融合
  const chatRoomMessagesListAndRealtime = computed(() => {
    if (chatRoomMessagesList.value == null) {
      return null
    }
    // 将MessagesRealtime与MessagesList重复的删除
    const messagesRealtimeDeleteDuplicates =
      chatRoomMessagesRealtime.value.filter(
        (realtimaeItem) =>
          chatRoomMessagesList.value?.find(
            (listItem) => listItem.id === realtimaeItem.id
          ) == null
      )
    return [...chatRoomMessagesList.value, ...messagesRealtimeDeleteDuplicates]
  })

  return {
    chatRoomMessagesInfiniteQuery,
    chatRoomMessagesList,
    chatRoomMessagesRealtime,
    chatRoomMessagesListAndRealtime,
  }
}
