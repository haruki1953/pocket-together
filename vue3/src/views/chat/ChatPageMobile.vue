<script setup lang="ts">
import { layoutChatPageConfig } from '@/config'
import ChatCol from './ChatPage.vue/components/ChatCol.vue'

const htmlRef = ref<HTMLElement | null>(null)
onMounted(() => {
  htmlRef.value = document.documentElement
})

// const htmlRef = ref<HTMLElement | null>(null)
// htmlRef.value = document.documentElement
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
        :refScrollWarp="htmlRef ?? undefined"
        :couldGoBack="true"
      ></ChatCol>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
