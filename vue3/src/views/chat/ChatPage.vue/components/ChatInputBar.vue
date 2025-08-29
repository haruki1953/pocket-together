<script setup lang="ts">
import { pbMessagesSendChatApi } from '@/api'
import { Collections } from '@/lib'
import { pb, type Create } from '@/lib'
import { queryRetryPbNetworkError, useProfileQuery } from '@/queries'
import { useI18nStore, useRealtimeMessagesStore } from '@/stores'
import {
  fetchWithTimeoutPreferred,
  potoMessage,
  watchUntilSourceCondition,
} from '@/utils'
import { RiSendPlane2Fill, RiSendPlane2Line } from '@remixicon/vue'
import { useMutation } from '@tanstack/vue-query'

const chatInputContent = ref('')

const profileQuery = useProfileQuery()

// 消息发送Mutation
const messageSendMutation = useMutation({
  // mutation函数
  mutationFn: async () => {
    // 未登录，抛出错误
    if (!pb.authStore.isValid || pb.authStore.record?.id == null) {
      throw new Error(
        '!pb.authStore.isValid || pb.authStore.record?.id == null'
      )
    }

    // 通过 pocketbase SDK 请求
    const pbRes = await pbMessagesSendChatApi({
      content: chatInputContent.value,
    })
    console.log(pbRes)
    return pbRes
  },
  // 一些收尾工作
  onSuccess: (data) => {
    chatInputContent.value = ''
  },
  // 错误处理
  onError: (error) => {
    potoMessage({
      type: 'error',
      message: '发送失败',
    })
  },
  // ✅ 在网络错误时重试
  retry: queryRetryPbNetworkError,
})

const realtimeMessagesStore = useRealtimeMessagesStore()

const messageSendSubmitRunning = ref(false)
// 消息发送提交
const messageSendSubmit = async () => {
  messageSendSubmitRunning.value = true
  try {
    const resData = await messageSendMutation.mutateAsync()
    // 发送后，仍应等待realtime收到自己发的消息
    await watchUntilSourceCondition(
      computed(
        () =>
          realtimeMessagesStore.createList.find((i) => i.id === resData.id) !=
          null
      ),
      (val) => val === true
    )
  } finally {
    messageSendSubmitRunning.value = false
  }
}
</script>

<template>
  <div class="chat-input-bar flow-root">
    <div
      class="chat-input-box mb-3 mt-3 flow-root rounded-3xl bg-color-background-soft"
    >
      <!-- <div class="m-3 h-16 bg-red-950">输入框</div> -->
      <div class="my-2 flex items-center">
        <!-- 输入框 -->
        <div class="ml-2 mr-1 flex-1">
          <ElInput
            v-model="chatInputContent"
            size="large"
            type="textarea"
            resize="none"
            :rows="1"
            :autosize="{ minRows: 1, maxRows: 10 }"
          />
        </div>
        <!-- 按钮 -->
        <div class="mr-2">
          <ElButton
            circle
            type="primary"
            :loading="messageSendSubmitRunning"
            @click="messageSendSubmit()"
          >
            <template #icon>
              <RiSendPlane2Fill></RiSendPlane2Fill>
            </template>
          </ElButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-input-bar {
  // 背景色 --color-background
  // 渐变，透明
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--color-background) 12px
  );
}
.chat-input-box {
  :deep() {
    .el-textarea__inner {
      // color: var(--color-text);
      // font-weight: bold;
      border: none;
      box-shadow: none;
      background-color: transparent;
      // transition:
      //   background-color 0.5s,
      //   color 0.2s;
      color: var(--color-text);
      // font-weight: bold;
      // font-size: 16px;
      // 防止目标区域中的滚动触发父元素中的滚动
      overscroll-behavior: contain;
    }
    // .el-input__wrapper {
    //   background-color: var(--color-background-soft);
    //   transition: all 0.5s;
    //   box-shadow: none;
    //   &:hover {
    //     box-shadow: none;
    //   }
    //   .el-input__inner {
    //     color: var(--color-text);
    //     transition: all 0.2s;
    //     font-weight: bold;
    //     // text-align: center;
    //   }
    // }
  }
}
</style>
