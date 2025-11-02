<script setup lang="ts">
import { useRouteControlDialog } from '@/composables'
import { useI18nStore, useRealtimeMessagesStore } from '@/stores'
import { ContainerDialog } from '@/components'
import { useMutation } from '@tanstack/vue-query'
import { pb } from '@/lib'
import { pbMessagesDeleteChatApi } from '@/api'
import { potoMessage, watchUntilSourceCondition } from '@/utils'

const props = defineProps<{
  dialogMessageId: string | null
  messageInfoDialogClose: () => void
}>()

const i18nStore = useI18nStore()

const { dialogVisible, dialogOpen, dialogClose } = useRouteControlDialog({
  dialogQueryKey: 'MessageDeleteDialog',
})

// 消息删除Mutation
const messageDeleteMutation = useMutation({
  // mutation函数
  mutationFn: async () => {
    // 未登录，抛出错误
    if (!pb.authStore.isValid || pb.authStore.record?.id == null) {
      throw new Error(
        '!pb.authStore.isValid || pb.authStore.record?.id == null'
      )
    }
    // 无 dialogMessageId，抛出错误
    if (props.dialogMessageId == null) {
      throw new Error('props.dialogMessageId == null')
    }

    // 通过 pocketbase SDK 请求
    const pbRes = await pbMessagesDeleteChatApi({
      messageId: props.dialogMessageId,
    })
    console.log(pbRes)
    return pbRes
  },
  // 一些收尾工作
  onSuccess: (data) => {
    //
  },
  // 错误处理
  onError: (error) => {
    potoMessage({
      type: 'error',
      message: '删除失败',
    })
  },
  // 此接口非幂等，不重试
  // // ✅ 在网络错误时重试
  // retry: queryRetryPbNetworkError,
})

const realtimeMessagesStore = useRealtimeMessagesStore()

const messageDeleteSubmitRunning = ref(false)
const messageDeleteSubmit = async () => {
  if (messageDeleteSubmitRunning.value === true) {
    return
  }
  messageDeleteSubmitRunning.value = true
  try {
    const messageId = props.dialogMessageId
    await messageDeleteMutation.mutateAsync()
    // 发送请求后，仍应等待realtime收到删除情况
    await watchUntilSourceCondition(
      computed(
        () =>
          realtimeMessagesStore.deleteList.find((i) => i.id === messageId) !=
          null
      ),
      (val) => val === true
    )
    // 关闭对话框
    dialogClose()
    props.messageInfoDialogClose()
  } finally {
    messageDeleteSubmitRunning.value = false
  }
}

defineExpose({
  dialogVisible,
  dialogOpen,
  dialogClose,
})
</script>

<template>
  <div>
    <ContainerDialog
      :dialogVisible="dialogVisible"
      :dialogCloseFn="dialogClose"
      :overlayBlur="false"
      :overlayTranslucent="false"
    >
      <div
        class="content-box flow-root rounded-[20px] bg-color-background-soft"
      >
        <div class="m-[20px]">
          <div class="mb-[10px]">
            <div class="text-center text-[14px] font-bold text-color-text-soft">
              <!--  -->
              确认要删除此消息吗？
            </div>
          </div>
          <div class="flex justify-center">
            <!-- “确认”按钮 -->
            <ElButton
              type="danger"
              round
              :loading="messageDeleteSubmitRunning"
              size="small"
              @click="messageDeleteSubmit"
            >
              {{ i18nStore.t('settingButtonConfirm')() }}
            </ElButton>
            <!-- “取消”按钮 -->
            <ElButton type="info" round size="small" @click="dialogClose">
              {{ i18nStore.t('settingButtonCancel')() }}
            </ElButton>
          </div>
        </div>
      </div>
    </ContainerDialog>
  </div>
</template>

<style lang="scss" scoped>
.content-box {
  // box-shadow: 0 0 6px 6px var(--color-background);
}
</style>
