<script setup lang="ts">
import type { PMLRCApiParameters0DataPageParamNonNullable } from '@/api'
import {
  useChatDataProcessMessagesTwoway,
  useChatScrollMessageChangeTwoway,
  useChatShowLimitControlTwoway,
} from './composables'

const props = defineProps<{
  /** 滚动容器元素 */
  refScrollWarp?: HTMLDivElement
}>()
// 供封装的组件或组合式函数使用
export type PropsType = typeof props

/**
 * 双向定位无限查询的定位游标数据
 */
const twowayPositioningCursorData =
  ref<PMLRCApiParameters0DataPageParamNonNullable | null>(null)
export type TwowayPositioningCursorDataType = typeof twowayPositioningCursorData

/** 封装了聊天页的数据及其处理相关内容 */
const {
  // 聊天页消息 游标分页无限查询
  chatRoomMessagesInfiniteTwowayQuery,
  // 将分页数据处理为消息数组，反转（从旧到新）
  chatRoomMessagesList,
  // 从实时消息中，获取本房间的消息
  chatRoomMessagesRealtime,
  // 将 MessagesRealtime 和 MessagesList 融合
  chatRoomMessagesListAndRealtime,
} = useChatDataProcessMessagesTwoway({
  twowayPositioningCursorData,
})
export type ChatRoomMessagesInfiniteTwowayQueryType =
  typeof chatRoomMessagesInfiniteTwowayQuery
// 导出一些类型
export type ChatRoomMessagesListType = typeof chatRoomMessagesList
export type ChatRoomMessagesItem = NonNullable<
  typeof chatRoomMessagesList.value
>[number]
export type ChatRoomMessagesRealtimeType = typeof chatRoomMessagesRealtime
export type ChatRoomMessagesListAndRealtimeType =
  typeof chatRoomMessagesListAndRealtime

/** 封装了聊天页消息显示数量限制控制相关的内容 */
const {
  chatRoomMessagesLimitTopCursor,
  chatRoomMessagesLimitBottomCursor,
  chatRoomMessagesLimitList,
} = useChatShowLimitControlTwoway({
  chatRoomMessagesListAndRealtime,
  twowayPositioningCursorData,
  chatRoomMessagesInfiniteTwowayQuery,
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
} = useChatScrollMessageChangeTwoway({
  props,
  chatRoomMessagesForShow,
  chatRoomMessagesRealtime,
  chatRoomMessagesLimitBottomCursor,
  twowayPositioningCursorData,
})
export type ChatScrollCaptureSnapshotBeforeMessageChangeType =
  typeof chatScrollCaptureSnapshotBeforeMessageChange
export type ChatScrollAdjustPositionAfterMessageChangeType =
  typeof chatScrollAdjustPositionAfterMessageChange

// TODO
</script>

<template>
  <div>
    <!-- ChatCol的主要渲染内容，达到将逻辑和内容分离的效果 -->
    <!-- <ChatColTemplateBase
      :isChatTopHasMore="isChatTopHasMore"
      :isShowMoreRunning="isShowMoreRunning"
      :chatShowMoreOnTop="chatShowMoreOnTop"
      :chatRoomMessagesForShow="chatRoomMessagesForShow"
      :isChatBottomHasMore="isChatBottomHasMore"
      :chatShowMoreOnBottom="chatShowMoreOnBottom"
    ></ChatColTemplateBase> -->
  </div>
</template>

<style lang="scss" scoped></style>
