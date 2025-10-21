<script setup lang="ts">
import type {
  MessagesResponseWidthExpand,
  PMLRCApiParameters0DataPageParamNonNullable,
} from '@/api'
import { ContainerDialog } from '@/components'
import { useDialogOptimization, useRouteControlDialog } from '@/composables'
import {
  appUserDefaultAvatar,
  chatRoomMessagesTwowayPositioningCursorRouterQueryParametersKeyConfig,
  fileUserAvatarConfig,
} from '@/config'
import { pb } from '@/lib'
import { queryKeys, useChatRoomMessagesGetOneQuery } from '@/queries'
import { useAuthStore, useI18nStore } from '@/stores'
import {
  generateRandomClassName,
  potoGoBack,
  potoNotification,
  urlJoinWithOriginUtil,
  useDateFormatYYYYMMDDHHmmss,
} from '@/utils'
import { useQueryClient } from '@tanstack/vue-query'
import { useClipboard, useWindowSize } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  /** 聊天输入栏正在回复的消息 */
  chatReplyMessage: MessagesResponseWidthExpand | null
  /** 聊天输入栏正在回复的消息，设置值 */
  chatReplyMessageSet: (val: MessagesResponseWidthExpand | null) => void
  /** 聊天回复定位 */
  chatRoomMessagesReplyPositioningFn: (
    replyMessagePositioningData: PMLRCApiParameters0DataPageParamNonNullable
  ) => Promise<void>
}>()

const { dialogVisible, dialogOpen, dialogClose } = useRouteControlDialog({
  dialogQueryKey: 'MessageInfoDialog',
})

// 还是通过普通的ref设置dialogMessageId比较好
const dialogMessageId = ref<string | null>(null)

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
  dialogOpen()
}

defineExpose({
  openMessageInfoDialog,
  dialogClose,
})

// 当前消息数据 useChatRoomMessagesGetOneQuery
const chatRoomMessagesGetOneQuery = useChatRoomMessagesGetOneQuery({
  messageId: computed(() => dialogMessageId.value),
})

// 头像
const messageUserAvatarUrl = computed(() => {
  // 无数据，返回默认头像（其实无数据时根本不会用到头像，返回默认头像是为了使其类型方便）
  if (chatRoomMessagesGetOneQuery.data.value == null) {
    return appUserDefaultAvatar
  }
  // expand.author == null 这是异常（可能pb配置或前端api调用有误），但不抛错了，返回默认头像算了
  if (chatRoomMessagesGetOneQuery.data.value.expand.author == null) {
    console.error(
      'chatRoomMessagesGetOneQuery.data.value.expand.author == null'
    )
    return appUserDefaultAvatar
  }
  // 无头像，返回默认头像
  if (chatRoomMessagesGetOneQuery.data.value.expand.author.avatar === '') {
    return appUserDefaultAvatar
  }
  // 有头像，返回头像url
  return pb.files.getURL(
    chatRoomMessagesGetOneQuery.data.value.expand.author,
    chatRoomMessagesGetOneQuery.data.value.expand.author.avatar,
    { thumb: fileUserAvatarConfig.thumb200x200f }
  )
})

// 名称
const messageUserName = computed(() => {
  // 无数据，返回空字符串
  if (chatRoomMessagesGetOneQuery.data.value == null) {
    return ''
  }
  // expand.author == null 这是异常（可能pb配置或前端api调用有误），但不抛错了，返回空字符串算了
  if (chatRoomMessagesGetOneQuery.data.value.expand.author == null) {
    console.error(
      'chatRoomMessagesGetOneQuery.data.value.expand.author == null'
    )
    return ''
  }
  // 无名称，返回用户名
  if (chatRoomMessagesGetOneQuery.data.value.expand.author.name === '') {
    return chatRoomMessagesGetOneQuery.data.value.expand.author.username
  }
  // 有名称，返回名称
  return chatRoomMessagesGetOneQuery.data.value.expand.author.name
})

// 回复的消息的用户头像
const messageReplyMessageUserAvatarUrl = computed(() => {
  // 无数据，返回默认头像（其实无数据时根本不会用到头像，返回默认头像是为了使其类型方便）
  if (chatRoomMessagesGetOneQuery.data.value == null) {
    return appUserDefaultAvatar
  }

  // expand.author == null 这是异常（可能pb配置或前端api调用有误），但不抛错了，返回默认头像算了
  if (chatRoomMessagesGetOneQuery.data.value.expand.author == null) {
    console.error('props.chatRoomMessagesItem.expand.author == null')
    return appUserDefaultAvatar
  }
  // 无头像，返回默认头像
  if (chatRoomMessagesGetOneQuery.data.value.expand.author.avatar === '') {
    return appUserDefaultAvatar
  }
  // 有头像，返回头像url
  return pb.files.getURL(
    chatRoomMessagesGetOneQuery.data.value.expand.author,
    chatRoomMessagesGetOneQuery.data.value.expand.author.avatar,
    { thumb: fileUserAvatarConfig.thumb200x200f }
  )
})

