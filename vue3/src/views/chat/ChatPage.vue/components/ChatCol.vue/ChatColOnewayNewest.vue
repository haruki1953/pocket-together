<script setup lang="ts">
import { generateRandomIntegerBetween, generateRandomKey } from '@/utils'
import {
  pbMessagesSendChatApi,
  type PMLRCApiParameters0DataPageParamNonNullable,
} from '@/api'
import {
  useChatDataProcessMessages,
  useChatScrollMessageChange,
  useChatScrollToShowMore,
  useChatShowLimitControl,
  useChatShowMoreOnTopOrBottom,
} from './composables'
import ChatColTemplateBase from './ChatColTemplateBase.vue'

const props = defineProps<{
  /** 滚动容器元素 */
  refScrollWarp?: HTMLDivElement
  twowayPositioningCursorData: PMLRCApiParameters0DataPageParamNonNullable | null
  twowayPositioningCursorDataSet: (
    data: PMLRCApiParameters0DataPageParamNonNullable | null
  ) => void
}>()
// 供封装的组件或组合式函数使用
export type PropsType = typeof props

/** 封装了聊天页的数据及其处理相关内容 */
const {
  // 聊天页消息 游标分页无限查询
  chatRoomMessagesInfiniteQuery,
  // 将分页数据处理为消息数组，反转（从旧到新）
  chatRoomMessagesList,
  // 从实时消息中，获取本房间的消息
  chatRoomMessagesRealtime,
  // 将 MessagesRealtime 和 MessagesList 融合
  chatRoomMessagesListAndRealtime,
} = useChatDataProcessMessages()
// 导出一些类型
export type ChatRoomMessagesInfiniteQueryType =
  typeof chatRoomMessagesInfiniteQuery
export type ChatRoomMessagesListType = typeof chatRoomMessagesList
export type ChatRoomMessagesItem = NonNullable<
  typeof chatRoomMessagesList.value
>[number]
export type ChatRoomMessagesRealtimeType = typeof chatRoomMessagesRealtime
export type ChatRoomMessagesListAndRealtimeType =
  typeof chatRoomMessagesListAndRealtime

/** 封装了聊天页消息显示数量限制控制相关的内容 */
const {
  // 限制消息显示数量，顶部游标与底部游标
  chatRoomMessagesLimitTopCursor,
  chatRoomMessagesLimitBottomCursor,
  // 已限制数量的消息列表
  chatRoomMessagesLimitList,
} = useChatShowLimitControl({
  //
  chatRoomMessagesListAndRealtime,
})
// 导出一些类型
export type ChatRoomMessagesLimitTopCursorType =
  typeof chatRoomMessagesLimitTopCursor
export type ChatRoomMessagesLimitBottomCursorType =
  typeof chatRoomMessagesLimitBottomCursor
export type ChatRoomMessagesLimitListType = typeof chatRoomMessagesLimitList

// 最终用于渲染的数据
const chatRoomMessagesForShow = computed(() => chatRoomMessagesLimitList.value)
export type ChatRoomMessagesForShowType = typeof chatRoomMessagesForShow

/** 封装了聊天页消息变动时的滚动处理 */
const {
  chatScrollCaptureSnapshotBeforeMessageChange,
  chatScrollAdjustPositionAfterMessageChange,
} = useChatScrollMessageChange({
  props,
  chatRoomMessagesForShow,
  chatRoomMessagesRealtime,
})
export type ChatScrollCaptureSnapshotBeforeMessageChangeType =
  typeof chatScrollCaptureSnapshotBeforeMessageChange
export type ChatScrollAdjustPositionAfterMessageChangeType =
  typeof chatScrollAdjustPositionAfterMessageChange

/** 封装了在聊天顶部或底部显示更多的函数，加载更多，控制显示限制 */
const {
  // 聊天顶部加载更多
  chatShowMoreOnTop,
  // 聊天底部加载更多
  chatShowMoreOnBottom,
  // 是否正在加载更多
  isShowMoreRunning,
  // 聊天顶部是否有未显示的
  isChatTopHasMore,
  // 聊天底部是否有未显示的
  isChatBottomHasMore,
} = useChatShowMoreOnTopOrBottom({
  chatRoomMessagesListAndRealtime,
  chatRoomMessagesLimitList,
  chatRoomMessagesInfiniteQuery,
  chatRoomMessagesLimitTopCursor,
  chatRoomMessagesLimitBottomCursor,
  chatScrollCaptureSnapshotBeforeMessageChange,
  chatScrollAdjustPositionAfterMessageChange,
})

/** 封装了聊天页滚动触发在顶部或底部显示更多的功能 */
useChatScrollToShowMore({
  props,
  chatShowMoreOnTop,
  chatShowMoreOnBottom,
})

// 测试批量添加消息
const testPbSend = async () => {
  const randomInteger = generateRandomIntegerBetween(1, 10)
  for (let i = 0; i < randomInteger; i++) {
    await pbMessagesSendChatApi({
      content: generateRandomKey(
        generateRandomIntegerBetween(5, generateRandomIntegerBetween(20, 200))
      ),
    })
  }
}

// './ChatColTemplateBase.vue'
// export type OpenMessageInfoDialogType = typeof openMessageInfoDialog;
// export type { OpenMessageInfoDialogType }
</script>

<template>
  <div>
    <!-- ChatCol的主要渲染内容，达到将逻辑和内容分离的效果 -->
    <ChatColTemplateBase
      :isChatTopHasMore="isChatTopHasMore"
      :isShowMoreRunning="isShowMoreRunning"
      :chatShowMoreOnTop="chatShowMoreOnTop"
      :chatRoomMessagesForShow="chatRoomMessagesForShow"
      :isChatBottomHasMore="isChatBottomHasMore"
      :chatShowMoreOnBottom="chatShowMoreOnBottom"
    ></ChatColTemplateBase>
  </div>
</template>

<style lang="scss" scoped></style>
