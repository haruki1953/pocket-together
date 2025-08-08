<script setup lang="ts">
import { routerDict } from '@/config'
import { pb } from '@/lib'
import { useAuthStore, useI18nStore } from '@/stores'

const i18nStore = useI18nStore()
useSeoMeta({
  title: computed(() => i18nStore.t('pageHome')()),
})

// 测试刷新auth
const testAuthRefresh = async () => {
  const pbRes = await pb.collection('users').authRefresh()
  console.log(pbRes)
}

// 测试清除auth
const testAuthClear = () => {
  pb.authStore.clear()
}

const authStore = useAuthStore()
</script>

<template>
  <div class="max-w-full">
    <div>{{ i18nStore.t('pageHome')() }}</div>
    <div class="wrap-long-text">{{ authStore.record }}</div>
    <div>{{ authStore.isValid }}</div>
    <div class="wrap-long-text">{{ authStore.token }}</div>
    <ElButton @click="testAuthRefresh">测试刷新auth</ElButton>
    <ElButton @click="testAuthClear">测试清除auth</ElButton>
    <ElButton @click="$router.push(routerDict.LoginPage.path)">登录</ElButton>
  </div>
</template>

<style lang="scss" scoped>
.wrap-long-text {
  overflow-wrap: anywhere; /* 允许在任意点断行，但仍尝试保持完整词 */
  white-space: pre-wrap;
}
</style>
