<script setup lang="ts">
import {
  pbMessagesEditChatApi,
  pbMessagesSendChatApi,
  type MessagesResponseWidthExpand,
  type MessagesResponseWidthExpandReplyMessage,
  type PMLRCApiParameters0DataPageParamNonNullable,
} from '@/api'
import {
  appUserDefaultAvatar,
  chatInputBarDefaultHeightConfig,
  fileUserAvatarConfig,
} from '@/config'
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
  RiArrowDownLine,
  RiArrowDownLongLine,
  RiAttachmentLine,
  RiCheckFill,
  RiCloseCircleFill,
  RiImageLine,
  RiSendPlane2Fill,
  RiSendPlane2Line,
} from '@remixicon/vue'
import { useMutation } from '@tanstack/vue-query'
import type {
  ChatDisplayDependentDataInitializationChooseType,
  ChatColPageRecoverDataCheckType,
} from './dependencies'
import { ChatTopBarMoreMenuItem } from './dependencies'
import { onClickOutside } from '@vueuse/core'
import type { ElButton } from 'element-plus'
import { useAutoCyclicValue } from '@/composables'

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
  chatBackBottomDisplayable: boolean
  chatBackBottomFn: () => Promise<void>
  chatRoomMessagesRealtimeUnReadNumber: number
}>()

// 封装 聊天输入栏数据逻辑
// useChatInputBarData

// 聊天输入框内容
const chatInputContent = ref('')

// 回复的消息，将导出给外部组件使用
const chatReplyMessage = ref<MessagesResponseWidthExpandReplyMessage | null>(
  null
)
const chatReplyMessageSet = (
  val: MessagesResponseWidthExpandReplyMessage | null
) => {
  chatReplyMessage.value = val
}

// 修改的消息，将导出给外部组件使用
const chatEditMessage = ref<MessagesResponseWidthExpand | null>(null)
const chatEditMessageSet = (val: MessagesResponseWidthExpand | null) => {
  if (val == null) {
    chatEditMessage.value = null
    chatInputContent.value = ''
    chatReplyMessage.value = null
  } else {
    chatEditMessage.value = val
    chatInputContent.value = val.content
    chatReplyMessage.value = val.expand.replyMessage ?? null
  }
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
  chatEditMessage.value = chatColPageRecoverData.data.chatEditMessage
}
// 正常的初始化
else {
  // 无
}

// 封装 聊天输入栏显示逻辑
// useChatInputBarDispaly

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

// 输入栏不同功能判断
// menu 正常状时为 输入栏+菜单按钮
// send 输入文字（或设置回复）后为 输入栏+发送按钮
// edit 编辑 chatEditMessage 不为null时为，输入栏+编辑按钮组
// backTop 距底部距离大于大于一定值后为 回到底部文字+按钮
const chatInputBarFunctionChoose = computed(() => {
  // edit 编辑 chatEditMessage 不为null时为，输入栏+编辑按钮组
  if (chatEditMessage.value != null || messageEditSubmitRunning.value) {
    return 'edit'
  }
  // send 设置回复后，输入文字后，或正处于发送中，为 输入栏+发送按钮
  if (
    chatInputContent.value !== '' ||
    chatReplyMessage.value != null ||
    messageSendSubmitRunning.value
  ) {
    return 'send' as const
  }
  // backTop 底部仍有未显示的消息，或距底部距离大于大于一定值后为 回到底部文字+按钮
  if (props.chatBackBottomDisplayable) {
    return 'backBottom' as const
  }
  // menu 正常状时为 输入栏+菜单按钮
  return 'menu' as const
})

const i18nStore = useI18nStore()

// 实现回到底部和新消息提示循环闪烁显示，间隔 2000ms
const autoCyclicValueToShowNewMessageAndBackBottom = useAutoCyclicValue(
  ['NewMessage', 'BackBottom'] as const,
  2000
)
// 是否有新消息
const isHaveNewMessage = computed(() => {
  if (props.chatRoomMessagesRealtimeUnReadNumber > 0) {
    return true
  }
  return false
})

const isShowMoreMenu = ref(false)
const openMoreMenu = () => {
  isShowMoreMenu.value = true
}
const closeMoreMenu = () => {
  isShowMoreMenu.value = false
}
const toggleShowMoreMenu = () => {
  isShowMoreMenu.value = !isShowMoreMenu.value
}

// 当菜单展开时，点击菜单外部可以关闭菜单
const targetMoreMenu = useTemplateRef<HTMLElement>('targetMoreMenu')
const targetMoreMenuToggleShowButtonEl = useTemplateRef<
  InstanceType<typeof ElButton>
