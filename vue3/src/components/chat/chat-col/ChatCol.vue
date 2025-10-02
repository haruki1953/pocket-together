<script setup lang="ts">
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
    <ChatColTwowayPositioningCursor
      :refScrollWarp="refScrollWarp"
      :couldGoBack="couldGoBack"
    >
      <template #chatTopBarMoreMenu>
        <!-- 聊天顶栏菜单项 插槽 -->
        <slot name="chatTopBarMoreMenu"></slot>
      </template>
    </ChatColTwowayPositioningCursor>
  </div>
</template>

<style lang="scss" scoped></style>
