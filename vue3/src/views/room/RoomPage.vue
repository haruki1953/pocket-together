<script setup lang="ts">
import { ChatCol, ChatTopBarMoreMenuItem, ContainerCol2 } from '@/components'
import { layoutRoomPageConfig, routerDict } from '@/config'
import { useI18nStore } from '@/stores'
import { RiHomeLine, RiMessage3Line } from '@remixicon/vue'
import { useWindowSize } from '@vueuse/core'

const { width: windowWidth } = useWindowSize()

/** 大于等于768显示两列，小于则显示一列（只显示用户列表，聊天在另外的页面） */
const showCol2TrueCol1False = computed(() => {
  if (windowWidth.value >= layoutRoomPageConfig.breakpointCol2ToCol1) {
    return true
  }
  return false
})

/** 窗口宽度大于1024时聊天栏宽度较大，小于则聊天栏宽度较小 */
const showChatWidthLargerTrueWidthSmallerFalse = computed(() => {
  if (
    windowWidth.value >=
    layoutRoomPageConfig.breakpointChatWidthLargerToWidthSmaller
  ) {
    return true
  }
  return false
})
// ContainerCol1 参数 col2StyleValue 控制样式
const col1StyleValue = computed(() => {
  const { chatWidthLargerWidth, chatWidthSmallerWidth } = layoutRoomPageConfig
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

// document.documentElement html标签 即原生滚动容器，将传入ChatCol
const htmlRef = ref<HTMLElement | null>(null)
onMounted(() => {
  htmlRef.value = document.documentElement
})

const i18nStore = useI18nStore()
</script>

<template>
  <div class="room-page">
    <!-- 大屏 双列 -->
    <div v-if="showCol2TrueCol1False">
      <ContainerCol2
        ref="refContainerCol2"
        col1Position="right"
        :col1StyleValue="col1StyleValue"
        col2Twcss="flex-1"
      >
        <!-- 聊天列 -->
        <template #col1>
          <div class="ml-2 mr-6">
            <ChatCol :refScrollWarp="htmlRef ?? undefined" :couldGoBack="true">
              <template #chatTopBarMoreMenu>
                <!-- 返回首页 -->
                <ChatTopBarMoreMenuItem
                  @click="
                    $router.push({
                      name: routerDict.HomePage.name,
                    })
                  "
                >
                  <template #icon>
                    <RiHomeLine size="18px"></RiHomeLine>
                  </template>
                  <!-- 房间详情 -->
                  <template #text>
                    {{ i18nStore.t('roomChatTopBarMoreMenuBackHomeText')() }}
                  </template>
                </ChatTopBarMoreMenuItem>
              </template>
            </ChatCol>
          </div>
        </template>
        <!-- 房间详情列 -->
        <template #col2>
          <div class="my-6 ml-6 mr-4">
            <div>房间详情</div>
            <div class="h-[2000px] bg-red-950"></div>
            <div>房间详情</div>
          </div>
        </template>
      </ContainerCol2>
    </div>
    <!-- 小屏 单列 -->
    <div v-else>
      <div class="mx-[8px]">
        <div
          class="mx-auto"
          :style="{
            maxWidth: `${layoutRoomPageConfig.chatPageMobileMaxWidth}px`,
          }"
        >
          <ChatCol :refScrollWarp="htmlRef ?? undefined" :couldGoBack="true">
            <template #chatTopBarMoreMenu>
              <!-- 房间详情 -->
              <ChatTopBarMoreMenuItem
                @click="
                  $router.push({
                    name: routerDict.RoomInfoPage.name,
                    params: {
                      [routerDict.RoomInfoPage.paramsKey.title]:
                        $route.params[routerDict.RoomPage.paramsKey.title],
                      [routerDict.RoomInfoPage.paramsKey.id]:
                        $route.params[routerDict.RoomPage.paramsKey.id],
                    },
                  })
                "
              >
                <template #icon>
                  <RiMessage3Line size="18px"></RiMessage3Line>
                </template>
                <template #text>
                  {{ i18nStore.t('roomChatTopBarMoreMenuRoomInfoText')() }}
                </template>
              </ChatTopBarMoreMenuItem>
              <!-- 返回首页 -->
              <ChatTopBarMoreMenuItem
                @click="
                  $router.push({
                    name: routerDict.HomePage.name,
                  })
                "
              >
                <template #icon>
                  <RiHomeLine size="18px"></RiHomeLine>
                </template>
                <!-- 房间详情 -->
                <template #text>
                  {{ i18nStore.t('roomChatTopBarMoreMenuBackHomeText')() }}
                </template>
              </ChatTopBarMoreMenuItem>
            </template>
          </ChatCol>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
