import {
  useChatRoomMessagesInfiniteQuery,
  useChatRoomMessagesInfiniteTwowayQuery,
} from '@/queries'
import { useRealtimeMessagesStore } from '@/stores'
import type { TwowayPositioningCursorDataType } from './dependencies'

/** 封装了聊天页的数据及其处理相关内容 */
export const useChatDataProcessMessages = () => {
  // 聊天页消息 游标分页无限查询
  const chatRoomMessagesInfiniteQuery = useChatRoomMessagesInfiniteQuery({
    roomId: computed(() => ''),
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

/** 封装了聊天页的数据及其处理相关内容 双向 */
export const useChatDataProcessMessagesTwoway = (data: {
  twowayPositioningCursorData: TwowayPositioningCursorDataType
}) => {
  const { twowayPositioningCursorData } = data

  // 聊天页消息 游标分页无限查询
  const chatRoomMessagesInfiniteTwowayQuery =
    useChatRoomMessagesInfiniteTwowayQuery({
      roomId: computed(() => ''),
      twowayPositioningCursorData: computed(
        () => twowayPositioningCursorData.value
      ),
    })
  console.log(
    'chatRoomMessagesInfiniteTwowayQuery.data.value',
    chatRoomMessagesInfiniteTwowayQuery.data.value
  )
  // 将分页数据处理为消息数组，反转（从旧到新）
  const chatRoomMessagesList = computed(() => {
    if (chatRoomMessagesInfiniteTwowayQuery.data.value == null) {
      return null
    }
    // 处理为数组
    const messagesListData: Array<
      (typeof chatRoomMessagesInfiniteTwowayQuery.data.value)['pages'][number]['items'][number]
    > = []
    chatRoomMessagesInfiniteTwowayQuery.data.value.pages.forEach(
      (pagesItem) => {
        messagesListData.push(...pagesItem.items)
      }
    )
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
    // 【双向】如果有更新的数据还没有请求，则不与 MessagesRealtime 融合，这是双向查询需要注意的
    console.log(chatRoomMessagesInfiniteTwowayQuery.hasPreviousPage.value)
    if (chatRoomMessagesInfiniteTwowayQuery.hasPreviousPage.value === true) {
      return chatRoomMessagesList.value
    }

    // // 将MessagesRealtime与MessagesList重复的删除
    // const messagesRealtimeDeleteDuplicates =
    //   chatRoomMessagesRealtime.value.filter(
    //     (realtimaeItem) =>
    //       chatRoomMessagesList.value?.find(
    //         (listItem) => listItem.id === realtimaeItem.id
    //       ) == null
    //   )
    // return [...chatRoomMessagesList.value, ...messagesRealtimeDeleteDuplicates]

    // 【250919】更改为过滤出MessagesRealtime中比MessagesList大的（更新的）
    const messagesRealtimeMoreRecentList = (() => {
      if (chatRoomMessagesList.value.length === 0) {
        return chatRoomMessagesRealtime.value
      }
      const messagesListLatestItem =
        chatRoomMessagesList.value[chatRoomMessagesList.value.length - 1]

      return chatRoomMessagesRealtime.value.filter((realtimaeItem) => {
        // 这个标准时间字符串可以直接比较大小
        return realtimaeItem.created > messagesListLatestItem.created
      })
    })()
    return [...chatRoomMessagesList.value, ...messagesRealtimeMoreRecentList]
  })

  return {
    chatRoomMessagesInfiniteTwowayQuery,
    chatRoomMessagesList,
    chatRoomMessagesRealtime,
    chatRoomMessagesListAndRealtime,
  }
}
