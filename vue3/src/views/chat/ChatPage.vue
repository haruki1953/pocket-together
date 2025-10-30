<script setup lang="ts">
import { useI18nStore } from '@/stores'
import { useWindowSize } from '@vueuse/core'
import {
  chatRoomMessagesTwowayPositioningCursorRouterQueryParametersKeyConfig,
  layoutChatPageConfig,
  routerDict,
} from '@/config'
import { ChatCol, ChatTopBarMoreMenuItem } from '@/components'
import type { GlobalComponents } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ContainerCol2 } from '@/components'
import { generateRandomIntegerBetween, generateRandomKey } from '@/utils'
import { pbMessagesSendChatApi } from '@/api'
import { RiFlaskLine } from '@remixicon/vue'
import { injectAppMainElScrollbar } from '@/composables'

console.log('ChatPage setup')

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
/** 窗口宽度大于1024时聊天栏宽度较大，小于则聊天栏宽度较小 */
const showChatWidthLargerTrueWidthSmallerFalse = computed(() => {
  if (
    windowWidth.value >=
    layoutChatPageConfig.breakpointChatWidthLargerToWidthSmaller
  ) {
    return true
  }
  return false
})
// ContainerCol2 参数 col2StyleValue 控制样式
const col2StyleValue = computed(() => {
  const { chatWidthLargerWidth, chatWidthSmallerWidth } = layoutChatPageConfig
  /** 窗口宽度大于1024时聊天栏宽度较大，小于则聊天栏宽度较小 */
  if (showChatWidthLargerTrueWidthSmallerFalse.value) {
    return {
      width: `${chatWidthLargerWidth}px`,
    }
  }
  return {
    width: `${chatWidthSmallerWidth}px`,
  }
})

const refContainerCol2 = ref<InstanceType<typeof ContainerCol2> | null>(null)

const route = useRoute()
const router = useRouter()

router.replace({
  path: route.path,
  query: {
    test: '测试',
  },
})

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

// 测试批量添加消息
const testPbSendMessage = async () => {
  // const sendNum = generateRandomIntegerBetween(1, 10)
  const sendNum = 100
  for (let i = 0; i < sendNum; i++) {
    await pbMessagesSendChatApi({
      content: generateRandomKey(
        generateRandomIntegerBetween(5, generateRandomIntegerBetween(20, 200))
      ),
      roomId: '',
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
        :col2StyleValue="col2StyleValue"
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
              roomId=""
            >
              <template #chatTopBarMoreMenu>
                <!-- 测试批量添加消息 -->
                <ChatTopBarMoreMenuItem @click="testPbSendMessage">
                  <template #icon>
                    <RiFlaskLine size="18px"></RiFlaskLine>
                  </template>
                  <template #text> 测试批量添加消息 </template>
                </ChatTopBarMoreMenuItem>
              </template>
            </ChatCol>
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
