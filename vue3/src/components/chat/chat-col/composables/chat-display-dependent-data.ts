// 这些数据有点乱，进行封装，定义 与 初始化，分开

import type { PMLRCApiParameters0DataPageParamNonNullable } from '@/api'
import { chatRoomMessagesTwowayPositioningCursorRouterQueryParametersKeyConfig } from '@/config'
import { useRoute, useRouter } from 'vue-router'
import type { ChatRoomMessagesInfiniteTwowayQueryType } from './dependencies'

// 定义
// 封装：
// 定位游标数据、链接定位标记、回复定位标记 、……
// 等聊天显示所依赖的数据 的定义与配套方法
// 聊天显示所依赖的数据 ChatDisplayDependentData chat-display-dependent-data

// 聊天显示所依赖的数据 的定义与配套方法
export const useChatDisplayDependentDataDefinition = () => {
  /** 双向定位无限查询的定位游标数据 */
  const twowayPositioningCursorData =
    ref<PMLRCApiParameters0DataPageParamNonNullable | null>(null)

  // 链接定位标记，如果消息id等于此，将显示链接标记
  const linkPositioningFlagMessageId = ref<string | null>(null)
  // 控制链接标记是否显示，消息被点击会使其不显示
  const linkPositioningFlagShow = ref(false)
  const linkPositioningFlagClose = () => {
    linkPositioningFlagShow.value = false
  }

  // 回复定位标记
  const replyPositioningFlagMessageId = ref<string | null>(null)
  const replyPositioningFlagShow = ref(false)
  const replyPositioningFlagClose = () => {
    replyPositioningFlagShow.value = false
  }
  const replyPositioningFlagOpen = (messageId: string) => {
    replyPositioningFlagMessageId.value = messageId
    replyPositioningFlagShow.value = true
  }

  /** 重置双向定位无限查询的定位游标数据和相关数据 */
  const resetPositioningCursorDataAndRelatedData = () => {
    twowayPositioningCursorData.value = null
    linkPositioningFlagMessageId.value = null
    linkPositioningFlagShow.value = false
    replyPositioningFlagMessageId.value = null
    replyPositioningFlagShow.value = false
  }

  return {
    //
    twowayPositioningCursorData,
    linkPositioningFlagMessageId,
    linkPositioningFlagShow,
    linkPositioningFlagClose,
    replyPositioningFlagMessageId,
    replyPositioningFlagShow,
    replyPositioningFlagClose,
    replyPositioningFlagOpen,
    resetPositioningCursorDataAndRelatedData,
  }
}

// 初始化
// 首先初始化 twowayPositioningCursorData ，其他数据的初始化要等到得到 chatRoomMessagesInfiniteTwowayQuery（c33y） 之后
// 需要先初始化twowayPositioningCursorData是因为chatRoomMessagesInfiniteTwowayQuery依赖这个
// 其他数据的初始化要在c33y之后，是因为要需要有c33y来判断“页面恢复数据”是否正确

// 获取各种初始化情况的对应数据
export const useChatDisplayDependentDataInitializationChoose = () => {
  const route = useRoute()

  // 根据路由参数初始化
  const routeQueryPositioningCursorData = (() => {
    const { id: keyId, created: keyCreated } =
      chatRoomMessagesTwowayPositioningCursorRouterQueryParametersKeyConfig
    const id = route.query[keyId]
    const created = route.query[keyCreated]
    if (
      id == null ||
      created == null ||
      typeof id !== 'string' ||
      typeof created !== 'string'
    ) {
      return null
    }
    return {
      id,
      created,
    }
  })()

  // TODO RouterHistoryStore页面恢复数据初始化

  return {
    routeQueryPositioningCursorData,
  }
}

// twowayPositioningCursorData 的初始化
export const useTwowayPositioningCursorDataInitialization = (data: {
  chatDisplayDependentDataInitializationChoose: ReturnType<
    typeof useChatDisplayDependentDataInitializationChoose
  >
  twowayPositioningCursorData: Ref<PMLRCApiParameters0DataPageParamNonNullable | null>
}) => {
  const {
    twowayPositioningCursorData,
    chatDisplayDependentDataInitializationChoose,
  } = data

  const route = useRoute()
  const router = useRouter()

  const { routeQueryPositioningCursorData } =
    chatDisplayDependentDataInitializationChoose

  // 根据路由参数初始化
  // 设置路由定位数据
  if (routeQueryPositioningCursorData != null) {
    twowayPositioningCursorData.value = routeQueryPositioningCursorData
  }
  // 清除路由中的查询参数
  router.replace(route.path)

  // TODO 根据RouterHistoryStore页面恢复数据初始化
}

// 聊天显示所依赖的数据 的初始化（除twowayPositioningCursorData外）
export const useChatDisplayDependentDataInitialization = (data: {
  chatRoomMessagesInfiniteTwowayQuery: ChatRoomMessagesInfiniteTwowayQueryType
  chatDisplayDependentDataInitializationChoose: ReturnType<
    typeof useChatDisplayDependentDataInitializationChoose
  >
  linkPositioningFlagMessageId: Ref<string | null>
  linkPositioningFlagShow: Ref<boolean>
}) => {
  const {
    chatRoomMessagesInfiniteTwowayQuery,
    chatDisplayDependentDataInitializationChoose,
    linkPositioningFlagMessageId,
    linkPositioningFlagShow,
  } = data

  const { routeQueryPositioningCursorData } =
    chatDisplayDependentDataInitializationChoose

  // TODO
  // routeQueryPositioningCursorData chatRoomMessagesInfiniteTwowayQuery
  // 判断 “页面恢复数据” 是否正确

  if (routeQueryPositioningCursorData != null) {
    linkPositioningFlagMessageId.value = routeQueryPositioningCursorData.id
    linkPositioningFlagShow.value = true
  }
}
