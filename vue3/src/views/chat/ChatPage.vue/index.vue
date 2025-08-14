<script setup lang="ts">
import { useI18nStore } from '@/stores'
import ChatInputBar from './components/ChatInputBar.vue'

const i18nStore = useI18nStore()
useSeoMeta({
  title: computed(() => i18nStore.t('pageChat')()),
})
</script>

<template>
  <div class="chat-page">
    <div class="container-col2-box">
      <ContainerCol2
        col1Position="right"
        col1Twcss="flex-1"
        col2Twcss="w-[500px]"
      >
        <template #col1>
          <div class="my-6 ml-2">
            <div>用户列表</div>
            <div class="h-[2000px] bg-red-950"></div>
            <div>用户列表</div>
          </div>
        </template>
        <template #col2>
          <div>
            <ContainerBar>
              <template #default>
                <div class="mb-1 ml-6 mr-4 mt-6">
                  <div>聊天栏</div>
                  <div class="h-[2000px] bg-red-950"></div>
                  <div>聊天栏聊天栏聊天栏聊天栏聊天栏</div>
                </div>
              </template>
              <template #bar>
                <div class="ml-6 mr-4 flow-root">
                  <ChatInputBar></ChatInputBar>
                </div>
              </template>
            </ContainerBar>
          </div>
        </template>
      </ContainerCol2>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container-col2-box {
  :deep() {
    .slot-col2-with-el-scrollbar {
      .el-scrollbar__wrap {
        // 防止目标区域中的滚动触发父元素中的滚动
        overscroll-behavior: contain;
      }
    }
  }
}
</style>
