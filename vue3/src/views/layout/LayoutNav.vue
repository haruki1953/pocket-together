<script setup lang="ts">
import { layoutLayoutNavConfig } from '@/config'
import { useElementSize, useWindowSize } from '@vueuse/core'
import NavList from './components/NavList.vue'
// 滚动行为
import { useScroll } from '@vueuse/core'
import { ref, watch, onMounted } from 'vue'
const isNavBottomUpOrDown = ref(true)
const isMounted = ref(false)
const { y } = useScroll(window)

onMounted(() => {
  // 避开刷新时的初始滚动事件
  setTimeout(() => {
    isMounted.value = true
  }, 500)
})
watch(y, (newY, oldY) => {
  if (!isMounted.value || newY === oldY) {
    return
  }

  if (newY > oldY) {
    isNavBottomUpOrDown.value = false
  } else if (newY < oldY) {
    isNavBottomUpOrDown.value = true
  }
})

// const refDiv = ref<HTMLElement | null>(null)
// const { width: refDivWidth } = useElementSize(refDiv)
const { width: refDivWidth } = useWindowSize()
/**
 * 大于等于768将显示右侧导航栏，小于768将显示底部导航栏
 */
const showNavTrueRithtFalseBottom = computed(() => {
  if (
    refDivWidth.value >= layoutLayoutNavConfig.breakpointNavRightToNavBottom
  ) {
    return true
  }
  return false
})
</script>

<template>
  <div ref="refDiv" class="layout-nav">
    <!-- 大于等于768将显示右侧导航栏 -->
    <template v-if="showNavTrueRithtFalseBottom">
      <ContainerCol2 col1Position="left" col1Twcss="flex-1" col2Twcss="w-24">
        <template #col1>
          <RouterView></RouterView>
        </template>
        <template #col2>
          <div>
            <div class="flex min-h-screen items-center justify-center">
              <div class="my-5 flex flex-col items-center">
                <NavList></NavList>
              </div>
            </div>
          </div>
        </template>
      </ContainerCol2>
    </template>
    <!-- 小于768将显示底部导航栏 -->
    <template v-else>
      <ContainerBar>
        <RouterView></RouterView>
        <template #bar>
          <div>
            <div
              :style="{
                height: `${layoutLayoutNavConfig.navBottomHeight}px`,
              }"
            >
              <ElScrollbar :height="layoutLayoutNavConfig.navBottomHeight">
                <div
                  :style="{
                    height: `${layoutLayoutNavConfig.navBottomHeight}px`,
                    'min-width': '100%',
                  }"
                  class="bottom-bar transform-all absolute flex w-fit items-end justify-center px-2 duration-1000 ease-in-out"
                  :class="isNavBottomUpOrDown ? 'pb-28' : 'pb-2'"
                >
                  <NavList></NavList>
                </div>
              </ElScrollbar>
            </div>
          </div>
        </template>
      </ContainerBar>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.layout-nav {
  max-width: 2000px;
  margin: 0 auto;
}
.bottom-bar {
  // 背景色 --color-background
  // 渐变，透明
  background: linear-gradient(
    to top,
    var(--color-background) 20%,
    transparent 50%
  );
}
</style>
