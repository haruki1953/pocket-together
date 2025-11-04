import {
  type MessagesResponseWidthExpand,
  type MessagesResponseWidthExpandReplyMessage,
} from '@/api'
import type { ChatInputBarPropsType } from './dependencies'

// 封装 聊天输入栏数据逻辑
// useChatInputBarData
export const useChatInputBarData = (data: {
  //
  props: ChatInputBarPropsType
}) => {
  const {
    //
    props,
  } = data

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

  return {
    //
    chatInputContent,
    chatReplyMessage,
    chatReplyMessageSet,
    chatEditMessage,
    chatEditMessageSet,
  }
}
export type ChatInputBarDataType = ReturnType<typeof useChatInputBarData>
