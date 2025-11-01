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

  // 当前消息是否应更新
  const isCurrentMessageShouldUpdateRealtimeUpdated = computed(() => {
    const length = messageRealtimeUpdateItems.value.length
    // 无实时更新，返回false
    if (length === 0) {
      return false
    }
    // 有实时更新且当前currentMessageRealtimeUpdated为null，返回true
    if (currentMessageRealtimeUpdated.value == null) {
      return true
    }
    const latest = messageRealtimeUpdateItems.value[length - 1]
    // 当前currentMessageRealtimeUpdated不等与最新的，返回true
    if (latest.updated !== currentMessageRealtimeUpdated.value) {
      return true
    }
    return false
  })

  // 更新当前消息
  const updateCurrentMessageRealtimeUpdated = () => {
    const length = messageRealtimeUpdateItems.value.length
    // 无实时更新，返回false
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
  }
}
