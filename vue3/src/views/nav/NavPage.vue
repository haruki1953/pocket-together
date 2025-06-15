<script setup lang="ts">
import { i18nLocaleInfo, i18nLocaleList } from '@/config'
import { useI18nStore } from '@/stores'
import { useDark } from '@vueuse/core'

const i18nStore = useI18nStore()
useSeoMeta({
  title: computed(() => i18nStore.t('pageNav')()),
})

const isDark = useDark()
</script>

<template>
  <div>
    {{ i18nStore.t('pageNav')() }}
    <div class="m-4">
      <ElButton
        v-for="key in i18nLocaleList"
        :key="key"
        @click="i18nStore.localeSet(key)"
      >
        {{ `${i18nLocaleInfo[key].language}(${i18nLocaleInfo[key].region})` }}
      </ElButton>
    </div>
    <div class="m-4">
      <ElButton @click="isDark = !isDark"> isDark </ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
