<script setup lang="ts">
import { layoutLayoutNavConfig } from '@/config'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { ContainerBar, ContainerCol2 } from '@/components'
import { NavList } from './components'

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
                  class="bottom-bar flex w-fit items-end justify-center px-2 pb-1"
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
    var(--color-background) 60%,
    transparent 100%
  );
}
</style>
