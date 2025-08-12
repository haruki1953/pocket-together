<script setup lang="ts">
import HomeCard from './HomeCard.vue';
</script>

<template>
  <div class="min-h-screen p-4 pt-6 sm:p-6">
    <!-- Task 2.1: 创建瀑布流容器 -->
    <div class="columns-2 gap-4 sm:gap-6 md:columns-3 lg:columns-4">
      <!-- Task 2.2 & 2.3 / Step 3: 创建带样式的卡片 -->

      <!-- 菜单卡片 -->
      <div
        class="group mb-4 transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft p-4 shadow-xl transition-all duration-300 ease-in-out hover:!opacity-100"
      >
        <!-- 添加房间 -->
        <div
          class="group transform-gpu cursor-pointer break-inside-avoid rounded-2xl border-2 border-dashed border-gray-300 p-6 transition-all hover:border-blue-400 hover:bg-gray-100 hover:shadow-xl dark:border-gray-700 dark:hover:border-blue-500 dark:hover:bg-gray-800/50 sm:mb-6"
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
      </div>

      <!-- 房间卡片 -->
       <HomeCard></HomeCard>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
