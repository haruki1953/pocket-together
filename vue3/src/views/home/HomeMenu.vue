<script setup lang="ts"></script>

<template>
  <div
    class="group transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft p-4 shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100"
  >
    <!-- 新增选项卡区域 -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex gap-4 w-full">
        <button
          class="flex-1 py-2 rounded-lg text-base font-semibold transition-colors bg-gray-100 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-blue-800"
        >
          全部房间
        </button>
        <button
          class="flex-1 py-2 rounded-lg text-base font-semibold transition-colors bg-gray-100 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-blue-800"
        >
          搜索房间
        </button>
        <button
          class="flex-1 py-2 rounded-lg text-base font-semibold transition-colors bg-gray-100 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-blue-800"
        >
          收藏房间
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
