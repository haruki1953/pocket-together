import { appNameI18n } from './dependencies'
import type { I18nLocaleType } from './locale'

// 语言内容，写成函数有利于插入可变内容
// 同类的尽量保持开头单词一致有利于参数提示
// as const 使其有完整的字面量类型推导
// satisfies 确保其每一项不会缺少
// 还需要确保每组函数类型是一样的，这个只能自己注意了
export const i18nMessages = {
  appNameI18n,
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
  loginPlaceholderUsername: {
    'en-US': () => 'Please enter username' as const,
    'zh-CN': () => '请输入用户名' as const,
    'zh-TW': () => '請輸入用戶名' as const,
  },
  loginPlaceholderPassword: {
    'en-US': () => 'Please enter password' as const,
    'zh-CN': () => '请输入密码' as const,
    'zh-TW': () => '請輸入密碼' as const,
  },
  loginButtonText: {
    'en-US': () => 'Sign in' as const,
    'zh-CN': () => '登录' as const,
    'zh-TW': () => '登入' as const,
  },
  loginForgetText: {
    'en-US': () => 'Forgot password' as const,
    'zh-CN': () => '忘记密码' as const,
    'zh-TW': () => '忘記密碼' as const,
  },
  loginVisitorText: {
    'en-US': () => 'Visitor Mode' as const,
    'zh-CN': () => '游客模式' as const,
    'zh-TW': () => '遊客模式' as const,
  },
  loginRulesUsernameRequiredMessage: {
    'en-US': () => 'Please enter username' as const,
    'zh-CN': () => '请输入用户名' as const,
    'zh-TW': () => '請輸入用戶名' as const,
  },
  loginRulesUsernamePatternMessage: {
    'en-US': () =>
      'The username must be 1 to 32 characters long and can only contain alphanumeric characters and underscores.' as const,
    'zh-CN': () => '用户名需为1至32位的字符，且只能包含字母数字下划线' as const,
    'zh-TW': () => '用戶名需為1至32位的字符，且只能包含字母數字底線' as const,
  },
  loginRulesPasswordRequiredMessage: {
    'en-US': () => 'Please enter password' as const,
    'zh-CN': () => '请输入密码' as const,
    'zh-TW': () => '請輸入密碼' as const,
  },
  loginRulesPasswordPatternMessage: {
    'en-US': () => 'Password must be at least 8 characters' as const,
    'zh-CN': () => '密码必须至少包含 8 个字符' as const,
    'zh-TW': () => '密碼必須至少包含 8 個字符' as const,
  },
  loginWithOauth2Text: {
    'en-US': (platform: string) => `Sign in with ${platform}` as const,
    'zh-CN': (platform: string) => `使用 ${platform} 登录` as const,
    'zh-TW': (platform: string) => `使用 ${platform} 登入` as const,
  },
  registerPlaceholderEmail: {
    'en-US': () => 'Please enter email' as const,
    'zh-CN': () => '请输入邮箱' as const,
    'zh-TW': () => '請輸入信​​箱' as const,
  },
  registerButtonText: {
    'en-US': () => 'Sign up' as const,
    'zh-CN': () => '注册' as const,
    'zh-TW': () => '註冊' as const,
  },
  registerPlaceholderPasswordConfirm: {
    'en-US': () => 'Please confirm password' as const,
    'zh-CN': () => '请确认密码' as const,
    'zh-TW': () => '請確認密碼' as const,
  },
  registerRulesPasswordConfirmRequiredMessage: {
    'en-US': () => 'Please confirm password' as const,
    'zh-CN': () => '请确认密码' as const,
    'zh-TW': () => '請確認密碼' as const,
  },
  registerRulesPasswordConfirmValidatorMessage: {
    'en-US': () => 'The two passwords you entered do not match.' as const,
    'zh-CN': () => '两次密码输入不一致' as const,
    'zh-TW': () => '兩次密碼輸入不一致' as const,
  },
  registerRulesEmailRequiredMessage: {
    'en-US': () => 'Please enter email' as const,
    'zh-CN': () => '请输入邮箱' as const,
    'zh-TW': () => '請輸入信​​箱' as const,
  },
  registerRulesEmailTypeMessage: {
    'en-US': () => 'Incorrect email address' as const,
    'zh-CN': () => '邮箱地址不正确' as const,
    'zh-TW': () => '信​​箱地址不正確' as const,
  },
} as const satisfies Record<string, Record<I18nLocaleType, unknown>>

// 通过类型体操，获取i18nMessages键的类型
export type I18nMessagesKeyType = keyof typeof i18nMessages

// 将在 src\stores\i18n.ts 使用
// 页面中再使用 i18nStore.t 获取当前语言的内容
