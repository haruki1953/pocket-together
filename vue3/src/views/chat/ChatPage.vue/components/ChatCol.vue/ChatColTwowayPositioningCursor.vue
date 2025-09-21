<script setup lang="ts">
import type { PMLRCApiParameters0DataPageParamNonNullable } from '@/api'
import {
  useChatDataProcessMessagesTwoway,
  useChatScrollMessageChangeTwoway,
  useChatScrollToShowMore,
  useChatShowLimitControlTwoway,
  useChatShowMoreOnTopOrBottomTwoway,
} from './composables'
import ChatColTemplateBase from './ChatColTemplateBase.vue'
import { useRoute, useRouter } from 'vue-router'
import { chatRoomMessagesTwowayPositioningCursorRouterQueryParametersKeyConfig } from '@/config'

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

// 根据路由查询参数定位消息
const route = useRoute()
const routeQueryPositioningCursorData = (() => {
  const { id: keyId, created: keyCreated } =
    chatRoomMessagesTwowayPositioningCursorRouterQueryParametersKeyConfig
  const id = route.query[keyId]
  const created = route.query[keyCreated]
  if (
    id == null ||
    created == null ||
    typeof id !== 'string' ||
    typeof created !== 'string'
  ) {
    return null
  }
  return {
    id,
    created,
  }
})()
// 清除路由中的查询参数
const router = useRouter()
router.replace(route.path)

// 设置路由定位数据
if (routeQueryPositioningCursorData != null) {
  twowayPositioningCursorData.value = routeQueryPositioningCursorData
}

// 链接定位标记，如果消息id等于此，将显示链接标记
const linkPositioningFlagMessageId = ref<string | null>(null)
// 控制链接标记是否显示，消息被点击会使其不显示
const linkPositioningFlagShow = ref(false)
const linkPositioningFlagClose = () => {
  linkPositioningFlagShow.value = false
}
if (routeQueryPositioningCursorData != null) {
  linkPositioningFlagMessageId.value = routeQueryPositioningCursorData.id
  linkPositioningFlagShow.value = true
}

// // 测试定位
// twowayPositioningCursorData.value = {
//   id: 'bnjqt5mbyk35gsd',
//   created: '2025-09-01 10:46:42.872Z',
// }

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
} = useChatShowMoreOnTopOrBottomTwoway({
  chatRoomMessagesListAndRealtime,
  chatRoomMessagesLimitList,
  chatRoomMessagesInfiniteTwowayQuery,
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
      :linkPositioningFlagMessageId="linkPositioningFlagMessageId"
      :linkPositioningFlagShow="linkPositioningFlagShow"
      :linkPositioningFlagClose="linkPositioningFlagClose"
    ></ChatColTemplateBase>
  </div>
</template>

<style lang="scss" scoped></style>
