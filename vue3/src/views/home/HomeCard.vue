<script setup lang="ts">
import { routerDict } from '@/config'
import type { HomeCardType } from './types'
import { useI18nStore } from '@/stores'
import { RouterLink } from 'vue-router'
// import type { I18nMessagesKeyType } from '@/config/i18n'

const i18nStore = useI18nStore()

// 检测进入页面
const isReady = ref(false)

onMounted(() => {
  setTimeout(() => {
    isReady.value = true
  }, 50)
})

const emit = defineEmits<{
  (e: 'toggleFavorite', home: HomeCardType): void
}>()

defineProps<{
  home: HomeCardType
}>()

const tagTypes = ['success', 'info', 'warning', 'danger'] as const
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
      <div class="max-h-[400px] min-h-[100px] overflow-hidden bg-red-400">
        <img
          :src="home.coverUrl"
          alt="Room cover"
          class="h-full w-full object-cover transition-all duration-300 ease-in-out group-hover/card:scale-105"
        />
      </div>
      <!-- 底部 -->
      <div
        class="relative h-max w-full bg-color-background-soft p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] group-hover/card:bg-gray-100 dark:group-hover/card:bg-neutral-800"
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

      <!-- 收藏 -->
      <div
        class="group/button absolute bottom-0 right-0 m-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-500/10 dark:hover:bg-white/10"
        @click.prevent.stop="emit('toggleFavorite', home)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 transition-transform duration-200 group-hover/button:scale-110 group-active/button:scale-90"
          :class="
            home.isFavorited
              ? 'text-blue-600'
              : 'text-gray-400 group-hover/button:text-blue-600 dark:text-gray-400 dark:group-hover/button:text-blue-400'
          "
          viewBox="0 0 384 512"
        >
          <path
            fill="currentColor"
            d="M0 48C0 21.5 21.5 0 48 0v441.4l130.1-92.9c8.3-6 19.6-6 27.9 0l130 92.9V48H48V0h288c26.5 0 48 21.5 48 48v440c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5l-154.1 110c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488z"
          />
        </svg>
      </div>
    </div>
  </RouterLink>
</template>
