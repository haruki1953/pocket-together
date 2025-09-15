<script setup lang="ts">
import type { PMLRCApiParameters0DataPageParamNonNullable } from '@/api'
import { useChatDataProcessMessagesTwoway } from './composables'

const props = defineProps<{
  /** 滚动容器元素 */
  refScrollWarp?: HTMLDivElement
}>()

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
