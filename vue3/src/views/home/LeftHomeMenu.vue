<script setup lang="ts">
import Menudesu from './Menudesu.vue'
import PocketTitle from '@/components/pocket/PocketTitle.vue'
</script>

<template>
  <div
    class="fixed left-0 top-0 z-40 h-screen w-screen bg-gray-800/10 shadow-xl shadow-black/40 backdrop-blur-sm"
  >
    <div
      class="h-full w-[360px] bg-gray-200/90 p-4 shadow-xl shadow-black/30 backdrop-blur-md dark:bg-gray-800/90"
    >
      <div
        class="flex flex-col text-[46px] md:text-[40px] lg:text-[40px] xl:text-[42px]"
      >
        <PocketTitle class="mt-20"></PocketTitle>
      </div>
      <Menudesu></Menudesu>
    </div>
  </div>
</template>
