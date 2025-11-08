<script setup lang="ts">
import { routerDict } from '@/config'
import type { HomeCardType } from './types'
import { useI18nStore } from '@/stores'
import { RouterLink } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import { layoutSettingPageConfig } from '@/config'
import { useAuthStore } from '@/stores'

const authStore = useAuthStore()
const UserIma = authStore.record

const i18nStore = useI18nStore()

// 检测进入页面
const isReady = ref(false)

onMounted(() => {
  setTimeout(() => {
    isReady.value = true
  }, 50)
})

const emit = defineEmits<{
  (e: 'toggleJoin', home: HomeCardType): void
  (e: 'deleteRoom', home: HomeCardType): void
}>()

defineProps<{
  home: HomeCardType
}>()

const tagTypes = ['success', 'info', 'warning', 'danger'] as const

// 以下是响应式布局相关
const { width: windowWidth } = useWindowSize()

const showContentTrueCol2FalseCol1 = computed(() => {
  if (
    windowWidth.value >= layoutSettingPageConfig.breakpointContentCol2ToCol1
  ) {
    return true
  }
  return false
})
</script>

<template>
  <RouterLink
    :to="{
      name: routerDict.RoomPage.name,
      params: {
        [routerDict.RoomPage.paramsKey.id]: home.id,
        [routerDict.RoomPage.paramsKey.title]: home.title,
      },
    }"
    class="block"
  >
    <div
      class="group/card relative flow-root transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft shadow-lg transition-all duration-500 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60"
    >
      <!-- 封面 -->
      <div class="max-h-[400px] overflow-hidden bg-red-400">
        <img
          :src="home.coverUrl"
          alt="Room cover"
          class="h-full w-full object-cover transition-all duration-300 ease-in-out group-hover/card:scale-105"
        />
      </div>
      <!-- 底部 -->
      <div
        v-if="showContentTrueCol2FalseCol1"
        class="relative h-max w-full p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] group-hover/card:bg-gray-100 dark:group-hover/card:bg-neutral-800"
      >
        <h3 class="line-clamp-3 font-bold text-gray-800 dark:text-gray-100">
          {{ home.title }}
        </h3>

        <!-- 用户 -->
        <div class="mt-3 flex items-center">
          <img :src="home.avatarUrl" class="mr-2 h-6 w-6 rounded-full" />
          <span class="text-sm text-gray-500 dark:text-gray-400">{{
            home.creator
          }}</span>
        </div>
        <!-- 标签 -->
        <div v-if="home.tags.length" class="mt-3">
          <ElTag
            v-for="(tag, index) in home.tags"
            :key="tag"
            class="mr-2"
            round
            :type="tagTypes[index % tagTypes.length]"
            size="small"
            effect="light"
          >
            <!-- 暂时不确定 tag 是否要做固定化，忽略此报错 -->
            <!-- {{ i18nStore.t(tag as I18nMessagesKeyType)() }} -->
            {{ home.tags[index] }}
          </ElTag>
        </div>
        <!-- 在线人数 -->
        <div class="mb-1 mt-3 flex items-center font-bold text-gray-400">
          {{ i18nStore.t('homeCardPeopleOnline')(0) }}
        </div>
      </div>
      <div
        v-if="!showContentTrueCol2FalseCol1"
        class="relative h-max w-full p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] group-hover/card:bg-gray-100 dark:group-hover/card:bg-neutral-800"
      >
        <h2 class="line-clamp-2 font-bold text-gray-800 dark:text-gray-100">
          {{ home.title }}
        </h2>
        <!-- 标签 -->
        <div v-if="home.tags.length" class="mt-2">
          <ElTag
            v-for="(tag, index) in home.tags"
            :key="tag"
            class="mr-2"
            round
            :type="tagTypes[index % tagTypes.length]"
            size="small"
            effect="light"
          >
            <!-- 暂时不确定 tag 是否要做固定化，忽略此报错 -->
            <!-- {{ i18nStore.t(tag as I18nMessagesKeyType)() }} -->
            {{ home.tags[index] }}
          </ElTag>
        </div>
        <!-- 在线人数 -->
        <div class="mb-1 mt-3 flex items-center font-bold text-gray-400">
          {{ i18nStore.t('homeCardPeopleOnline')(0) }}
        </div>

        <!-- 用户 -->
        <div class="mt-4 flex items-center">
          <img :src="home.avatarUrl" class="mr-2 h-6 w-6 rounded-full" />
          <span class="text-sm text-gray-500 dark:text-gray-400">{{
            home.creator
          }}</span>
        </div>
      </div>

      <!-- 删除 -->
      <div
        v-if="UserIma && UserIma.id === home.creatorId"
        class="group/button absolute bottom-0 right-0 m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-500/10 dark:hover:bg-white/10"
        @click.prevent.stop="emit('deleteRoom', home)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          class="text-red-400"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M16 9v10H8V9zm-1.5-6h-5l-1 1H5v2h14V4h-3.5zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2z"
          />
        </svg>
      </div>
      <!-- 收藏 -->
      <div
        v-else
        class="group/button absolute bottom-0 right-0 m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-500/10 dark:hover:bg-white/10"
        @click.prevent.stop="emit('toggleJoin', home)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          :class="
            home.join
              ? 'text-blue-600'
              : 'text-gray-400 group-hover/button:text-blue-600 dark:text-gray-400 dark:group-hover/button:text-blue-400'
          "
        >
          <path
            fill="currentColor"
            d="M11 11v2q0 .425.288.713T12 14t.713-.288T13 13v-2h2q.425 0 .713-.288T16 10t-.288-.712T15 9h-2V7q0-.425-.288-.712T12 6t-.712.288T11 7v2H9q-.425 0-.712.288T8 10t.288.713T9 11zm-5 7l-2.3 2.3q-.475.475-1.088.213T2 19.575V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18zm-.85-2H20V4H4v13.125zM4 16V4z"
          />
        </svg>
      </div>
    </div>
  </RouterLink>
</template>
