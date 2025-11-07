<script setup lang="ts">
import { i18nLocaleInfo } from './config'
import { useI18nStore, useRealtimeMessagesStore } from './stores'
import { useDark } from '@vueuse/core'
import { computed } from 'vue'
import { darkTheme, lightTheme } from 'naive-ui'
import {
  provideAppMainElScrollbar,
  useFirstDataLoadingAndAnimationMaskClose,
  useInitPbAuth,
  type AppMainElScrollbar,
} from './composables'
import type { ElScrollbar } from 'element-plus'
import { usePbCollectionConfigQuery } from './queries'
import { watchUntilQueryReady, watchUntilSourceCondition } from './utils'

const i18nStore = useI18nStore()
const pbCollectionConfigQuery = usePbCollectionConfigQuery()

const websiteName = computed(
  () => pbCollectionConfigQuery.data.value?.['website-name']
)

// @unhead/vue
useHead({
  htmlAttrs: { lang: computed(() => i18nStore.locale) }, // BCP 47 language code
})
useSeoMeta({
  titleTemplate: (titleChunk) => {
    const siteName = websiteName.value ?? ''
    if (titleChunk == null) {
      return siteName
    }
    return `${titleChunk} - ${siteName}`
  },
})

// 控制首次数据的加载，以及加载动画遮罩的关闭
useFirstDataLoadingAndAnimationMaskClose({
  dataFirstLoadService: async () => {
    // 遮罩的关闭会等待pbCollectionConfigQuery
    await watchUntilQueryReady(pbCollectionConfigQuery)
  },
})

// 在程序初始化时，进行关于pocketbase身份验证的一些操作
useInitPbAuth()

// 启动消息订阅
const realtimeMessagesStore = useRealtimeMessagesStore()
realtimeMessagesStore.startSubscribe()

const isDark = useDark()

// el滚动条的组件实例。【251017】不再使用HTML页面级滚动，使用el滚动条
const appMainElScrollbar: AppMainElScrollbar = ref(null)
provideAppMainElScrollbar(appMainElScrollbar)
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
      <ElScrollbar
        ref="appMainElScrollbar"
        height="100vh"
        class="appMainElScrollbar"
      >
        <RouterView></RouterView>
      </ElScrollbar>
    </ElConfigProvider>
  </NConfigProvider>
</template>

<style scoped lang="scss"></style>
