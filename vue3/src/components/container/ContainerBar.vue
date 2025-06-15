<script setup lang="ts">
/**
 * 底栏
 */
import { useElementSize, useWindowSize } from '@vueuse/core'

const { height: windowHeight } = useWindowSize()
const refBarBottom = ref<HTMLElement | null>(null)
const { height: bottomHeight } = useElementSize(refBarBottom)
</script>

<template>
  <div class="container-bar">
    <div
      :style="{
        'min-height': `${windowHeight - bottomHeight}px`,
      }"
    >
      <slot></slot>
    </div>
    <div ref="refBarBottom" class="sticky bottom-0">
      <slot name="bar"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
