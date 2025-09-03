import type { I18nMessagesSatisfiesType } from '.'
/**
 * i18nMessages 聊天页相关部分
 */
export const i18nMessagesChatPart = {
  chatOnTopOrBottomShowMoreText: {
    'en-US': () => 'Load more' as const,
    'zh-CN': () => '加载更多' as const,
    'zh-TW': () => '載入更多' as const,
  },
  chatOnTopOrBottomShowMoreRunningText: {
    'en-US': () => 'Loading' as const,
    'zh-CN': () => '加载中' as const,
    'zh-TW': () => '載入中' as const,
  },
} as const satisfies I18nMessagesSatisfiesType
