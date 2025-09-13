<script setup lang="ts">
import ChatColOnewayNewest from './ChatColOnewayNewest.vue'

const props = defineProps<{
  /** 滚动容器元素 */
  refScrollWarp?: HTMLDivElement
}>()
</script>

<template>
  <div>
    <ChatColOnewayNewest :refScrollWarp="refScrollWarp"></ChatColOnewayNewest>
  </div>
</template>

<style lang="scss" scoped></style>
