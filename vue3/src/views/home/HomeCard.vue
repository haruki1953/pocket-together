<script setup lang="ts">
import type { HomeCardType } from './types'

const emit = defineEmits<{
  (e: 'toggleFavorite', home: HomeCardType): void
}>()

const props = defineProps<{
  home: HomeCardType
}>()

const tagTypes = ['success', 'info', 'warning', 'danger'] as const
</script>

<template>
  <div
    class="group/card relative mb-4 flow-root transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60"
  >
    <!-- 封面 -->
    <div class="overflow-hidden">
      <img
        :src="home.coverUrl"
        alt="Room cover"
        class="h-max w-full transition-all duration-300 ease-in-out group-hover/card:scale-105"
      />
    </div>
    <!-- 底部 -->
    <div
      class="relative h-max w-full bg-color-background-soft p-4 group-hover/card:bg-gray-100 dark:group-hover/card:bg-neutral-800"
    >
      <h3 class="font-bold text-gray-800 dark:text-gray-100">
        {{ home.title }}
      </h3>

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
          {{ tag }}
        </ElTag>
      </div>
      <!-- 用户 -->
      <div class="mt-3 flex items-center">
        <img :src="home.avatarUrl" class="mr-2 h-6 w-6 rounded-full" />
        <span class="text-sm text-gray-500 dark:text-gray-400">{{
          home.creator
        }}</span>
      </div>
    </div>

    <!-- 收藏 -->
    <div
      class="absolute bottom-0 right-0 m-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-500/10 dark:hover:bg-white/10"
      @click.stop="emit('toggleFavorite', home)"
    >
      <svg
        class="h-6 transition-transform duration-200 hover:scale-110 active:scale-90"
        :class="
          home.isFavorited
            ? 'text-blue-600'
            : 'text-gray-400 group-hover/button:text-blue-600 dark:text-gray-400 dark:group-hover/button:text-blue-400'
        "
        viewBox="0 0 16 21"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 2.5C0 1.12 1.119 0 2.5 0H13.5C14.881 0 16 1.12 16 2.5V20.94L8 15.23L0 20.94V2.5ZM2.5 2C2.224 2 2 2.22 2 2.5V17.06L8 12.77L14 17.06V2.5C14 2.22 13.776 2 13.5 2H2.5Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </div>
</template>
