<script setup lang="ts">
const emit = defineEmits(['hoverChange'])

// 2. 定义鼠标进入时要调用的函数
function inL() {
  emit('hoverChange', true)
}

function inR() {
  emit('hoverChange', false)
}
</script>

<template>
  <div
    class="fixed left-0 top-0 z-50 flex h-screen w-28 items-center"
    @mouseover="inL"
    @mouseleave="inR"
  >
    <div
      class="h-full w-20 bg-gradient-to-r from-[#181818] via-[#181818]/30 to-[#181818]/0 dark:from-white dark:via-white/30 dark:to-white/0"
    ></div>
  </div>
</template>
