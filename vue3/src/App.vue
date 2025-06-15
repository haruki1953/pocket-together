<script setup lang="ts">
import { i18nLocaleInfo } from './config'
import { useI18nStore } from './stores'
import { useDark } from '@vueuse/core'
import { computed } from 'vue'
import { darkTheme, lightTheme } from 'naive-ui'
import { useFirstDataLoadingAndAnimationMaskClose } from './composables'

const i18nStore = useI18nStore()

// @unhead/vue
useHead({
  htmlAttrs: { lang: computed(() => i18nStore.locale) }, // BCP 47 language code
})
useSeoMeta({
  title: 'App',
  titleTemplate: '%s - Vue',
  description: 'Learn about our awesome site.',
})

// 控制首次数据的加载，以及加载动画遮罩的关闭
useFirstDataLoadingAndAnimationMaskClose()

const isDark = useDark()
</script>

<template>
  <!-- NConfigProvider 主题控制 国际化控制 -->
  <NConfigProvider
    :theme="isDark ? darkTheme : lightTheme"
    :locale="i18nLocaleInfo[i18nStore.locale].nuLocale"
    :dateLocale="i18nLocaleInfo[i18nStore.locale].nuDateLocale"
  >
    <!-- ElConfigProvider 国际化控制 -->
    <ElConfigProvider :locale="i18nLocaleInfo[i18nStore.locale].elLocale">
      <RouterView></RouterView>
    </ElConfigProvider>
  </NConfigProvider>
</template>

<style scoped lang="scss"></style>
