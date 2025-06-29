<script setup lang="ts">
import { useI18nStore } from '@/stores'
import { urlJoinUtil } from '@/utils'
import { pocketbaseConfig } from '@/config'
import type { AuthMethodsList, AuthProviderInfo } from 'pocketbase'
import { Collections } from '@/lib'
import { pb, UsersLevelOptions, type Create } from '@/lib'

const props = defineProps<{
  listAuthMethodsResult: AuthMethodsList | null
}>()

const i18nStore = useI18nStore()
// const oauth2List = ['google', 'microsoft', 'github', 'apple']

const oauth2List = computed(() => {
  if (props.listAuthMethodsResult == null) {
    return []
  }
  if (props.listAuthMethodsResult.oauth2.enabled === false) {
    return []
  }
  return props.listAuthMethodsResult.oauth2.providers
})

const authWithOAuth2 = async (providerName: AuthProviderInfo['name']) => {
  const createData: {
    level: Create<Collections.Users>['level']
  } = {
    level: UsersLevelOptions.basic,
  }
  const res = await pb
    .collection(Collections.Users)
    .authWithOAuth2({ provider: providerName, createData })

  console.log(res)
}
</script>

<template>
  <!-- 左侧水平分割线 -->
  <div
    v-if="oauth2List.length > 0"
    class="border border-color-background"
  ></div>
  <!-- 左侧下栏 -->
  <div v-if="oauth2List.length > 0" class="mx-auto max-w-96">
    <div class="m-8">
      <!-- 各平台登录按钮 -->
      <button
        v-for="item in oauth2List"
        :key="item.name"
        class="my-4 flex h-10 w-full items-center rounded-full border-2 border-color-text-soft bg-color-background-soft py-2 pl-5 pr-3 transition-colors hover:bg-color-background hover:text-color-text"
        @click="authWithOAuth2(item.name)"
      >
        <div class="mr-2">
          <!-- 利用pocketbase本身提供的各平台图标 -->
          <img
            :src="
              urlJoinUtil(
                pocketbaseConfig.baseUrl,
                `/_/images/oauth2/${item.name}.svg`
              )
            "
            class="h-5 w-5"
          />
        </div>
        <div class="flex flex-1 items-center justify-center truncate">
          <span class="truncate">
            {{ i18nStore.t('loginWithOauth2Text')(item.displayName) }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