>('targetMoreMenuToggleShowButtonEl')
const targetMoreMenuToggleShowButton = computed(() => {
  if (targetMoreMenuToggleShowButtonEl.value == null) {
    return null
  }
  return targetMoreMenuToggleShowButtonEl.value.$el as HTMLElement
})
onClickOutside(targetMoreMenu, (event) => {
  console.log(event)
  // 菜单未打开，直接返回
  if (targetMoreMenu == null || isShowMoreMenu.value === false) {
    return
  }
  // 点击正好是在菜单开关按钮上，直接返回
  if (
    targetMoreMenuToggleShowButton.value != null &&
    targetMoreMenuToggleShowButton.value?.contains(event.target as Node)
  ) {
    return
  }
  closeMoreMenu()
})

// 封装 聊天输入栏的操作逻辑
// useChatInputBarControl

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
      message: i18nStore.t('chatMessageSendErrorText')(),
    })
  },
  // 此接口非幂等，不重试，避免重复发送
  // // ✅ 在网络错误时重试
  // retry: queryRetryPbNetworkError,
})

const messageSendSubmitRunning = ref(false)
// 消息发送提交
const messageSendSubmit = async () => {
  if (messageSendSubmitRunning.value === true) {
    return
  }
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

// 消息编辑Mutation
const messageEditMutation = useMutation({
  // mutation函数
  mutationFn: async () => {
    // 未登录，抛出错误
    if (!pb.authStore.isValid || pb.authStore.record?.id == null) {
      throw new Error(
        '!pb.authStore.isValid || pb.authStore.record?.id == null'
      )
    }
    // 无chatEditMessage.value，抛出错误
    if (chatEditMessage.value == null) {
      throw new Error('chatEditMessage.value == null')
    }

    // 通过 pocketbase SDK 请求
    const pbRes = await pbMessagesEditChatApi({
      chatEditMessageId: chatEditMessage.value.id,
      content: chatInputContent.value,
      replyMessageId: chatReplyMessage.value?.id,
    })
    console.log(pbRes)
    return pbRes
  },
  // 一些收尾工作
  onSuccess: (data) => {
    // 发送后重置输入栏
    chatEditMessageSet(null)
  },
  // 错误处理
  onError: (error) => {
    potoMessage({
      type: 'error',
      message: i18nStore.t('chatMessageEditErrorText')(),
    })
  },
  // // 此接口幂等，可重试
  // ✅ 在网络错误时重试
  retry: queryRetryPbNetworkError,
})

const messageEditSubmitRunning = ref(false)
// 消息编辑提交
const messageEditSubmit = async () => {
  if (messageEditSubmitRunning.value === true) {
    return
  }
  messageEditSubmitRunning.value = true
  try {
    const resData = await messageEditMutation.mutateAsync()
    // 发送后，仍应等待realtime收到更新情况
    await watchUntilSourceCondition(
      computed(() => {
        const find = realtimeMessagesStore.updateList.find((i) => {
          // 需消息id与updated更新时间才能确认是此次更新
          return i.id === resData.id && i.updated === resData.updated
        })
        return find != null
      }),
      (val) => val === true
    )
  } finally {
    messageEditSubmitRunning.value = false
  }
}

// 消息编辑取消
const messageEditCancel = () => {
  chatEditMessageSet(null)
}

defineExpose({
  chatInputContent,
  chatReplyMessage,
  chatReplyMessageSet,
  chatEditMessage,
  chatEditMessageSet,
})
</script>

<template>
  <div class="chat-input-bar relative flow-root">
    <!-- 展开菜单 -->
    <Transition name="fade-up-down">
      <div
        v-if="isShowMoreMenu"
        ref="targetMoreMenu"
        class="more-menu absolute bottom-0 z-[2] bg-color-background-soft"
      >
        <!-- 收起 -->
        <div
          class="more-menu-close-button flow-root cursor-pointer select-none hover:bg-el-primary-light-4"
          @click="closeMoreMenu"
        >
          <div class="button-box flex items-center justify-center">
            <RiArrowDownWideLine size="20px"></RiArrowDownWideLine>
          </div>
        </div>
        <!-- 菜单项 图片 -->
        <ChatTopBarMoreMenuItem @click="() => {}">
          <template #icon>
            <RiImageLine size="18px"></RiImageLine>
          </template>
          <template #text>
            {{ i18nStore.t('chatInputBarBackMenuImage')() }}
          </template>
        </ChatTopBarMoreMenuItem>
        <!-- 菜单项 文件 -->
        <ChatTopBarMoreMenuItem @click="() => {}">
          <template #icon>
            <RiFolderLine size="18px"></RiFolderLine>
          </template>
          <template #text>
            {{ i18nStore.t('chatInputBarBackMenuFile')() }}
          </template>
        </ChatTopBarMoreMenuItem>
        <!-- 垫片 -->
        <div
          :style="{
            height: `${chatInputBarDefaultHeightConfig}px`,
          }"
        ></div>
      </div>
    </Transition>
    <div
      class="chat-input-box relative z-[3] flow-root bg-color-background-soft pb-1"
    >
      <!-- <div class="m-3 h-16 bg-red-950">输入框</div> -->
      <div class="my-2 flex items-stretch">
        <!-- 左栏 -->
        <div class="ml-2 mr-1 flow-root flex-1 truncate">
          <!-- 回到底部文字，有新消息时与新消息通知循环闪烁显示 -->
          <template v-if="chatInputBarFunctionChoose === 'backBottom'">
            <div class="mr-[4px] flex h-full items-center justify-end">
              <Transition name="fade800ms" mode="out-in">
                <div
                  v-if="
                    isHaveNewMessage &&
                    autoCyclicValueToShowNewMessageAndBackBottom ===
                      'NewMessage'
                  "
                  class="select-none truncate text-[14px] font-bold text-color-text"
                >
                  {{
                    i18nStore.t('chatInputBarNewMessageText')(
                      chatRoomMessagesRealtimeUnReadNumber
                    )
                  }}
                </div>
                <div
                  v-else
                  class="select-none truncate text-[14px] font-bold text-color-text"
                >
                  {{ i18nStore.t('chatInputBarBackBottomText')() }}
                </div>
              </Transition>
            </div>
          </template>
          <!-- 输入框 -->
          <template v-else>
            <!-- 回复的消息 -->
            <div v-if="chatReplyMessage != null">
              <div
                class="flex items-center"
                :class="{
                  'cursor-pointer': !chatReplyMessage.isDeleted,
                  'cursor-not-allowed': chatReplyMessage.isDeleted,
                }"
                @click="
                  () => {
                    if (
                      chatReplyMessage != null &&
                      chatReplyMessage.isDeleted
                    ) {
                      return
                    }
                    replyMessagesPositioningFn()
                  }
                "
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
                  <div
                    v-if="chatReplyMessage.isDeleted"
                    class="select-none truncate text-[12px] text-color-text"
                  >
                    {{
                      i18nStore.t('chatMessageReplyMessageDeletedShowText')()
                    }}
                  </div>
                  <div
                    v-else
                    class="select-none truncate text-[12px] text-color-text"
                  >
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
          </template>
        </div>
        <!-- 右栏 按钮 -->
        <div class="mr-2 flex flex-col-reverse">
          <!-- 编辑按钮组 -->
          <template v-if="chatInputBarFunctionChoose === 'edit'">
            <div class="flex">
              <div>
                <!-- 取消 -->
                <ElButton circle type="info" @click="messageEditCancel">
                  <template #icon>
                    <RiCloseFill></RiCloseFill>
                  </template>
                </ElButton>
              </div>
              <div class="ml-[8px]">
                <!-- 确认 -->
                <ElButton
                  class=""
                  circle
                  type="primary"
                  :loading="messageEditSubmitRunning"
                  :disabled="
                    chatInputContent === '' && !messageEditSubmitRunning
                  "
                  @click="messageEditSubmit"
                >
                  <template #icon>
                    <RiCheckFill></RiCheckFill>
                  </template>
                </ElButton>
              </div>
            </div>
          </template>
          <!-- 发送按钮 -->
          <template v-else-if="chatInputBarFunctionChoose === 'send'">
            <ElButton
              circle
              type="primary"
              :loading="messageSendSubmitRunning"
              :disabled="chatInputContent === '' && !messageSendSubmitRunning"
              @click="messageSendSubmit()"
            >
              <template #icon>
                <RiSendPlane2Fill></RiSendPlane2Fill>
              </template>
            </ElButton>
          </template>
          <!-- 回到底部按钮 -->
          <template v-else-if="chatInputBarFunctionChoose === 'backBottom'">
            <ElButton circle type="info" @click="chatBackBottomFn">
              <template #icon>
                <RiArrowDownLongLine></RiArrowDownLongLine>
              </template>
            </ElButton>
          </template>
          <!-- 菜单按钮 -->
          <template v-else>
            <ElButton
              ref="targetMoreMenuToggleShowButtonEl"
              circle
              type="info"
              @click="toggleShowMoreMenu"
            >
              <template #icon>
                <RiAttachmentLine></RiAttachmentLine>
              </template>
            </ElButton>
          </template>
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

.more-menu {
  border-radius: 24px 24px 0 0;
  box-shadow: 0 0 6px 6px var(--color-background);
  right: 24px;
  max-width: calc(100% - (2 * 24px));
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  overflow-x: hidden;
}

.more-menu-close-button {
  .button-box {
    height: 24px;
  }
}
</style>
