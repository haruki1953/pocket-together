<script setup lang="ts">
import { layoutChatPageConfig } from '@/config'
import { ChatCol } from '@/components'
import { injectAppMainElScrollbar } from '@/composables'

// inject获取应用主滚动实例
const appMainElScrollbar = injectAppMainElScrollbar()
</script>

<template>
  <div class="mx-[8px]">
    <div
      class="mx-auto"
      :style="{
        maxWidth: `${layoutChatPageConfig.chatPageMobileMaxWidth}px`,
      }"
    >
      <ChatCol
        :refScrollWarp="appMainElScrollbar?.wrapRef"
        :couldGoBack="true"
        roomId=""
      ></ChatCol>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
