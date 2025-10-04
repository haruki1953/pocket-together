<script setup lang="ts">
import { ref, computed } from 'vue'
import { PocketTitle } from '@/components'
import { useI18nStore } from '@/stores'
import { onClickOutside } from '@vueuse/core'

const i18nStore = useI18nStore()

const isSearching = ref(true)
const searchStatus = ref(null)

// function isSearchChenging() {
//   isSearching.value = !isSearching.value
// }
onClickOutside(searchStatus, () => {
  isSearching.value = true
})

const menuItems = computed(() => [
  { id: 'all', text: i18nStore.t('homeMenuAllRooms')() },
  { id: 'favorites', text: i18nStore.t('homeMenuFavoriteRooms')() },
])
</script>

<template>
  <div
    class="group h-max w-full transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft p-4 shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100"
  >
    <!-- 标题 -->
    <!-- 虽然反直觉，但我让他在小屏模式下字体更大了一点 -->
    <div class="text-[46px] md:text-[40px] lg:text-[40px] xl:text-[32px]">
      <PocketTitle></PocketTitle>
    </div>
    <!-- 选项卡区域 -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex h-full w-full flex-col gap-4">
        <div
          ref="searchStatus"
          class="relative flex flex-1 cursor-pointer flex-row items-center justify-center overflow-hidden rounded-3xl bg-gray-100 py-2 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-blue-900"
          @click="isSearching = false"
        >
          <span
            class="text-base font-semibold transition-all duration-700 ease-in-out"
            :class="
              isSearching
                ? 'translate-x-0 opacity-100'
                : 'translate-x-40 opacity-0'
            "
            >{{ i18nStore.t('homeMenuSearchRooms')() }}</span
          >
          <div
            class="absolute left-8 text-[16px] transition-all duration-500 ease-in-out"
            :class="isSearching ? '-translate-x-20' : '-translate-x-0'"
          >
            <i class="ri-search-line"></i>
          </div>
          <input
            class="absolute h-full w-full flex-1 cursor-pointer bg-white/0 pl-16 caret-gray-200 transition-all duration-700 ease-in-out placeholder:text-[16px] focus:outline-none"
            :class="isSearching ? 'opacity-0' : 'opacity-100'"
            type="text"
            placeholder="Search..."
          />
        </div>
        <button
          v-for="item in menuItems"
          :key="item.id"
          class="flex-1 rounded-3xl bg-gray-100 py-2 text-base font-semibold transition-all duration-200 ease-in-out hover:bg-blue-100 active:scale-90 dark:bg-gray-700 dark:hover:bg-blue-900"
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
