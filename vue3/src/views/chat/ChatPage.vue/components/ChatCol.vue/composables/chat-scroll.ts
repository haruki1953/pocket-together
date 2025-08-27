import type { ChatRoomMessagesListType, PropsType } from './dependencies'

/** 封装了聊天页消息变动时的滚动处理 */
export const useChatScrollMessageChange = (data: {
  chatRoomMessagesList: ChatRoomMessagesListType
  props: PropsType
}) => {
  const { props, chatRoomMessagesList } = data

  /**
   * 处理聊天滚动（在消息变动前）
   * 收集滚动前的快照数据，用于后续滚动补偿计算。
   * 与 chatScrollAdjustPositionAfterMessageChange 结合使用
   */
  const chatScrollCaptureSnapshotBeforeMessageChange = () => {
    // 消息数据快照
    const messageListSnapshot = (() => {
      if (chatRoomMessagesList.value == null) {
        return null
      }
      return [...chatRoomMessagesList.value]
    })()

    // 消息元素高度信息
    const messageElementMetrics = (() => {
      if (chatRoomMessagesList.value == null) return null

      // 只收集前60条消息的 DOM 元素高度（之后记得要将配置封装）
      const selector = chatRoomMessagesList.value
        .slice(0, 60)
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

    // 当前滚动内容高度
    const scrollHeightSnapshot = props.refScrollWarp?.scrollHeight ?? null

    return {
      messageListSnapshot,
      messageElementMetrics,
      scrollHeightSnapshot,
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
    const { messageListSnapshot, scrollHeightSnapshot: beforeScrollHeight } =
      previousSnapshot

    await nextTick() // 等待 DOM 更新

    const afterScrollHeight = props.refScrollWarp?.scrollHeight ?? null

    if (beforeScrollHeight == null || afterScrollHeight == null) {
      console.error('Scroll height snapshot is missing')
      return
    }

    // 暂时先用ScrollHeight计算，这不准，以后会用统计的消息高度计算
    const heightDelta = afterScrollHeight - beforeScrollHeight

    if (heightDelta <= 0) {
      console.warn('Height delta is non-positive, skipping scroll adjustment')
      return
    }

    // 滚动补偿：将 scrollTop 增加新增高度
    props.refScrollWarp?.scrollTo({
      top: props.refScrollWarp.scrollTop + heightDelta,
      // behavior: 'smooth', // 平滑滚动不适用与此
    })
  }
  return {
    chatScrollCaptureSnapshotBeforeMessageChange,
    chatScrollAdjustPositionAfterMessageChange,
  }
}
