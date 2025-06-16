import appIcon from '@/assets/logo.png'
import type { I18nLocaleType } from './i18n'
// import appIcon from '@/assets/tweet.png'

export { appIcon }

// 应用名
export const appName = 'PocketTogether'
export const appNameI18n = {
  'en-US': () => 'PocketTogether' as const,
  'zh-CN': () => 'PocketTogether' as const,
  'zh-TW': () => 'PocketTogether' as const,
} as const satisfies Record<I18nLocaleType, unknown>
