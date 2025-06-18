<script setup lang="ts">
import { useI18nStore } from '@/stores'
import { capitalizeFirstLetter, urlJoinUtil } from '@/utils'
import { pocketbaseConfig } from '@/config'

const i18nStore = useI18nStore()
const oauth2List = ['google', 'microsoft', 'github', 'apple']
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
      <button
        v-for="item in oauth2List"
        :key="item"
        class="my-4 flex h-10 w-full items-center rounded-full border-2 border-color-text-soft bg-color-background-soft py-2 pl-5 pr-3 transition-colors hover:bg-color-background hover:text-color-text"
      >
        <div class="mr-2">
          <img
            :src="
              urlJoinUtil(
                pocketbaseConfig.baseUrl,
                `/_/images/oauth2/${item}.svg`
              )
            "
            class="h-5 w-5"
          />
        </div>
        <div class="flex flex-1 items-center justify-center truncate">
          <span class="truncate">
            {{
              i18nStore.t('loginWithOauth2Text')(capitalizeFirstLetter(item))
            }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
