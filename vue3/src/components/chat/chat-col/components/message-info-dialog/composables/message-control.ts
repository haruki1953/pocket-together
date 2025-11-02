import { chatRoomMessagesTwowayPositioningCursorRouterQueryParametersKeyConfig } from '@/config'
import { queryKeys } from '@/queries'
import { useI18nStore } from '@/stores'
import { potoNotification, urlJoinWithOriginUtil } from '@/utils'
import { useQueryClient } from '@tanstack/vue-query'
import { useClipboard } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import type {
  ChatRoomMessagesGetOneQueryType,
  MessageInfoDialogPropsType,
} from './dependencies'

export const useMessageControl = (data: {
  //
  props: MessageInfoDialogPropsType
  chatRoomMessagesGetOneQuery: ChatRoomMessagesGetOneQueryType
  dialogMessageId: Ref<string | null>
  dialogOpen: () => void
  dialogClose: () => void
}) => {
  const {
    //
    props,
    chatRoomMessagesGetOneQuery,
    dialogMessageId,
    dialogOpen,
    dialogClose,
  } = data

  const queryClient = useQueryClient()
  const openMessageInfoDialog = (
    messageId: string,
    // 支持预填数据
    messageQueryData?: NonNullable<
      typeof chatRoomMessagesGetOneQuery.data.value
    >
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
    props.refChatInputBar?.chatReplyMessageSet(
      chatRoomMessagesGetOneQuery.data.value
    )
    // 设置后关闭对话框
    dialogClose()
  }

  /** 让聊天输入栏编辑此消息 */
  const actionButtonchatEditMessageSet = () => {
    // 无数据，是不正常的，返回
    if (chatRoomMessagesGetOneQuery.data.value == null) {
      console.error('chatRoomMessagesGetOneQuery.data.value == null')
      return
    }

    // 设置为编辑此消息
    props.refChatInputBar?.chatEditMessageSet(
      chatRoomMessagesGetOneQuery.data.value
    )
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
      created:
        chatRoomMessagesGetOneQuery.data.value.expand.replyMessage.created,
    })
  }

  /**
   * 是否应显示回复按钮。
   * - 当正在修改一个消息时，不能回复此消息。
   * - 当正在修改一个消息时，不能回复发送时间比自己大的（避免循环回复）
   */
  const shouldShowActionButtonchatReplyMessageSet = computed(() => {
    // 无数据，是不正常的，返回 true 即默认显示
    if (chatRoomMessagesGetOneQuery.data.value == null) {
      console.error('chatRoomMessagesGetOneQuery.data.value == null')
      return
    }
    // 无输入栏的引用是不正常的，返回 true 即默认显示
    if (props.refChatInputBar == null) {
      return true
    }
    const chatEditMessage = props.refChatInputBar.chatEditMessage
    // 无chatEditMessage，返回true
    if (chatEditMessage == null) {
      return true
    }
    // 当正在修改一个消息时，不能回复此消息。
    if (chatEditMessage.id === chatRoomMessagesGetOneQuery.data.value.id) {
      return false
    }
    // 当正在修改一个消息时，不能回复发送时间比自己大的（避免循环回复）
    if (
      chatEditMessage.created <= chatRoomMessagesGetOneQuery.data.value.created
    ) {
      return false
    }
    // 返回 true 即默认显示
    return true
  })

  return {
    //
    openMessageInfoDialog,
    actionButtonCopyMessageLink,
    actionButtonchatReplyMessageSet,
    actionButtonchatEditMessageSet,
    replyMessagesPositioningFn,
    shouldShowActionButtonchatReplyMessageSet,
  }
}
