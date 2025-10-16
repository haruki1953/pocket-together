<script setup lang="ts">
import Menudesu from './Menudesu.vue'
import PocketTitle from '@/components/pocket/PocketTitle.vue'
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
    <Menudesu></Menudesu>
  </div>
</template>
