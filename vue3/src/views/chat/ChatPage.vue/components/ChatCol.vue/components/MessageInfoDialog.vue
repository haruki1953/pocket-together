<script setup lang="ts">
import { pbMessagesGetOneApi } from '@/api'
import { useDialogOptimization } from '@/composables'
import { queryKeys, useChatRoomMessagesGetOneQuery } from '@/queries'
import { generateRandomClassName } from '@/utils'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useWindowSize } from '@vueuse/core'

// 还是通过普通的ref设置dialogMessageId比较好
const dialogMessageId = ref<string | null>(null)
const dialogVisible = ref(false)

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

const queryClient = useQueryClient()
const openMessageInfoDialog = (
  messageId: string,
  // 支持预填数据
  messageQueryData?: NonNullable<typeof chatRoomMessagesGetOneQuery.data.value>
) => {
  // 预填数据
  if (messageQueryData != null) {
    // 设置数据
    queryClient.setQueryData(
      queryKeys.chatRoomMessagesGetOne(messageQueryData.id),
      // 确保类型正确
      messageQueryData satisfies NonNullable<
        typeof chatRoomMessagesGetOneQuery.data.value
      >
    )
    // // 立即标记为过期，可选。会使打开对话框时再重新请求数据
    // queryClient.invalidateQueries({
    //   queryKey: queryKeys.chatRoomMessagesGetOne(messageQueryData.id),
    // })
  }
  dialogMessageId.value = messageId
  open()
}

defineExpose({
  openMessageInfoDialog,
  close,
})

const chatRoomMessagesGetOneQuery = useChatRoomMessagesGetOneQuery({
  messageId: computed(() => dialogMessageId.value),
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
      <template v-if="chatRoomMessagesGetOneQuery.data.value != null">
        {{ chatRoomMessagesGetOneQuery.data.value }}
      </template>
      <template v-else>
        <template v-if="chatRoomMessagesGetOneQuery.isFetching.value === true">
          获取中
        </template>
        <template v-else> 消息不存在 </template>
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped></style>
