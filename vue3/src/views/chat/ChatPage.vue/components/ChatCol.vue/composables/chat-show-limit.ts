import { watchUntilSourceCondition } from '@/utils'
import type {
  ChatRoomMessagesListAndRealtimeType,
  TwowayPositioningCursorDataType,
} from './dependencies'
import { chatRoomMessagesLimitInitShowItemNumberConfig } from '@/config'

/** 封装了聊天页消息显示数量限制控制相关的内容 */
export const useChatShowLimitControl = (data: {
  //
  chatRoomMessagesListAndRealtime: ChatRoomMessagesListAndRealtimeType
}) => {
  const {
    //
    chatRoomMessagesListAndRealtime,
  } = data
  // 限制消息显示数量，顶部游标与底部游标
  const chatRoomMessagesLimitTopCursor = ref<string | null>(null)
  const chatRoomMessagesLimitBottomCursor = ref<string | null>(null)

  // 已限制数量的消息列表
  const chatRoomMessagesLimitList = computed(() => {
    // chatRoomMessagesListAndRealtime 没有值，返回null
    if (chatRoomMessagesListAndRealtime.value == null) {
      return null
    }
    // 都为默认值，限制数量功能还未初始化，返回null
    if (
      chatRoomMessagesLimitTopCursor.value == null &&
      chatRoomMessagesLimitBottomCursor.value == null
    ) {
      return null
    }

    // 找到两个Cursor所对应的序列值
    const indexTopCursor = (() => {
      // 未找到则默认为第一个
      const defaultIndex = 0
      if (chatRoomMessagesLimitTopCursor.value == null) {
        return defaultIndex
      }
      const findIndex = chatRoomMessagesListAndRealtime.value.findIndex(
        (i) => i.id === chatRoomMessagesLimitTopCursor.value
      )
      if (findIndex === -1) {
        return defaultIndex
      }
      return findIndex
    })()
    const indexBottomCursor = (() => {
      // 未找到则默认为最后一个
      const defaultIndex = chatRoomMessagesListAndRealtime.value.length - 1
      if (chatRoomMessagesLimitBottomCursor.value == null) {
        return defaultIndex
      }
      const findIndex = chatRoomMessagesListAndRealtime.value.findIndex(
        (i) => i.id === chatRoomMessagesLimitBottomCursor.value
      )
      if (findIndex === -1) {
        return defaultIndex
      }
      return findIndex
    })()

    // 包含indexBottomCursor所指的
    const limitList = chatRoomMessagesListAndRealtime.value.slice(
      indexTopCursor,
      indexBottomCursor + 1
    )
    return limitList
  })

  // 初始化显示限制，setup时就可以进行
  ;(async () => {
    // 等待存在消息数据
    await watchUntilSourceCondition(
      chatRoomMessagesListAndRealtime,
      (val) => val != null
    )
    // 此时仍不存在消息数据是异常的，直接返回
    // watchUntilSourceCondition 并不能约束类型
    // 主要目的是让下文的 chatRoomMessagesListAndRealtime 类型正确
    if (chatRoomMessagesListAndRealtime.value == null) {
      console.error('chatRoomMessagesListAndRealtime.value == null')
      return
    }

    // chatRoomMessagesLimitInitShowItemNumberConfig 简称为 cRMLISINC
    // 从后往前限制 cRMLISINC 个，也就是找到从后往前第 cRMLISINC 个的item
    const indexTopCursor = (() => {
      // length - cRMLISINC 即从后往前第 cRMLISINC 个的item
      const index =
        chatRoomMessagesListAndRealtime.value.length -
        chatRoomMessagesLimitInitShowItemNumberConfig
      // 避免index不合法，一般是数组过短引起的 index < 0，返回 0 即可，意为数组从后往前不够 cRMLISINC 个则尽可能靠前的item
      if (
        index < 0 ||
        index > chatRoomMessagesListAndRealtime.value.length - 1
      ) {
        return 0
      }
      return index
    })()

    const itemTopCursor = chatRoomMessagesListAndRealtime.value[indexTopCursor]

    // 为用于显示数量限制的游标赋值
    chatRoomMessagesLimitTopCursor.value = itemTopCursor.id
  })()

  return {
    chatRoomMessagesLimitTopCursor,
    chatRoomMessagesLimitBottomCursor,
    chatRoomMessagesLimitList,
  }
}

