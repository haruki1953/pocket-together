<script setup lang="ts">
// import ChatColOnewayNewest from './ChatColOnewayNewest.vue'
import type { PMLRCApiParameters0DataPageParamNonNullable } from '@/api'
import ChatColTwowayPositioningCursor from './ChatColTwowayPositioningCursor.vue'

const props = defineProps<{
  /** 滚动容器元素 */
  refScrollWarp?: HTMLElement
  /** 是否能返回，控制聊天顶栏的返回按钮是否显示 */
  couldGoBack: boolean
}>()
</script>

<template>
  <div>
    <!-- <ChatColOnewayNewest :refScrollWarp="refScrollWarp"></ChatColOnewayNewest> -->
    <ChatColTwowayPositioningCursor
      :refScrollWarp="refScrollWarp"
      :couldGoBack="couldGoBack"
    ></ChatColTwowayPositioningCursor>
  </div>
</template>

<style lang="scss" scoped></style>
