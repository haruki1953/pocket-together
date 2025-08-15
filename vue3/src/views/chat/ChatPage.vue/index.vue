<script setup lang="ts">
import { useI18nStore } from '@/stores'
import ChatInputBar from './components/ChatInputBar.vue'
import { useWindowSize } from '@vueuse/core'
import { layoutChatPageConfig } from '@/config'

const i18nStore = useI18nStore()
useSeoMeta({
  title: computed(() => i18nStore.t('pageChat')()),
})

const { width: windowWidth } = useWindowSize()
/** 大于等于768显示两列，小于则显示一列（只显示用户列表，聊天在另外的页面） */
const showCol2TrueCol1False = computed(() => {
  if (windowWidth.value >= layoutChatPageConfig.breakpointCol2ToCol1) {
    return true
  }
  return false
})
/** 大于1024时聊天栏宽度为500，小于则为400 */
const showChatWidth5TrueWidth4False = computed(() => {
  if (windowWidth.value >= layoutChatPageConfig.breakpointChatWidth5ToWidth4) {
    return true
  }
  return false
})
</script>

<template>
  <div class="chat-page">
    <div v-if="showCol2TrueCol1False" class="container-col2-box">
      <ContainerCol2
        col1Position="right"
        col1Twcss="flex-1"
        :col2Twcss="
          (() => {
            /** 大于1024时聊天栏宽度为500，小于则为400 */
            if (showChatWidth5TrueWidth4False) {
              return 'w-[500px]'
            }
            return 'w-[400px]'
          })()
        "
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
    <div v-else class="container-col1-box">
      <div class="mx-2 mt-6">
        <div
          class="mx-auto"
          :style="{
            maxWidth: `${layoutChatPageConfig.contentMaxWidthOnNavBottom}px`,
          }"
        >
          <div>
            <div>小屏全局聊天页跳转</div>
            <div>用户列表</div>
            <div class="h-[2000px] bg-red-950"></div>
            <div>用户列表</div>
          </div>
        </div>
      </div>
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
