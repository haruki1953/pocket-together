<script setup lang="ts">
import ChatColOnewayNewest from './ChatColOnewayNewest.vue'
import type { PMLRCApiParameters0DataPageParamNonNullable } from '@/api'
import ChatColTwowayPositioningCursor from './ChatColTwowayPositioningCursor.vue'

const props = defineProps<{
  /** 滚动容器元素 */
  refScrollWarp?: HTMLDivElement
}>()
</script>

<template>
  <div>
    <!-- <ChatColOnewayNewest :refScrollWarp="refScrollWarp"></ChatColOnewayNewest> -->
    <ChatColTwowayPositioningCursor
      :refScrollWarp="refScrollWarp"
    ></ChatColTwowayPositioningCursor>
  </div>
</template>

<style lang="scss" scoped></style>
