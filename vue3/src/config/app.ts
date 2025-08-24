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

/**
 * 聊天页 消息合并显示 消息的最大时间差（单位秒）
 * 10分钟
 */
export const chatRoomMessagesDispalyTogetherMaxSecondsConfig = 600 as const