/** 封装了聊天页消息显示数量限制控制相关的内容 双向 */
export const useChatShowLimitControlTwoway = (data: {
  // 所有消息数据
  chatRoomMessagesListAndRealtime: ChatRoomMessagesListAndRealtimeType
  // 双向定位无限查询的定位游标数据，在限制游标的初始化时会使用，
  // 用于判断消息查询时从最新的开始 twowayPositioningCursorData === null
  // 或是游标定位双向查询 id created
  twowayPositioningCursorData: TwowayPositioningCursorDataType
}) => {
  const {
    //
    chatRoomMessagesListAndRealtime,
    twowayPositioningCursorData,
  } = data
  // 限制消息显示数量，顶部游标与底部游标
  const chatRoomMessagesLimitTopCursor = ref<string | null>(null)
  const chatRoomMessagesLimitBottomCursor = ref<string | null>(null)

  // 已限制数量的消息列表
  const chatRoomMessagesLimitList = computed(() => {
    // chatRoomMessagesListAndRealtime 没有值，返回null
    if (chatRoomMessagesListAndRealtime.value == null) {
      return null
    }
    // 都为默认值，限制数量功能还未初始化，返回null
    if (
      chatRoomMessagesLimitTopCursor.value == null &&
      chatRoomMessagesLimitBottomCursor.value == null
    ) {
      return null
    }

    // 找到两个Cursor所对应的序列值
    const indexTopCursor = (() => {
      // 未找到则默认为第一个
      const defaultIndex = 0
      if (chatRoomMessagesLimitTopCursor.value == null) {
        return defaultIndex
      }
      const findIndex = chatRoomMessagesListAndRealtime.value.findIndex(
        (i) => i.id === chatRoomMessagesLimitTopCursor.value
      )
      if (findIndex === -1) {
        return defaultIndex
      }
      return findIndex
    })()
    const indexBottomCursor = (() => {
      // 未找到则默认为最后一个
      const defaultIndex = chatRoomMessagesListAndRealtime.value.length - 1
      if (chatRoomMessagesLimitBottomCursor.value == null) {
        return defaultIndex
      }
      const findIndex = chatRoomMessagesListAndRealtime.value.findIndex(
        (i) => i.id === chatRoomMessagesLimitBottomCursor.value
      )
      if (findIndex === -1) {
        return defaultIndex
      }
      return findIndex
    })()

    // 包含indexBottomCursor所指的
    const limitList = chatRoomMessagesListAndRealtime.value.slice(
      indexTopCursor,
      indexBottomCursor + 1
    )
    return limitList
  })

  // 初始化显示限制，setup时就可以进行
  ;(async () => {
    // 等待存在消息数据
    await watchUntilSourceCondition(
      chatRoomMessagesListAndRealtime,
      (val) => val != null
    )
    // 此时仍不存在消息数据是异常的，直接返回
    // watchUntilSourceCondition 并不能约束类型
    // 主要目的是让下文的 chatRoomMessagesListAndRealtime 类型正确
    if (chatRoomMessagesListAndRealtime.value == null) {
      console.error('chatRoomMessagesListAndRealtime.value == null')
      return
    }

    // 【双向】
    // twowayPositioningCursorData.value == null
    // 双向定位游标为 null，即其为从最新的消息开始查询（和单向一样），初始化限制游标，使其从最底部开始显示
    if (twowayPositioningCursorData.value == null) {
      // chatRoomMessagesLimitInitShowItemNumberConfig 简称为 cRMLISINC
      // 从后往前限制 cRMLISINC 个，也就是找到从后往前第 cRMLISINC 个的item
      const indexTopCursor = (() => {
        // length - cRMLISINC 即从后往前第 cRMLISINC 个的item
        const index =
          chatRoomMessagesListAndRealtime.value.length -
          chatRoomMessagesLimitInitShowItemNumberConfig
        // 避免index不合法，一般是数组过短引起的 index < 0，返回 0 即可，意为数组从后往前不够 cRMLISINC 个则尽可能靠前的item
        if (
          index < 0 ||
          index > chatRoomMessagesListAndRealtime.value.length - 1
        ) {
          return 0
        }
        return index
      })()

      const idTopCursor =
        chatRoomMessagesListAndRealtime.value[indexTopCursor].id
      const idBottomCursor = null

      // 为用于显示数量限制的游标赋值
      chatRoomMessagesLimitTopCursor.value = idTopCursor
      chatRoomMessagesLimitBottomCursor.value = idBottomCursor
    }
    // twowayPositioningCursorData.value != null
    // 双向定位游标有值，即其为正常的双向定位查询，初始化限制游标，使其显示当前全部数据
    else {
      // 如果没有更新的消息，则BottomCursor为null
      // 【TODO】需要一些处理，可能使其显示当前全部数据并不合适，要限制数量
    }
  })()

  return {
    chatRoomMessagesLimitTopCursor,
    chatRoomMessagesLimitBottomCursor,
    chatRoomMessagesLimitList,
  }
}
