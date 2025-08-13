<script setup lang="ts">
import HomeCard from './HomeCard.vue'
import HomeMenu from './HomeMenu.vue'
</script>

<template>
  <div class="min-h-screen p-4 pt-6 sm:p-6">
    <!-- 瀑布流容器 -->
    <div class="columns-2 gap-4 sm:gap-6 md:columns-3 lg:columns-4">
      <!-- 菜单卡片 -->
      <HomeMenu></HomeMenu>

      <!-- 房间卡片 -->
      <HomeCard></HomeCard>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
