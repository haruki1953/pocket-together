import { useRealtimeMessagesStore } from '@/stores'
import type { ChatMessagePropsType } from './dependencies'

// 消息的实时更新逻辑
export const useMessageRealtimeUpdate = (data: {
  props: ChatMessagePropsType
}) => {
  const { props } = data

  // 实时消息，将根据其中的更新和删除
  const realtimeMessagesStore = useRealtimeMessagesStore()
  // 本消息的更新统计
  const messageRealtimeUpdateItems = computed(() => {
    const filter = realtimeMessagesStore.updateList.filter(
      (i) => i.id === props.chatRoomMessagesItem.id
    )
    return filter
  })

  // 根据此值对应messageRealtimeUpdateItems之中每一项的updated，控制其中显示哪个，null即为原消息chatRoomMessagesItem
  const currentMessageRealtimeUpdated = ref<string | null>(null)

  // 当前应显示的消息
  const currentMessageData = computed(() => {
    if (currentMessageRealtimeUpdated.value == null) {
      return props.chatRoomMessagesItem
    }
    const find = messageRealtimeUpdateItems.value.find(
      (i) => i.updated === currentMessageRealtimeUpdated.value
    )
    if (find == null) {
      return props.chatRoomMessagesItem
    }
    return find
  })

  // 当前消息是否已删除
  const isCurrentMessageRealtimeUpdatedIsDeleted = computed(() => {
    const length = messageRealtimeUpdateItems.value.length
    // 无实时更新，返回false
    if (length === 0) {
      return false
    }

    // 得到最后的更新
    const latest = messageRealtimeUpdateItems.value[length - 1]
    if (latest.isDeleted === true) {
      return true
    }
    return false
  })

  // 当前消息是否应更新
  const isCurrentMessageShouldUpdateRealtimeUpdated = computed(() => {
    // 已删除，返回false
    if (isCurrentMessageRealtimeUpdatedIsDeleted.value) {
      return false
    }

    const length = messageRealtimeUpdateItems.value.length
    // 无实时更新，返回false
    if (length === 0) {
      return false
    }

    // 得到最后的更新
    const latest = messageRealtimeUpdateItems.value[length - 1]
    // 当前currentMessageRealtimeUpdated不等与最新的，返回true
    // 最后的更新的消息的updated 大于 当前消息的updated，返回true
    if (latest.updated > currentMessageData.value.updated) {
      return true
    }
    // 否则返回false
    return false
  })

  // 更新当前消息
  const updateCurrentMessageRealtimeUpdated = () => {
    if (isCurrentMessageShouldUpdateRealtimeUpdated.value === false) {
      return
    }

    const length = messageRealtimeUpdateItems.value.length
    // 无实时更新
    if (length === 0) {
      return
    }
    const latest = messageRealtimeUpdateItems.value[length - 1]
    currentMessageRealtimeUpdated.value = latest.updated
  }
  // 组件setup时就执行一次，类似初始化
  updateCurrentMessageRealtimeUpdated()

  return {
    updateCurrentMessageRealtimeUpdated,
    isCurrentMessageShouldUpdateRealtimeUpdated,
    currentMessageData,
    isCurrentMessageRealtimeUpdatedIsDeleted,
  }
}
