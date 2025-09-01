<script setup lang="ts">
import { computed } from 'vue'
import PocketTitle from '@/components/pocket/PocketTitle.vue'
import { useI18nStore } from '@/stores'

const i18nStore = useI18nStore()

const menuItems = computed(() => [
  { id: 'all', text: i18nStore.t('homeMenuAllRooms')() },
  { id: 'search', text: i18nStore.t('homeMenuSearchRooms')() },
  { id: 'favorites', text: i18nStore.t('homeMenuFavoriteRooms')() },
])
</script>

<template>
  <div
    class="group transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft p-4 shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100"
  >
    <!-- 标题 -->
    <!-- 虽然反直觉，但我让他在小屏模式下字体更大了一点 -->
    <div class="text-[46px] md:text-[40px] lg:text-[40px] xl:text-[32px]">
      <PocketTitle></PocketTitle>
    </div>
    <!-- 选项卡区域 -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex h-full w-full flex-col gap-4">
        <button
          v-for="item in menuItems"
          :key="item.id"
          class="flex-1 rounded-3xl bg-gray-100 py-2 text-base font-semibold hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-blue-900"
        >
          {{ item.text }}
        </button>
      </div>
    </div>
    <RouterLink :to="{ name: 'CreateRoomPage' }">
      <!-- 添加房间 -->
      <div
        class="group/add transform-gpu cursor-pointer break-inside-avoid rounded-2xl border-2 border-dashed border-gray-300 p-6 transition-all hover:border-blue-400 hover:bg-gray-100 hover:shadow-xl dark:border-gray-700 dark:hover:border-blue-500 dark:hover:bg-gray-800/50"
      >
        <div class="flex flex-col items-center justify-center">
          <div
            class="text-4xl text-gray-400 transition-colors group-hover/add:text-blue-500"
          >
            +
          </div>
          <div
            class="mt-2 text-sm font-medium text-gray-500 transition-colors group-hover/add:text-blue-500 dark:text-gray-400"
          >
            {{ i18nStore.t('homeMenuCreateRoom')() }}
          </div>
        </div>
      </div>
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
.gradient-text {
  font-family: 'Nunito', sans-serif;
  background: linear-gradient(
    to right,
    var(--color-text) 20%,
    // var(--el-color-danger) 20%,
    var(--el-color-primary) 80%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.wrap-long-text {
  overflow-wrap: anywhere; /* 允许在任意点断行，但仍尝试保持完整词 */
  white-space: pre-wrap;
}
</style>
