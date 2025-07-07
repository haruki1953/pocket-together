<script setup lang="ts">
import { routerSettingList } from '@/router'
import { useI18nStore } from '@/stores'
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
</script>

<template>
  <div>
    <ContainerCol2 col1Position="right" col1Twcss="flex-1" col2Twcss="w-24">
      <template #col1>
        <RouterView></RouterView>
        <!-- <div class="h-[3000px] bg-red-950"></div> -->
      </template>
      <template #col2>
        <div>
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
  </div>
</template>

<style lang="scss" scoped></style>
