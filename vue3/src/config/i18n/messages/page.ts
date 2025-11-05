import type { I18nMessagesSatisfiesType } from '.'
/**
 * i18nMessages 页面相关部分
 */
export const i18nMessagesPagePart = {
  // 路由
  pageHome: {
    'en-US': () => 'Home' as const,
    'zh-CN': () => '首页' as const,
    'zh-TW': () => '首頁' as const,
  },
  pageChat: {
    'en-US': () => 'Chat' as const,
    'zh-CN': () => '全局聊天' as const,
    'zh-TW': () => '全域聊天' as const,
  },
  pageFile: {
    'en-US': () => 'File' as const,
    'zh-CN': () => '文件' as const,
    'zh-TW': () => '文件' as const,
  },
  pageImage: {
    'en-US': () => 'Image' as const,
    'zh-CN': () => '图片' as const,
    'zh-TW': () => '圖片' as const,
  },
  pageSetting: {
    'en-US': () => 'Setting' as const,
    'zh-CN': () => '设置' as const,
    'zh-TW': () => '設定' as const,
  },
  pageNav: {
    'en-US': () => 'Navigation' as const,
    'zh-CN': () => '导航' as const,
    'zh-TW': () => '導航' as const,
  },
  pageLogin: {
    'en-US': () => 'Sign in' as const,
    'zh-CN': () => '登录' as const,
    'zh-TW': () => '登入' as const,
  },
  pageSettingProfile: {
    'en-US': () => 'Profile' as const,
    'zh-CN': () => '个人信息' as const,
    'zh-TW': () => '個人資訊' as const,
  },
} as const satisfies I18nMessagesSatisfiesType
