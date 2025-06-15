import type { I18nLocaleType } from './locale'

// 语言内容，写成函数有利于插入可变内容
// 同类的尽量保持开头单词一致有利于参数提示
// as const 使其有完整的字面量类型推导
// satisfies 确保其每一项不会缺少
// 还需要确保每组函数类型是一样的，这个只能自己注意了
export const i18nMessages = {
  pageHome: {
    'en-US': () => 'home' as const,
    'zh-CN': () => '首页' as const,
    'zh-TW': () => '首頁' as const,
  },
  pageChat: {
    'en-US': () => 'chat' as const,
    'zh-CN': () => '全局聊天' as const,
    'zh-TW': () => '全域聊天' as const,
  },
  pageFile: {
    'en-US': () => 'file' as const,
    'zh-CN': () => '文件' as const,
    'zh-TW': () => '文件' as const,
  },
  pageSetting: {
    'en-US': () => 'setting' as const,
    'zh-CN': () => '设置' as const,
    'zh-TW': () => '設定' as const,
  },
  pageNav: {
    'en-US': () => 'navigation' as const,
    'zh-CN': () => '导航' as const,
    'zh-TW': () => '導航' as const,
  },
  pageLogin: {
    'en-US': () => 'login' as const,
    'zh-CN': () => '登录' as const,
    'zh-TW': () => '登入' as const,
  },
} as const satisfies Record<string, Record<I18nLocaleType, unknown>>

// 通过类型体操，获取i18nMessages键的类型
export type I18nMessagesKeyType = keyof typeof i18nMessages

// 将在 src\stores\i18n.ts 使用
// 页面中再使用 i18nStore.t 获取当前语言的内容
