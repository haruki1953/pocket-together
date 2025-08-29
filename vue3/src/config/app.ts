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
export const chatRoomMessagesInfiniteQueryPerPageNumberConfig = 30 as const
/** 聊天页滚动处理，收集变动前消息元素的最大数量，一般比分页大小大一点即可，其实更准确的说应该根据显示数量限制的配置来决定 */
export const chatRoomMessagesScrollCaptureElementNumberConfig = 40 as const
/** 聊天页滚动处理，有新的实时消息后，判断聊天滚动贴近底部，根据距底部距离判断，大于此值即不算贴近底部，单位px `10px` */
export const chatRoomMessagesScrollRealtimeIsBottomDistance = 10 as const

/**
 * 聊天页 消息合并显示 消息的最大时间差（单位秒）
 * 10分钟
 */
export const chatRoomMessagesDispalyTogetherMaxSecondsConfig = 600 as const
