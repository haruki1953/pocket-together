<script setup lang="ts">
import type { PMLRCApiParameters0DataPageParamNonNullable } from '@/api'

const props = defineProps<{
  /** 滚动容器元素 */
  refScrollWarp?: HTMLDivElement
  /** 双向定位无限查询的定位游标数据 */
  twowayPositioningCursorData: PMLRCApiParameters0DataPageParamNonNullable | null
  twowayPositioningCursorDataSet: (
    data: PMLRCApiParameters0DataPageParamNonNullable | null
  ) => void
}>()

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
