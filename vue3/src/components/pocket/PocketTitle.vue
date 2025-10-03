<script setup lang="ts">
import { useI18nStore } from '@/stores'

const i18nStore = useI18nStore()
</script>

<template>
  <div
    class="gradient-text wrap-long-text mb-3 select-none py-2 text-center font-bold"
  >
    {{ i18nStore.t('appNameI18n')() }}
  </div>
</template>

<style lang="scss" scoped>
.gradient-text {
  font-family: 'Nunito', sans-serif;
  background: linear-gradient(
    to right,
    var(--color-text) 20%,
    // var(--el-color-danger) 20%,
    var(--el-color-primary) 80%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.wrap-long-text {
  overflow-wrap: anywhere; /* 允许在任意点断行，但仍尝试保持完整词 */
  white-space: pre-wrap;
}
</style>
