<script setup lang="ts">
import { layoutImagePageConfig } from '@/config'
import { useI18nStore } from '@/stores'
import { useWindowSize } from '@vueuse/core'

const i18nStore = useI18nStore()
useSeoMeta({
  title: computed(() => i18nStore.t('pageImage')()),
})
</script>

<template>
  <div>ImagePage</div>
</template>

<style lang="scss" scoped></style>
