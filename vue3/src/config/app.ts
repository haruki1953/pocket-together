import appLogo from '@/assets/logo.png'
import appUserDefaultAvatar from '@/assets/logo.png'

import type { I18nLocaleType } from './i18n'
// import appLogo from '@/assets/tweet.png'

// 应用logo，用户默认头像
export { appLogo, appUserDefaultAvatar }

// 应用名
export const appName = 'PocketTogether'
export const appNameI18n = {
  'en-US': () => 'PocketTogether' as const,
  'zh-CN': () => 'PocketTogether' as const,
  'zh-TW': () => 'PocketTogether' as const,
} as const satisfies Record<I18nLocaleType, unknown>

/** 聊天页中消息游标分页无限查询，每页消息的数量 */
export const chatRoomMessagesInfiniteQueryPerPageNumberConfig = 40 as const

/** 聊天页滚动处理，收集变动前消息元素的最大数量，一般比分页大小大一点即可，其实更准确的说应该根据显示数量限制的配置来决定 */
export const chatRoomMessagesScrollCaptureElementNumberConfig = 41 as const
/** 聊天页滚动处理，有新的实时消息后，判断聊天滚动贴近底部，根据距底部距离判断，大于此值即不算贴近底部，单位px `100px` */
export const chatRoomMessagesScrollRealtimeIsBottomDistanceConfig = 100 as const

/** 聊天页消息显示数量限制，初始显示的消息数量，一般不超过每页消息数量 */
export const chatRoomMessagesLimitInitShowItemNumberConfig = 30 as const
/** 聊天页消息显示数量限制，每次加载更多消息，增加显示的最多数量，最好根据每页消息数量配置 */
export const chatRoomMessagesLimitLoadMoreMaxItemNumberConfig = 40 as const
/** 聊天页消息显示数量限制，显示消息的最大数量 */
export const chatRoomMessagesLimitShowItemMaxNumberConfig = 80 as const

/** 聊天页加载更多，滚动顶部触发阈值（单位：px） */
export const chatRoomMessagesShowMoreTopThresholdConfig = 10 as const
/** 聊天页加载更多，滚动底部触发阈值（单位：px） */
export const chatRoomMessagesShowMoreBottomThresholdConfig = 10 as const
/** 聊天页加载更多，滚动触发监视间隔控制，单位毫秒 */
export const chatRoomMessagesShowMoreWatchScrollIntervalMsConfig = 100 as const
/** 聊天页加载更多，显示更多处理之前的延迟，单位毫秒 */
export const chatRoomMessagesShowMoreBeforeDelayMsConfig = 100 as const
/** 聊天页加载更多，显示更多处理之后的延迟，单位毫秒 */
export const chatRoomMessagesShowMoreAfterDelayMsConfig = 100 as const

/**
 * 聊天页双向定位查询模式，滚动到定位的消息，距顶部的偏移量（单位：px）
 * scrollToElementInContainer offset
 * 可选的额外偏移量（单位 px），用于在滚动定位基础上进行微调。
 * 目标位置，正值向下偏移，负值向上偏移。
 */
export const chatRoomMessagesTwowayPositioningCursorScrollTopOffsetConfig =
  -200 as const

/**
 * 聊天页 消息合并显示 消息的最大时间差（单位秒）
 * 10分钟
 */
export const chatRoomMessagesDispalyTogetherMaxSecondsConfig = 600 as const

/**
 * 聊天页 双向定位游标 路由查询参数 键统一管理，以便在多处使用
 */
export const chatRoomMessagesTwowayPositioningCursorRouterQueryParametersKeyConfig =
  {
    id: 'id',
    created: 'created',
  } as const

/**
 * 聊天页，消息项的类名命名方法，每个消息根据id有唯一的类名
 */
export const chatRoomMessagesClassIdNamingFnConfig = (messageId: string) => {
  return `chat-message-${messageId}` as const
}

/** 聊天页输入栏，页面滚动距底部距离大于此值时，可以显示回到顶部，单位px */
export const chatRoomMessagesScrollBottomGtThisValueCanBackTopConfig =
  500 as const
