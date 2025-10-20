<script setup lang="ts">
import { useDark } from '@vueuse/core'
import type { ElScrollbar } from 'element-plus'

const props = defineProps<{
  dialogVisible: boolean
  dialogCloseFn: () => void
}>()

const refElScrollbar = ref<null | InstanceType<typeof ElScrollbar>>(null)
defineExpose({
  refElScrollbar,
})

const isDark = useDark()
</script>

<template>
  <div class="poto-container-dialog">
    <div
      class="dialog-overlay fixed bottom-0 left-0 right-0 top-0"
      :class="{
        // 明暗主题时的背景色稍有区别
        'bg-color-background-a80': !isDark,
        'bg-color-background-a90': isDark,
      }"
    >
      <ElScrollbar height="100vh">
        <!-- 内容左右距屏幕最小16px -->
        <div class="mx-[16px]">
          <!-- 内容最大宽度500px，居中 -->
          <div
            class="mx-auto"
            :style="{
              'max-width': '500px',
            }"
          >
            <!-- 高度最小为屏幕高度，以实现如果内容高度较小就垂直居中 -->
            <div class="flex min-h-screen items-center">
              <div class="flex-1">
                <!-- 内容上下距屏幕最小32px -->
                <div class="my-[32px]">
                  <!-- 内容插槽 -->
                  <slot></slot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ElScrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dialog-overlay {
  backdrop-filter: blur(15px); /* 模糊背景内容 */
  -webkit-backdrop-filter: blur(15px); /* Safari 支持 */
}
</style>
