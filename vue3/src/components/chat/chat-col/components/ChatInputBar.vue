<script setup lang="ts">
import {
  pbMessagesSendChatApi,
  type MessagesResponseWidthExpand,
  type PMLRCApiParameters0DataPageParamNonNullable,
} from '@/api'
import { appUserDefaultAvatar, fileUserAvatarConfig } from '@/config'
import { Collections } from '@/lib'
import { pb, type Create } from '@/lib'
import { queryRetryPbNetworkError, useProfileQuery } from '@/queries'
import { useI18nStore, useRealtimeMessagesStore } from '@/stores'
import {
  fetchWithTimeoutPreferred,
  potoMessage,
  watchUntilSourceCondition,
} from '@/utils'
import {
  RiCloseCircleFill,
  RiSendPlane2Fill,
  RiSendPlane2Line,
} from '@remixicon/vue'
import { useMutation } from '@tanstack/vue-query'
import type {
  ChatDisplayDependentDataInitializationChooseType,
  ChatColPageRecoverDataCheckType,
} from './dependencies'

const props = defineProps<{
  /** 房间id，空字符串为全局聊天 */
  roomId: string
  /** 聊天回复定位 */
  chatRoomMessagesReplyPositioningFn: (
    replyMessagePositioningData: PMLRCApiParameters0DataPageParamNonNullable,
    couldReplyPositioningFlagOpen?: boolean
  ) => Promise<void>
  // 各种初始化情况的对应数据，决定使用哪种初始化
  chatDisplayDependentDataInitializationChoose: ChatDisplayDependentDataInitializationChooseType
  // “页面恢复数据”是否正确
  chatColPageRecoverDataCheck: ChatColPageRecoverDataCheckType
}>()

// 聊天输入框内容
const chatInputContent = ref('')

// 回复的消息，将导出给外部组件使用
const chatReplyMessage = ref<MessagesResponseWidthExpand | null>(null)
const chatReplyMessageSet = (val: MessagesResponseWidthExpand | null) => {
  chatReplyMessage.value = val
}

const { chooseInitialization, chatColPageRecoverData } =
  props.chatDisplayDependentDataInitializationChoose

// 输入栏内容 回复消息 初始化
// 根据“页面恢复数据”初始化
if (
  chooseInitialization === 'chatColPageRecoverData' &&
  chatColPageRecoverData != null &&
  // 判断 “页面恢复数据” 是否正确，正确才进行此方式的初始化
  props.chatColPageRecoverDataCheck === true
) {
  chatInputContent.value = chatColPageRecoverData.data.chatInputContent
  chatReplyMessage.value = chatColPageRecoverData.data.chatReplyMessage
}
// 正常的初始化
else {
  // 无
}

defineExpose({
  chatInputContent,
  chatReplyMessage,
  chatReplyMessageSet,
})

// 回复的消息的用户头像
const chatReplyMessageUserAvatarUrl = computed(() => {
  // chatReplyMessage.value == null，此情况不会显示，返回默认头像
  if (chatReplyMessage.value == null) {
    return appUserDefaultAvatar
  }

  // expand.author == null 这是异常（可能pb配置或前端api调用有误），但不抛错了，返回默认头像算了
  if (chatReplyMessage.value.expand.author == null) {
    console.error('props.chatRoomMessagesItem.expand.author == null')
    return appUserDefaultAvatar
  }
  // 无头像，返回默认头像
  if (chatReplyMessage.value.expand.author.avatar === '') {
    return appUserDefaultAvatar
  }
  // 有头像，返回头像url
  return pb.files.getURL(
    chatReplyMessage.value.expand.author,
    chatReplyMessage.value.expand.author.avatar,
    { thumb: fileUserAvatarConfig.thumb200x200f }
  )
})

// 取消回复消息
const chatReplyMessageCancel = () => {
  chatReplyMessage.value = null
}

/** 回复消息定位 */
const replyMessagesPositioningFn = async () => {
  // 无回复消息，直接返回
  if (chatReplyMessage.value == null) {
    return
  }
  await props.chatRoomMessagesReplyPositioningFn(
    {
      id: chatReplyMessage.value.id,
      created: chatReplyMessage.value.created,
    },
    false
  )
}

const profileQuery = useProfileQuery()

const realtimeMessagesStore = useRealtimeMessagesStore()
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
      roomId: props.roomId,
      replyMessageId: chatReplyMessage.value?.id,
    })
    console.log(pbRes)
    return pbRes
  },
  // 一些收尾工作
  onSuccess: (data) => {
    // 发送后重置输入栏
    chatInputContent.value = ''
    // 发送后取消刚刚的回复消息
    chatReplyMessage.value = null
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
    <div class="chat-input-box flow-root bg-color-background-soft pb-1">
      <!-- <div class="m-3 h-16 bg-red-950">输入框</div> -->
      <div class="my-2 flex items-stretch">
        <!-- 左栏 -->
        <div class="ml-2 mr-1 flow-root flex-1 truncate">
          <!-- 回复的消息 -->
          <div v-if="chatReplyMessage != null">
            <div
              class="flex cursor-pointer items-center"
              @click="replyMessagesPositioningFn"
            >
              <!-- 头像 -->
              <div class="ml-[4px] mr-[6px]">
                <div
                  class="h-[20px] w-[20px] rounded-full bg-color-background-soft"
                  :style="{
                    backgroundImage: `url('${chatReplyMessageUserAvatarUrl}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }"
                ></div>
              </div>
              <!-- 内容 -->
              <div class="truncate">
                <div class="select-none truncate text-[12px] text-color-text">
                  {{ chatReplyMessage.content }}
                </div>
              </div>
              <!-- 取消按钮 -->
              <div
                class="flow-root cursor-pointer"
                @click="chatReplyMessageCancel"
              >
                <div class="ml-[6px] mr-[10px] text-color-text">
                  <RiCloseCircleFill size="18px"></RiCloseCircleFill>
                </div>
              </div>
            </div>
          </div>
          <!-- 聊天输入框 -->
          <div class="mt-[1px]">
            <ElInput
              v-model="chatInputContent"
              size="large"
              type="textarea"
              resize="none"
              :rows="1"
              :autosize="{ minRows: 1, maxRows: 10 }"
            />
          </div>
        </div>
        <!-- 右栏 按钮 -->
        <div class="mr-2 flex flex-col-reverse">
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
  // background: linear-gradient(
  //   to bottom,
  //   transparent 0%,
  //   var(--color-background) 12px
  // );
}
.chat-input-box {
  border-radius: 24px 24px 0 0;
  box-shadow: 0 0 6px 6px var(--color-background);
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
