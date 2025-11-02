import { appUserDefaultAvatar, fileUserAvatarConfig } from '@/config'
import { pb } from '@/lib'
import { useChatRoomMessagesGetOneQuery } from '@/queries'
import { useAuthStore } from '@/stores'
import type { MessageInfoDialogPropsType } from './dependencies'

export const useMessageDispaly = (data: {
  //
  props: MessageInfoDialogPropsType
}) => {
  const {
    //
    props,
  } = data

  // 还是通过普通的ref设置dialogMessageId比较好
  const dialogMessageId = ref<string | null>(null)

  // dialogMessageId 初始化
  const { chooseInitialization, chatColPageRecoverData } =
    props.chatDisplayDependentDataInitializationChoose
  // 根据“页面恢复数据”初始化
  if (
    chooseInitialization === 'chatColPageRecoverData' &&
    chatColPageRecoverData != null &&
    // 判断 “页面恢复数据” 是否正确，正确才进行此方式的初始化
    props.chatColPageRecoverDataCheck === true
  ) {
    dialogMessageId.value = chatColPageRecoverData.data.dialogMessageId
  }
  // 正常的初始化
  else {
    // 无
  }

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
    if (
      chatRoomMessagesGetOneQuery.data.value.expand.replyMessage?.expand
        .author == null
    ) {
      console.error('props.chatRoomMessagesItem.expand.author == null')
      return appUserDefaultAvatar
    }
    // 无头像，返回默认头像
    if (
      chatRoomMessagesGetOneQuery.data.value.expand.replyMessage.expand.author
        .avatar === ''
    ) {
      return appUserDefaultAvatar
    }
    // 有头像，返回头像url
    return pb.files.getURL(
      chatRoomMessagesGetOneQuery.data.value.expand.replyMessage.expand.author,
      chatRoomMessagesGetOneQuery.data.value.expand.replyMessage.expand.author
        .avatar,
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

  return {
    //
    dialogMessageId,
    chatRoomMessagesGetOneQuery,
    messageUserAvatarUrl,
    messageUserName,
    messageReplyMessageUserAvatarUrl,
    isMessageSendByCurrentUser,
  }
}
