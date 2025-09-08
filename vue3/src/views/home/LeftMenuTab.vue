<script setup lang="ts">
const props = defineProps({
  isMenuOpen: Boolean,
})

const emit = defineEmits(['onLeftMenuDisplay'])
</script>

<template>
  <div class="">
    <button
      class="group/left flex h-16 w-16 items-center justify-center rounded-full bg-gray-300/60 backdrop-blur-none transition-all duration-200 ease-in-out hover:backdrop-blur-sm dark:bg-gray-700/60"
      @click="emit('onLeftMenuDisplay')"
    >
      <i
        class="ri-arrow-right-s-line text-4xl transition-all duration-300 ease-in-out group-active/left:scale-90"
        :class="{ 'rotate-180': props.isMenuOpen }"
      ></i>
    </button>
  </div>
</template>
