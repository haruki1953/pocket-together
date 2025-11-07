import appLogo from '@/assets/logo.jpg'
import appUserDefaultAvatar from '@/assets/logo.jpg'

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
