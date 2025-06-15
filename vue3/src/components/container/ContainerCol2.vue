<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

// 双列容器，通过tailwind类控制样式

// 将默认值独立出来是因为这样才能有tailwind提示
// 默认居中
const defaultColContainerTwcss = 'justify-center'
// 默认一样宽
const defaultCol1Twcss = 'flex-1'
const defaultCol2Twcss = 'flex-1'
withDefaults(
  defineProps<{
    colContainerTwcss?: string
    col1Twcss?: string
    col2Twcss?: string
    // col1 的位置，col1使用的是原生滚动条，col2是el滚动条
    col1Position?: 'left' | 'right'
  }>(),
  {
    colContainerTwcss: defaultColContainerTwcss,
    col1Twcss: defaultCol1Twcss,
    col2Twcss: defaultCol2Twcss,
    col1Position: 'right',
  }
)

const windowSize = useWindowSize()
</script>

<template>
  <div class="container-col2">
    <div class="flex" :class="colContainerTwcss">
      <div v-if="col1Position === 'left'" :class="col1Twcss">
        <slot name="col1"></slot>
      </div>
      <div :class="col2Twcss">
        <div class="sticky top-0 h-screen">
          <ElScrollbar :height="windowSize.height.value">
            <slot name="col2"></slot>
          </ElScrollbar>
        </div>
      </div>
      <div v-if="col1Position === 'right'" :class="col1Twcss">
        <slot name="col1"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
