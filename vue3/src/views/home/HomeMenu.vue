<script setup lang="ts">
import { ref } from 'vue'

const menuItems = ref([
  { id: 'all', text: '全部房间' },
  { id: 'search', text: '搜索房间' },
  { id: 'favorites', text: '收藏房间' },
])
</script>

<template>
  <div
    class="group transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft p-4 shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100"
  >
    <!-- 新增选项卡区域 -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex w-full flex-col gap-4">
        <button
          v-for="item in menuItems"
          :key="item.id"
          class="flex-1 rounded-3xl bg-gray-100 py-2 text-base font-semibold transition-colors hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-blue-800"
        >
          {{ item.text }}
        </button>
      </div>
    </div>
    <RouterLink :to="{ name: 'CreateRoomPage' }">
      <!-- 添加房间 -->
      <div
        class="group transform-gpu cursor-pointer break-inside-avoid rounded-2xl border-2 border-dashed border-gray-300 p-6 transition-all hover:border-blue-400 hover:bg-gray-100 hover:shadow-xl dark:border-gray-700 dark:hover:border-blue-500 dark:hover:bg-gray-800/50"
      >
        <div class="flex flex-col items-center justify-center">
          <div
            class="text-4xl text-gray-400 transition-colors group-hover:text-blue-500"
          >
            +
          </div>
          <div
            class="mt-2 text-sm font-medium text-gray-500 transition-colors group-hover:text-blue-500 dark:text-gray-400"
          >
            创建新房间
          </div>
        </div>
      </div>
    </RouterLink>
  </div>
</template>
