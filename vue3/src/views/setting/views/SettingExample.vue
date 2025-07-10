<script setup lang="ts">
import { layoutSettingPageConfig } from '@/config'
import { useI18nStore } from '@/stores'
import { useWindowSize } from '@vueuse/core'

const i18nStore = useI18nStore()
useSeoMeta({
  title: computed(() => i18nStore.t('pageSettingProfile')()),
})

const { width: windowWidth } = useWindowSize()
/**
 * 窗口大于等于1024显示两列，小于则显示一列
 * useWindowSize
 */
const showContentTrueCol2FalseCol1 = computed(() => {
  if (
    windowWidth.value >= layoutSettingPageConfig.breakpointContentCol2ToCol1
  ) {
    return true
  }
  return false
})
</script>

<template>
  <div>
    <div v-if="showContentTrueCol2FalseCol1" class="flex gap-x-6">
      <div class="flex-1">
        <div class="mb-6 flow-root rounded-3xl bg-color-background-soft">
          <div class="m-4 h-80 bg-red-950"></div>
          <div class="border border-color-background"></div>
          <div class="m-4 h-96 bg-red-950"></div>
        </div>
      </div>
      <div class="flex-1">
        <div class="mb-6 flow-root rounded-3xl bg-color-background-soft">
          <div class="m-4 h-96 bg-red-950"></div>
          <div class="border border-color-background"></div>
          <div class="m-4 h-96 bg-red-950"></div>
        </div>
      </div>
    </div>
    <div v-else class="mb-6 flow-root rounded-3xl bg-color-background-soft">
      <div class="m-4 h-96 bg-red-950"></div>
      <div class="border border-color-background"></div>
      <div class="m-4 h-96 bg-red-950"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
