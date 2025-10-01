<script setup lang="ts">
import { ContainerCol2 } from '@/components'
import { useBalancedGrid } from '@/composables'
import { layoutSettingPageConfig } from '@/config'
import { routerSettingList } from '@/config'
import { useI18nStore } from '@/stores'
import { useWindowSize } from '@vueuse/core'
import { useRoute } from 'vue-router'

const i18nStore = useI18nStore()
useSeoMeta({
  title: computed(() => i18nStore.t('pageSetting')()),
})

const route = useRoute()
const isNavItemActive = (item: { path: string }) => {
  if (item.path === '/') {
    return route.path === item.path
  }
  return route.matched.some((record) => record.path === item.path)
}

const { width: windowWidth } = useWindowSize()
/**
 * 大于768将显示左侧导航栏，小于768将显示顶部导航栏
 */
const showNavTrueLeftFalseTop = computed(() => {
  if (windowWidth.value >= layoutSettingPageConfig.breakpointNavLeftToNavTop) {
    return true
  }
  return false
})

// 顶部导航栏，根据容器宽度和每项宽度，将项目列表均匀地分配成二维网格布局。
const refNavTopContainer = ref<HTMLElement | null>(null)
const navTopGrid = useBalancedGrid(
  refNavTopContainer,
  ref(routerSettingList),
  ref(56)
)
</script>

<template>
  <div>
    <!-- 大屏模式 -->
    <template v-if="showNavTrueLeftFalseTop">
      <ContainerCol2 col1Position="right" col1Twcss="flex-1" col2Twcss="w-24">
        <template #col1>
          <div class="mt-6">
            <RouterView></RouterView>
          </div>
        </template>
        <template #col2>
          <div>
            <!-- 左侧导航栏 纵向居中排列 -->
            <div class="flex min-h-screen items-center justify-center">
              <div class="my-5 flex flex-col items-center">
                <template v-for="item in routerSettingList" :key="item.name">
                  <ElTooltip
                    :content="i18nStore.t(item.titleI18nMessageKey)()"
                    placement="right"
                    effect="light"
                  >
                    <RouterLink
                      :to="item.path"
                      :class="{
                        'border-el-primary text-el-primary':
                          isNavItemActive(item),
                        'border-color-background-soft hover:border-el-primary-light-8':
                          !isNavItemActive(item),
                      }"
                      class="m-2 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 bg-color-background-soft transition-colors hover:bg-el-primary-light-8 hover:text-el-primary"
                    >
                      <component :is="item.icon"></component>
                    </RouterLink>
                  </ElTooltip>
                </template>
              </div>
            </div>
          </div>
        </template>
      </ContainerCol2>
    </template>
    <!-- 小屏模式 -->
    <template v-else>
      <div class="mt-4">
        <!-- 顶部导航栏 均匀网格排列 -->
        <div ref="refNavTopContainer">
          <template
            v-for="(itemRow, index) in navTopGrid.grid.value"
            :key="index"
          >
            <div class="flex items-center justify-center">
              <template v-for="item in itemRow" :key="item.name">
                <ElTooltip
                  :content="i18nStore.t(item.titleI18nMessageKey)()"
                  placement="bottom"
                  effect="light"
                >
                  <RouterLink
                    :to="item.path"
                    :class="{
                      'border-el-primary text-el-primary':
                        isNavItemActive(item),
                      'border-color-background-soft hover:border-el-primary-light-8':
                        !isNavItemActive(item),
                    }"
                    class="m-2 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 bg-color-background-soft transition-colors hover:bg-el-primary-light-8 hover:text-el-primary"
                  >
                    <component :is="item.icon"></component>
                  </RouterLink>
                </ElTooltip>
              </template>
            </div>
          </template>
        </div>
      </div>
      <div class="mx-2 mt-4">
        <div
          class="mx-auto"
          :style="{
            maxWidth: `${layoutSettingPageConfig.contentMaxWidthOnNavTop}px`,
          }"
        >
          <RouterView></RouterView>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