// 响应式的 pb.authStore
const authStore = useAuthStore()

// 消息是否由当前用户发送
const isMessageSendByCurrentUser = computed(() => {
  // 未登录，直接返回false
  if (!authStore.isValid || authStore.record?.id == null) {
    return false
  }
  // 无消息数据，直接返回false
  if (chatRoomMessagesGetOneQuery.data.value == null) {
    return false
  }
  // author === authStore.record.id 即为当前用户，返回true
  if (chatRoomMessagesGetOneQuery.data.value.author === authStore.record.id) {
    return true
  }
  // 否则返回false
  return false
})

const router = useRouter()
const route = useRoute()

const clipboard = useClipboard()
const i18nStore = useI18nStore()

// 操作按钮 actionButton
/** 复制消息链接 */
const actionButtonCopyMessageLink = async () => {
  // 无数据，是不正常的，返回
  if (chatRoomMessagesGetOneQuery.data.value == null) {
    console.error('chatRoomMessagesGetOneQuery.data.value == null')
    return
  }
  const { id: keyId, created: keyCreated } =
    chatRoomMessagesTwowayPositioningCursorRouterQueryParametersKeyConfig
  // 生成链接但不跳转
  const resolved = router.resolve({
    path: route.path,
    query: {
      [keyId]: chatRoomMessagesGetOneQuery.data.value.id,
      [keyCreated]: chatRoomMessagesGetOneQuery.data.value.created,
    },
  })
  // 拼接网址链接
  const link = urlJoinWithOriginUtil(window.location.origin, resolved.href)
  console.log(link)

  // 浏览支持复制
  if (clipboard.isSupported.value) {
    try {
      await clipboard.copy(link)
      potoNotification({
        type: 'success',
        title: i18nStore.t(
          'chatMessageInfoDialogCopyMessageLinkSuccessTitle'
        )(),
        message: link,
      })
    } catch (error) {
      potoNotification({
        type: 'warning',
        title: i18nStore.t(
          'chatMessageInfoDialogCopyMessageLinkNotSupportedTitle'
        )(),
        message: link,
      })
    }
  }
  // 浏览器不支持复制
  else {
    potoNotification({
      type: 'warning',
      title: i18nStore.t(
        'chatMessageInfoDialogCopyMessageLinkNotSupportedTitle'
      )(),
      message: link,
    })
  }
}
/** 让聊天输入栏回复此消息 */
const actionButtonchatReplyMessageSet = () => {
  // 无数据，是不正常的，返回
  if (chatRoomMessagesGetOneQuery.data.value == null) {
    console.error('chatRoomMessagesGetOneQuery.data.value == null')
    return
  }

  // 设置为回复此消息
  props.chatReplyMessageSet(chatRoomMessagesGetOneQuery.data.value)
  // 设置后关闭对话框
  dialogClose()
}

/** 聊天回复定位 */
const replyMessagesPositioningFn = async () => {
  // 无数据，是不正常的，返回
  if (chatRoomMessagesGetOneQuery.data.value == null) {
    console.error('chatRoomMessagesGetOneQuery.data.value == null')
    return
  }
  // 本消息无回复，直接返回
  if (chatRoomMessagesGetOneQuery.data.value.expand.replyMessage == null) {
    return
  }
  dialogClose()
  await props.chatRoomMessagesReplyPositioningFn({
    id: chatRoomMessagesGetOneQuery.data.value.expand.replyMessage.id,
    created: chatRoomMessagesGetOneQuery.data.value.expand.replyMessage.created,
  })
}
</script>

