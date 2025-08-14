<script setup lang="ts">
import type { HomeCardType } from './types'

const emit = defineEmits<{
  (e: 'toggleFavorite', home: HomeCardType): void
}>()

defineProps<{
  home: HomeCardType
}>()

const tagTypes = ['success', 'info', 'warning', 'danger'] as const
</script>

<template>
  <div
    class="group relative mb-4 flow-root transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60"
  >
    <!-- 封面 -->
    <div class="overflow-hidden">
      <img
        :src="home.coverUrl"
        alt="Room cover"
        class="h-max w-full transition-all duration-300 ease-in-out group-hover:scale-105"
      />
    </div>
    <!-- 底部 -->
    <div
      class="relative h-max w-full bg-color-background-soft p-4 group-hover:bg-gray-100 dark:group-hover:bg-neutral-800"
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
    <i
      class="absolute bottom-4 right-4 cursor-pointer text-2xl transition-all active:scale-90"
      :class="{
        'ri-star-fill text-blue-500': home.isFavorited,
        'ri-star-line text-gray-400 hover:text-blue-500 dark:text-gray-500':
          !home.isFavorited,
      }"
      @click.stop="emit('toggleFavorite', home)"
    ></i>
  </div>
</template>
