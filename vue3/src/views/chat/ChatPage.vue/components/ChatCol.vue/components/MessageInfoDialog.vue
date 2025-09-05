<script setup lang="ts">
import { useDialogOptimization } from '@/composables'
import { generateRandomClassName } from '@/utils'
import { useWindowSize } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// URL查询参数，将查看的消息的id，将控制对话框的显示
const dialogMessageId = computed(() => {
  const queryDialogMessageId = route.query['dialogMessageId']
  if (queryDialogMessageId == null) {
    return null
  }
  if (typeof queryDialogMessageId === 'string') {
    return queryDialogMessageId
  }
  if (queryDialogMessageId.length > 0) {
    if (queryDialogMessageId[0] != null) {
      return queryDialogMessageId[0]
    }
  }
  return null
})

const dialogVisible = ref(false)

const closeRunning = ref(false)

watch(
  dialogMessageId,
  () => {
    if (closeRunning.value === true) {
      return
    }
    if (dialogMessageId.value != null) {
      dialogVisible.value = true
    }
  },
  {
    immediate: true,
  }
)

const key = 'dialogMessageId'

watch(dialogVisible, async () => {
  if (dialogVisible.value === false) {
    if (closeRunning.value === true) {
      return
    }
    closeRunning.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
      router.replace({
        path: route.path,
        query: {
          ...route.query,
          // 【动态键名】动态设置 query 参数的 key 为 dialogMessageId
          [key]: undefined,
        },
      })
    } finally {
      closeRunning.value = false
    }
  }
})

// const dialogVisible = computed(() => {
//   if (dialogMessageId.value == null) {
//     return false
//   }
//   return true
// })

const windowSize = useWindowSize()
const dialogWidth = computed(() => {
  const width = 500
  const windowWidth = windowSize.width.value
  return windowWidth * 0.9 < width ? '90%' : width
})

// 自定义遮罩类名，随机生成
const overlayClass = generateRandomClassName()
// 对话框优化
const { open, close } = useDialogOptimization({
  dialogVisible,
  overlayClass,
})
</script>

<template>
  <div>
    <ElDialog
      v-model="dialogVisible"
      :width="dialogWidth"
      :lockScroll="false"
      appendToBody
      :modalClass="overlayClass"
    >
      <div>
        {{ dialogMessageId }}
      </div>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped></style>
