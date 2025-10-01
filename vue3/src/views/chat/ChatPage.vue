<script setup lang="ts">
import { useI18nStore } from '@/stores'
import { useWindowSize } from '@vueuse/core'
import {
  chatRoomMessagesTwowayPositioningCursorRouterQueryParametersKeyConfig,
  layoutChatPageConfig,
  routerDict,
} from '@/config'
import { ChatCol } from './components'
import type { GlobalComponents } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ContainerCol2 } from '@/components'

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

const refContainerCol2 = ref<InstanceType<typeof ContainerCol2> | null>(null)

const route = useRoute()
const router = useRouter()
// 如果当前为小屏，但有路由消息参数（消息定位），则跳转到ChatPageMobile
if (showCol2TrueCol1False.value === false) {
  // 聊天页 双向定位游标 路由查询参数 键统一管理，以便在多处使用
  const { id: keyId, created: keyCreated } =
    chatRoomMessagesTwowayPositioningCursorRouterQueryParametersKeyConfig

  // 路由消息参数（消息定位）
  const routeQueryPositioningCursorData = (() => {
    const id = route.query[keyId]
    const created = route.query[keyCreated]
    if (
      id == null ||
      created == null ||
      typeof id !== 'string' ||
      typeof created !== 'string'
    ) {
      return null
    }
    return {
      id,
      created,
    }
  })()

  // 存在路由消息参数
  if (routeQueryPositioningCursorData != null) {
    // replace到ChatPageMobile，要带定位参数
    router.replace({
      path: routerDict.ChatPageMobile.path,
      query: {
        [keyId]: routeQueryPositioningCursorData.id,
        [keyCreated]: routeQueryPositioningCursorData.created,
      },
    })
  }
}
</script>

<template>
  <div class="chat-page">
    <div v-if="showCol2TrueCol1False" class="container-col2-box">
      <!-- <div v-if="true" class="container-col2-box"> -->
      <ContainerCol2
        ref="refContainerCol2"
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
          <div class="ml-6 mr-4">
            <ChatCol
              :refScrollWarp="refContainerCol2?.refElScrollbar?.wrapRef"
              :couldGoBack="false"
            ></ChatCol>
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
            <!-- <div>小屏全局聊天页跳转</div> -->
            <div>
              <ElButton :tag="RouterLink" :to="routerDict.ChatPageMobile.path">
                跳转移动端全局聊天页（待完善）
              </ElButton>
            </div>
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
        /* 禁用滚动锚定，避免影响自己主动地滚动控制逻辑 */
        overflow-anchor: none;
      }
    }
  }
}
</style>
