<script setup lang="ts">
import { useI18nStore } from '@/stores'

/** 聊天页顶栏菜单的菜单项 */
const props = withDefaults(
  defineProps<{
    /** 是否运行中 控制鼠标光标及文字样式 */
    isRunning?: boolean
    /** 是否可以运行（可点击） 控制鼠标光标及文字样式 */
    isRunnable?: boolean
  }>(),
  {
    isRunnable: true,
    isRunning: false,
  }
)

// 控制鼠标光标及文字样式
const moreMenuItemStyleClass = computed(() => {
  // 加载中
  if (props.isRunning === true) {
    const cursorTwcss = 'cursor-default'
    const textTwcss = 'text-color-text-soft'
    return {
      cursorTwcss,
      textTwcss,
    }
  }
  // 不可进行
  if (props.isRunnable === false) {
    const cursorTwcss = 'cursor-not-allowed'
    const textTwcss = 'text-color-text-soft'
    return {
      cursorTwcss,
      textTwcss,
    }
  }
  // 可点击
  const cursorTwcss = 'cursor-pointer hover:bg-el-primary-light-4'
  const textTwcss = 'text-color-text'
  return {
    cursorTwcss,
    textTwcss,
  }
})
</script>

<template>
  <div
    class="flow-root select-none"
    :class="moreMenuItemStyleClass.cursorTwcss"
  >
    <div
      class="mx-[15px] my-[6px] flex items-center"
      :class="moreMenuItemStyleClass.textTwcss"
    >
      <div class="mr-[8px]">
        <slot name="icon"></slot>
      </div>
      <div class="wrap-long-text text-[14px] font-bold">
        <slot name="text"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
