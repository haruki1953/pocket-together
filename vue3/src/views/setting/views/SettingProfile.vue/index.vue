<script setup lang="ts">
import { layoutSettingPageConfig } from '@/config'
import { useI18nStore } from '@/stores'
import { useWindowSize } from '@vueuse/core'
import UpdateNameBio from './components/UpdateNameBio.vue'

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
    <!-- 大屏 双列-->
    <div v-if="showContentTrueCol2FalseCol1" class="flex gap-x-6">
      <!-- 第一列 -->
      <div class="flex-1">
        <!-- 圆角盒子 -->
        <div class="mb-6 flow-root rounded-3xl bg-color-background-soft">
          <!-- 内容盒子 -->
          <div class="m-4">
            <!-- 修改昵称简介盒子 -->
            <UpdateNameBio></UpdateNameBio>
          </div>
          <!-- 分割线 -->
          <!-- <div class="border border-color-background"></div> -->
        </div>
      </div>
      <!-- 第二列 -->
      <div class="flex-1"></div>
    </div>
    <!-- 小屏 单列 -->
    <div v-else>
      <div class="mb-6 flow-root rounded-3xl bg-color-background-soft">
        <div class="m-4">
          <UpdateNameBio></UpdateNameBio>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
