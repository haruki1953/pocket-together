import { compareDatesSafeWithNull, watchUntilSourceCondition } from '@/utils'
import type {
  ChatRoomMessagesForShowType,
  ChatRoomMessagesRealtimeType,
  PropsType,
} from './dependencies'
import {
  chatRoomMessagesScrollCaptureElementNumberConfig,
  chatRoomMessagesScrollRealtimeIsBottomDistanceConfig,
} from '@/config'
import { useScroll } from '@vueuse/core'

/** 封装了聊天页消息变动时的滚动处理 */
export const useChatScrollMessageChange = (data: {
  chatRoomMessagesForShow: ChatRoomMessagesForShowType
  chatRoomMessagesRealtime: ChatRoomMessagesRealtimeType
  props: PropsType
}) => {
  const { props, chatRoomMessagesForShow, chatRoomMessagesRealtime } = data

  // 消息变动时的滚动处理
  const messagesWarpScroll = useScroll(props.refScrollWarp)
  // props.refScrollWarp

  // 初始化时滚动到底部
  onMounted(async () => {
    // 等待存在消息数据
    await watchUntilSourceCondition(
      chatRoomMessagesForShow,
      (val) => val != null
    )
    // 之后滚动到底部
    await nextTick()
    // console.log(props.refScrollWarp)
    // console.log(props.refScrollWarp?.scrollHeight)
    // console.log(props.refScrollWarp?.scrollTop)
    props.refScrollWarp?.scrollTo({
      top: props.refScrollWarp.scrollHeight,
      // behavior: 'smooth', // 平滑滚动
    })
  })

  // 新增实时消息时，如果贴近底部，则滚到底部（平滑）
  watch(
    () => chatRoomMessagesRealtime.value.map((i) => i.id).toString(),
    async () => {
      if (props.refScrollWarp == null) {
        return
      }

      // 距底部的距离
      const distanceFromBottom =
        props.refScrollWarp.scrollHeight -
        props.refScrollWarp.clientHeight -
        props.refScrollWarp.scrollTop
      if (
        distanceFromBottom >
        chatRoomMessagesScrollRealtimeIsBottomDistanceConfig
      ) {
        // 大于10px，则算不贴近底部，直接返回
        return
      }

      // 等待渲染
      await nextTick()

      // 滚动
      props.refScrollWarp.scrollTo({
        top: props.refScrollWarp.scrollHeight,
        behavior: 'smooth', // 平滑滚动
      })
    }
  )

  /**
   * 处理聊天滚动（在消息变动前）
   * 收集滚动前的快照数据，用于后续滚动补偿计算。
   * 与 chatScrollAdjustPositionAfterMessageChange 结合使用
   */
  const chatScrollCaptureSnapshotBeforeMessageChange = () => {
    // 消息数据快照
    const messageListSnapshot = (() => {
      if (chatRoomMessagesForShow.value == null) {
        return null
      }
      return [...chatRoomMessagesForShow.value]
    })()

    // 消息元素高度信息
    const messageElementMetrics = (() => {
      if (chatRoomMessagesForShow.value == null) return null

      // 只收集前几十条消息的 DOM 元素高度（具体数量根据配置控制）
      const selector = chatRoomMessagesForShow.value
        .slice(0, chatRoomMessagesScrollCaptureElementNumberConfig)
        .map((msg) => `.chat-message-${msg.id}`)
        .join(', ')

      const elements = document.querySelectorAll<HTMLElement>(selector)
      const metrics: { id: string; offsetHeight: number }[] = []

      elements.forEach((el) => {
        const id = el.getAttribute('data-message-id') ?? ''
        const offsetHeight = el.offsetHeight
        metrics.push({ id, offsetHeight })
      })

      return metrics
    })()

    // // 当前滚动内容高度
    // const scrollHeightSnapshot = props.refScrollWarp?.scrollHeight ?? null

    return {
      messageListSnapshot,
      messageElementMetrics,
      // scrollHeightSnapshot,
    }
  }

  /**
   * 处理聊天滚动（在消息变动后）
   * 根据快照数据计算顶部新增消息的高度，并补偿滚动位置。
   * 与 chatScrollCaptureSnapshotBeforeMessageChange 结合使用
   */
  const chatScrollAdjustPositionAfterMessageChange = async (
    previousSnapshot: ReturnType<
      typeof chatScrollCaptureSnapshotBeforeMessageChange
    >
  ) => {
    const { messageListSnapshot, messageElementMetrics } = previousSnapshot
    // 所需数据没有值，直接返回
    if (
      chatRoomMessagesForShow.value == null ||
      messageListSnapshot == null ||
      messageElementMetrics == null ||
      chatRoomMessagesForShow.value.length === 0 ||
      messageListSnapshot.length === 0
    ) {
      console.error(
        `
      chatRoomMessagesForShow.value == null ||
      messageListSnapshot == null ||
      chatRoomMessagesForShow.value.length === 0 ||
      messageListSnapshot.length === 0
        `
      )
      return
    }
    /**
     * 判断消息数组顶部为增加还是减少（只有顶部的增减会影响滚动）
     * ```
     * 1 为增加
     * -1 为减少
     * 0 为不变
     * 存在无效值则返回null
     *
     * ```
     * 原理为，比较数组中第一个item的created，如果当前的更早（更小）则为增加
     */
    const isListTopAddOrReduce = compareDatesSafeWithNull(
      messageListSnapshot[0].created,
      chatRoomMessagesForShow.value[0].created
    )
    // 存在无效值，返回
    if (isListTopAddOrReduce == null) {
      console.error('isListTopAddOrReduce == null')
      return
    }
    // 消息数组顶部不变，无需处理滚动，返回
    if (isListTopAddOrReduce === 0) {
      console.log('isListTopAddOrReduce === 0')
      return
    }
    // 统计消息数据的变化
    const listTopDelta = (() => {
      if (isListTopAddOrReduce === 1) {
        // 消息数组顶部增加，统计增加的item.id
        // 储存变化的消息
        const itemDeltaList: typeof chatRoomMessagesForShow.value = []
        for (const item of chatRoomMessagesForShow.value) {
          // 消息id等于旧的数组中的第一个，即代表增加的消息已收集完毕
          if (item.id === messageListSnapshot[0].id) {
            break
          }
          // 收集变化的消息
          itemDeltaList.push(item)
        }
        return itemDeltaList
      } else {
        // isListTopAddOrReduce === -1
        // 消息数组顶部减少，统计减少的item.id
        // 储存变化的消息
        const itemDeltaList: typeof chatRoomMessagesForShow.value = []
        for (const item of messageListSnapshot) {
          // 消息id等于新的数组中的第一个，即代表减少的消息已收集完毕
          if (item.id === chatRoomMessagesForShow.value[0].id) {
            break
          }
          // 收集变化的消息
          itemDeltaList.push(item)
        }
        return itemDeltaList
      }
    })()

    await nextTick() // 等待 DOM 更新

    // 计算高度变化，将用于调整滚动
    const heightDeltaForScroll = (() => {
      if (isListTopAddOrReduce === 1) {
        // 消息数组顶部增加，统计增加的高度
        // dom查询消息元素
        const selector = listTopDelta
          .map((msg) => `.chat-message-${msg.id}`)
          .join(', ')
        const elements = document.querySelectorAll<HTMLElement>(selector)
        // 统计高度
        let height = 0
        elements.forEach((el) => (height += el.offsetHeight))
        return height
      } else {
        // isListTopAddOrReduce === -1
        // 消息数组顶部减少，统计减少的高度
        // 在 messageElementMetrics 找出对应的消息
        const elements = messageElementMetrics.filter(
          (elItem) =>
            listTopDelta.find((msgItem) => msgItem.id === elItem.id) != null
        )
        // 统计高度
        let height = 0
        elements.forEach((el) => (height += el.offsetHeight))
        return -height
      }
    })()

    // 滚动补偿：将滚动设置为 scrollTop与变化的高度的和
    props.refScrollWarp?.scrollTo({
      top: props.refScrollWarp.scrollTop + heightDeltaForScroll,
      // behavior: 'smooth', // 平滑滚动不适用与此
    })
  }
  return {
    chatScrollCaptureSnapshotBeforeMessageChange,
    chatScrollAdjustPositionAfterMessageChange,
  }
}
