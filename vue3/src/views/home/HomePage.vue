<script setup lang="ts">
import { routerDict } from '@/config'
import { pb } from '@/lib'
import { useAuthStore, useI18nStore } from '@/stores'
import { RouterLink } from 'vue-router'

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
    <div>
      <ElButton @click="testAuthRefresh">测试刷新auth</ElButton>
      <ElButton @click="testAuthClear">测试清除auth</ElButton>
      <ElButton @click="$router.push(routerDict.LoginPage.path)">登录</ElButton>
    </div>
    <div>
      <RouterLink
        class="inline-block h-10 cursor-pointer bg-red-950"
        :to="{
          name: routerDict.RoomPage.name,
          params: {
            [routerDict.RoomPage.paramsKey.title]: '房间测试1...',
            [routerDict.RoomPage.paramsKey.id]: 'pk6fqr5x9o2npb4',
          },
        }"
      >
        房间测试1
      </RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
