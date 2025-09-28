<script setup lang="ts">
import { useWatchSourceToHoldTimeAndStep } from '@/utils'
import { RiArrowUpWideLine, RiLoader4Line, RiRestartLine } from '@remixicon/vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{
  chatRoomMessagesRestartFn: () => Promise<void>
  chatRoomMessagesRestartFnRunning: boolean
  chatRoomMessagesRestartFnRunnable: boolean
}>()

const isShowMoreMenu = ref(false)
const openMoreMenu = () => {
  isShowMoreMenu.value = true
}
const closeMoreMenu = () => {
  isShowMoreMenu.value = false
}
const toggleShowMoreMenu = () => {
  isShowMoreMenu.value = !isShowMoreMenu.value
}

// 当菜单展开时，点击菜单外部可以关闭菜单
const targetMoreMenu = useTemplateRef<HTMLElement>('targetMoreMenu')
const targetMoreMenuToggleShowButton = useTemplateRef<HTMLElement>(
  'targetMoreMenuToggleShowButton'
)
onClickOutside(targetMoreMenu, (event) => {
  console.log(event)
  // 菜单未打开，直接返回
  if (targetMoreMenu == null || isShowMoreMenu.value === false) {
    return
  }
  // 点击正好是在菜单开关按钮上，直接返回
  if (
    targetMoreMenuToggleShowButton.value != null &&
    targetMoreMenuToggleShowButton.value?.contains(event.target as Node)
  ) {
    return
  }
  closeMoreMenu()
})

// 让加载动画至少显示1秒（转一圈），且转的圈数为整数
const { sourceHaveHold: chatRoomMessagesRestartFnRunningForAni } =
  useWatchSourceToHoldTimeAndStep({
    source: computed(() => props.chatRoomMessagesRestartFnRunning),
    holdMs: 1000,
    stepMs: 1000,
  })

// 动画进行时不能刷新
const chatRoomMessagesRestartFnWithDisableOnAni = () => {
  if (chatRoomMessagesRestartFnRunningForAni.value === true) {
    return
  }
  props.chatRoomMessagesRestartFn()
}
// 控制鼠标光标样式
const moreMenuItemStyleClass = computed(() => {
  // 加载中
  if (chatRoomMessagesRestartFnRunningForAni.value === true) {
    const cursorTwcss = 'cursor-default'
    const textTwcss = 'text-color-text-soft'
    return {
      cursorTwcss,
      textTwcss,
    }
  }
  // 不可进行
  if (props.chatRoomMessagesRestartFnRunnable === false) {
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
  <!-- 聊天页顶栏 -->
  <div class="chat-top-bar relative">
    <!-- 展开菜单 -->
    <Transition name="fade-down-up">
      <div
        v-if="isShowMoreMenu"
        ref="targetMoreMenu"
        class="more-menu absolute top-0 z-[2] bg-color-background-soft"
      >
        <!-- 垫片 -->
        <div class="h-[50px]"></div>
        <!-- 菜单项 刷新 -->
        <div
          class="flow-root select-none"
          :class="moreMenuItemStyleClass.cursorTwcss"
          @click="chatRoomMessagesRestartFnWithDisableOnAni"
        >
          <div
            class="mx-[15px] my-[6px] flex items-center"
            :class="moreMenuItemStyleClass.textTwcss"
          >
            <div class="mr-[8px]">
              <!-- <Transition mode="out-in" name="fade-pop">
                <RiLoader4Line
                  v-if="chatRoomMessagesRestartFnRunning"
                  size="18px"
                  class="loading-spinner-500ms"
                ></RiLoader4Line>
                <RiRestartLine v-else size="18px"></RiRestartLine>
              </Transition> -->
              <RiRestartLine
                size="18px"
                :class="{
                  'loading-spinner-1s': chatRoomMessagesRestartFnRunningForAni,
                }"
              ></RiRestartLine>
            </div>
            <div class="wrap-long-text text-[14px] font-bold">
              {{ '刷新' }}
            </div>
          </div>
        </div>
        <!-- 收起 -->
        <div
          class="more-menu-close-button flow-root cursor-pointer select-none hover:bg-el-primary-light-4"
          @click="closeMoreMenu"
        >
          <div class="button-box flex items-center justify-center">
            <RiArrowUpWideLine size="20px"></RiArrowUpWideLine>
          </div>
        </div>
      </div>
    </Transition>
    <div class="top-bar-box relative z-[3] flow-root bg-color-background-soft">
      <div class="">
        <!-- 顶栏 -->
        <div class="flex items-center">
          <!-- 返回 -->
          <div
            class="flex h-[40px] w-[48px] cursor-pointer items-center justify-center"
          >
            <RiArrowLeftSFill></RiArrowLeftSFill>
          </div>
          <!-- 标题 -->
          <div class="flex-1"></div>
          <!-- 更多 -->
          <div
            ref="targetMoreMenuToggleShowButton"
            class="more-menu-toggle-show-button flex h-[40px] w-[48px] cursor-pointer items-center justify-center"
            :class="{
              'is-show-more-menu': isShowMoreMenu,
            }"
            @click="toggleShowMoreMenu"
          >
            <RiMore2Fill class="more-menu-icon"></RiMore2Fill>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.top-bar-box {
  border-radius: 0 0 24px 24px;
  box-shadow: 0 0 6px 6px var(--color-background);
}
.more-menu {
  border-radius: 0 0 24px 24px;
  box-shadow: 0 0 6px 6px var(--color-background);
  right: 24px;
  max-width: calc(100% - (2 * 24px));
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  overflow-x: hidden;
}
.more-menu-toggle-show-button {
  .more-menu-icon {
    transition: all 300ms;
    transform: rotate(0);
  }
  &.is-show-more-menu {
    .more-menu-icon {
      transform: rotate(90deg);
    }
  }
}
.more-menu-close-button {
  .button-box {
    height: 24px;
  }
}
</style>
