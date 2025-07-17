<script setup lang="ts">
import { appLogo } from '@/config'
import { routerNavInfo } from '@/config'
import { useI18nStore } from '@/stores'
import { useRoute } from 'vue-router'

const route = useRoute()
const isNavItemActive = (item: { path: string }) => {
  if (item.path === '/') {
    return route.path === item.path
  }
  return route.matched.some((record) => record.path === item.path)
}

const i18nStore = useI18nStore()
</script>

<template>
  <template v-for="item in routerNavInfo.navList" :key="item.name">
    <!-- <ElTooltip
                  :content="i18nStore.t(item.titleI18nMessageKey)()"
                  placement="left"
                  effect="light"
                > -->
    <RouterLink
      :to="item.path"
      :class="{
        'border-el-primary text-el-primary': isNavItemActive(item),
        'border-color-background-soft hover:border-el-primary-light-8':
          !isNavItemActive(item),
      }"
      class="m-2 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 bg-color-background-soft transition-colors hover:bg-el-primary-light-8 hover:text-el-primary"
    >
      <component :is="item.icon"></component>
    </RouterLink>
    <!-- </ElTooltip> -->
  </template>
  <!-- <ElTooltip
                :content="
                  i18nStore.t(routerNavInfo.navPage.titleI18nMessageKey)()
                "
                placement="left"
                effect="light"
              > -->
  <RouterLink
    :to="routerNavInfo.navPage.path"
    :style="{
      backgroundImage: `url('${appLogo}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
    :class="{
      'border-el-primary text-el-primary': isNavItemActive(
        routerNavInfo.navPage
      ),
      'border-color-background-soft hover:border-el-primary-light-8':
        !isNavItemActive(routerNavInfo.navPage),
    }"
    class="m-2 flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 bg-color-background-soft bg-cover bg-center transition-colors hover:bg-el-primary-light-8"
  >
  </RouterLink>
  <!-- </ElTooltip> -->
</template>

<style lang="scss" scoped></style>
