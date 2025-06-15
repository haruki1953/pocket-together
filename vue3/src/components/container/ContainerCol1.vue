<script setup lang="ts">
// 单列容器，可设置宽度，通过tailwind类控制样式

// 将默认值独立出来是因为这样才能有tailwind提示
// 默认居中
const defaultColContainerTwcss = 'justify-center'
// 默认全宽度
const defaultCol1Twcss = 'flex-1'
withDefaults(
  defineProps<{
    colContainerTwcss: string
    col1Twcss: string
  }>(),
  {
    colContainerTwcss: defaultColContainerTwcss,
    col1Twcss: defaultCol1Twcss,
  }
)
</script>

<template>
  <div class="container-col1">
    <div class="flex" :class="colContainerTwcss">
      <div :class="col1Twcss">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
