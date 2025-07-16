<script setup lang="ts">
import { useI18nStore } from '@/stores'

const i18nStore = useI18nStore()

const cancelFn = () => {}

const isSubmitting = false
const submit = () => {}
</script>

<template>
  <!-- 修改头像组件 -->
  <div>
    <!-- 内容标题 -->
    <div class="mb-3 ml-3 text-sm font-bold text-color-text-soft">
      {{ i18nStore.t('settingProfileUpdateAvatarContentTitle')() }}
    </div>
    <!-- 头像盒子 -->
    <div></div>
    <!-- 按钮盒子 -->
    <div class="poto-setting-button-box">
      <ElButton :loading="isSubmitting" type="primary" round @click="submit()">
        {{ i18nStore.t('settingButtonSave')() }}
      </ElButton>
      <ElButton type="info" round @click="cancelFn()">
        {{ i18nStore.t('settingButtonCancel')() }}
      </ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
