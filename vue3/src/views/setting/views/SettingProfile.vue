<script setup lang="ts">
import { useI18nStore } from '@/stores'

const i18nStore = useI18nStore()
useSeoMeta({
  title: computed(() => i18nStore.t('pageSettingProfile')()),
})
</script>

<template>
  <div>
    <div class="my-6 flow-root rounded-3xl bg-color-background-soft">
      <div class="m-6 h-96 bg-red-950"></div>
      <div class="border border-color-background"></div>
      <div class="m-6 h-96 bg-red-950"></div>
    </div>
    <div class="my-6 flow-root rounded-3xl bg-color-background-soft">
      <div class="m-6 h-96 bg-red-950"></div>
      <div class="border border-color-background"></div>
      <div class="m-6 h-96 bg-red-950"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