<template>
  <div>
    <ContainerDialog
      :dialogVisible="dialogVisible"
      :dialogCloseFn="dialogClose"
    >
      <!-- 显示消息数据 -->
      <template v-if="chatRoomMessagesGetOneQuery.data.value != null">
        <!-- 测试 数据显示 -->
        <!-- <div class="wrap-long-text font-mono">
          {{ JSON.stringify(chatRoomMessagesGetOneQuery.data.value, null, 2) }}
        </div> -->

        <!-- 用户信息 + 关闭按钮 -->
        <div class="ml-[15px] flex items-center justify-between">
          <!-- 头像 名称 用户名 -->
          <div class="flex-1 truncate">
            <div class="flex items-center">
              <!-- 头像 -->
              <div
                class="h-[44px] w-[44px] rounded-full border-[2px] border-color-background-soft bg-color-background-soft"
                :style="{
                  backgroundImage: `url('${messageUserAvatarUrl}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }"
              ></div>
              <!-- 名称 用户名 -->
              <div class="flex-1 truncate">
                <div class="ml-[10px]">
                  <div class="truncate font-bold text-color-text">
                    {{ messageUserName }}
                  </div>
                  <div class="truncate text-[12px] text-color-text-soft">
                    @{{
                      chatRoomMessagesGetOneQuery.data.value.expand.author
                        ?.username
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 关闭按钮 -->
          <div class="mx-[10px] cursor-pointer" @click="dialogClose()">
            <RiCloseFill></RiCloseFill>
          </div>
        </div>
        <!-- 消息卡片 -->
        <div class="mt-[10px]">
          <div class="flow-root rounded-[20px] bg-color-background-soft">
            <div class="my-[10px]">
              <!-- 回复的消息 -->
              <div
                v-if="
                  chatRoomMessagesGetOneQuery.data.value.expand.replyMessage !=
                  null
                "
                class="mb-[6px] ml-[10px] mr-[12px]"
              >
                <div
                  class="flex cursor-pointer items-center"
                  @click="replyMessagesPositioningFn"
                >
                  <!-- 头像 -->
                  <div class="ml-[4px] mr-[6px]">
                    <div
                      class="h-[20px] w-[20px] rounded-full bg-color-background-soft"
                      :style="{
                        backgroundImage: `url('${messageReplyMessageUserAvatarUrl}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }"
                    ></div>
                  </div>
                  <!-- 内容 -->
                  <div class="truncate">
                    <div
                      class="select-none truncate text-[12px] text-color-text"
                    >
                      {{
                        chatRoomMessagesGetOneQuery.data.value.expand
                          .replyMessage.content
                      }}
                    </div>
                  </div>
                </div>
              </div>
              <!-- 消息 -->
              <div class="wrap-long-text mx-[15px] text-[16px]">
                {{ chatRoomMessagesGetOneQuery.data.value.content }}
              </div>
              <!-- 时间 -->
              <div class="mx-[15px] mt-[5px] flex items-center justify-end">
                <!-- 已修改图标 是否已修改 -->
                <div
                  v-if="
                    chatRoomMessagesGetOneQuery.data.value.created !==
                    chatRoomMessagesGetOneQuery.data.value.updated
                  "
                  class="mr-[6px] mt-[1px]"
                >
                  <ElTooltip
                    :content="
                      useDateFormatYYYYMMDDHHmmss(
                        chatRoomMessagesGetOneQuery.data.value.updated
                      ).value
                    "
                    placement="top"
                    effect="light"
                  >
                    <div>
                      <RiEditFill
                        size="12px"
                        class="text-color-text-soft"
                      ></RiEditFill>
                    </div>
                  </ElTooltip>
                </div>
                <!-- 时间 -->
                <div class="text-[12px] text-color-text-soft">
                  {{
                    useDateFormatYYYYMMDDHHmmss(
                      chatRoomMessagesGetOneQuery.data.value.created
                    ).value
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 操作按钮 TODO -->
        <div class="mr-[10px] mt-[5px]">
          <div class="flex items-center justify-end">
            <!-- 复制消息链接 -->
            <div
              class="flow-root cursor-pointer transition-colors hover:text-el-primary"
              @click="actionButtonCopyMessageLink"
            >
              <div class="m-[5px]">
                <RiLink size="24px"></RiLink>
              </div>
            </div>
            <!-- 收藏 -->
            <div
              class="flow-root cursor-pointer transition-colors hover:text-el-warning"
            >
              <div class="m-[5px]">
                <RiBookmarkLine size="24px"></RiBookmarkLine>
              </div>
            </div>
            <!-- 回复 -->
            <div
              class="flow-root cursor-pointer transition-colors hover:text-el-success"
              @click="actionButtonchatReplyMessageSet"
            >
              <div class="m-[5px]">
                <RiDiscussLine size="24px"></RiDiscussLine>
              </div>
            </div>
            <template v-if="isMessageSendByCurrentUser">
              <!-- 修改 -->
              <div
                class="flow-root cursor-pointer transition-colors hover:text-el-info"
              >
                <div class="m-[5px]">
                  <RiEditLine size="24px"></RiEditLine>
                </div>
              </div>
              <!-- 删除 -->
              <div
                class="flow-root cursor-pointer transition-colors hover:text-el-danger"
              >
                <div class="m-[5px]">
                  <RiDeleteBin7Line size="24px"></RiDeleteBin7Line>
                </div>
              </div>
            </template>
          </div>
        </div>
        <!-- 垫片，视觉高度调整 -->
        <div class="h-[16px]"></div>
      </template>
      <template v-else>
        <!-- 显示获取中 -->
        <template v-if="chatRoomMessagesGetOneQuery.isFetching.value === true">
          获取中
        </template>
        <!-- 消息不存在 -->
        <template v-else> 消息不存在 </template>
      </template>
    </ContainerDialog>
  </div>
</template>

<style lang="scss" scoped></style>
