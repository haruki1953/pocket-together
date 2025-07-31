import { appNameI18n } from './dependencies'
import type { I18nLocaleType } from './locale'

// 语言内容，写成函数有利于插入可变内容
// 同类的尽量保持开头单词一致有利于参数提示
// as const 使其有完整的字面量类型推导
// satisfies 确保其每一项不会缺少
// 还需要确保每组函数类型是一样的，这个只能自己注意了
export const i18nMessages = {
  appNameI18n,
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
  // 登录相关
  // loginPlaceholderUsername: {
  //   'en-US': () => 'Please enter username' as const,
  //   'zh-CN': () => '请输入用户名' as const,
  //   'zh-TW': () => '請輸入用戶名' as const,
  // },
  loginPlaceholderUsernameOrEmail: {
    'en-US': () => 'Please enter username or email' as const,
    'zh-CN': () => '请输入用户名或邮箱' as const,
    'zh-TW': () => '請輸入用戶名或信箱' as const,
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
  // loginRulesUsernameRequiredMessage: {
  //   'en-US': () => 'Please enter username' as const,
  //   'zh-CN': () => '请输入用户名' as const,
  //   'zh-TW': () => '請輸入用戶名' as const,
  // },
  // loginRulesUsernamePatternCharMessage: {
  //   'en-US': () => 'Only letters, numbers, and underscores.' as const,
  //   'zh-CN': () => '仅支持字母、数字和下划线。' as const,
  //   'zh-TW': () => '僅支援字母、數字和底線。' as const,
  // },
  // loginRulesUsernamePatternLengthMessage: {
  //   'en-US': () => '1–32 characters.' as const,
  //   'zh-CN': () => '1–32个字符。' as const,
  //   'zh-TW': () => '1–32個字元。' as const,
  // },
  loginRulesUsernameOrEmailRequiredMessage: {
    'en-US': () => 'Please enter username or email' as const,
    'zh-CN': () => '请输入用户名或邮箱' as const,
    'zh-TW': () => '請輸入用戶名或信箱' as const,
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
  loginSuccess: {
    'en-US': () => 'Sign-in complete' as const,
    'zh-CN': () => '登录成功' as const,
    'zh-TW': () => '登入成功' as const,
  },
  loginFailed: {
    'en-US': () => 'Sign-in failed' as const,
    'zh-CN': () => '登录失败' as const,
    'zh-TW': () => '登入失敗' as const,
  },
  loginFailedErrorUnknow: {
    'en-US': () => 'Sign-in failed' as const,
    'zh-CN': () => '登录失败' as const,
    'zh-TW': () => '登入失敗' as const,
  },
  // 注册相关
  registerRulesUsernameRequiredMessage: {
    'en-US': () => 'Please enter username' as const,
    'zh-CN': () => '请输入用户名' as const,
    'zh-TW': () => '請輸入用戶名' as const,
  },
  registerRulesUsernamePatternCharMessage: {
    'en-US': () => 'Only letters, numbers, and underscores.' as const,
    'zh-CN': () => '仅支持字母、数字和下划线。' as const,
    'zh-TW': () => '僅支援字母、數字和底線。' as const,
  },
  registerRulesUsernamePatternLengthMessage: {
    'en-US': () => '1–32 characters.' as const,
    'zh-CN': () => '1–32个字符。' as const,
    'zh-TW': () => '1–32個字元。' as const,
  },
  registerRulesPasswordRequiredMessage: {
    'en-US': () => 'Please enter password' as const,
    'zh-CN': () => '请输入密码' as const,
    'zh-TW': () => '請輸入密碼' as const,
  },
  registerRulesPasswordPatternMessage: {
    'en-US': () => 'Password must be at least 8 characters' as const,
    'zh-CN': () => '密码必须至少包含 8 个字符' as const,
    'zh-TW': () => '密碼必須至少包含 8 個字符' as const,
  },
  registerPlaceholderUsername: {
    'en-US': () => 'Please enter username' as const,
    'zh-CN': () => '请输入用户名' as const,
    'zh-TW': () => '請輸入用戶名' as const,
  },
  registerPlaceholderPassword: {
    'en-US': () => 'Please enter password' as const,
    'zh-CN': () => '请输入密码' as const,
    'zh-TW': () => '請輸入密碼' as const,
  },
  registerPlaceholderEmail: {
    'en-US': () => 'Please enter email' as const,
    'zh-CN': () => '请输入邮箱' as const,
    'zh-TW': () => '請輸入信​​箱' as const,
  },
  registerPlaceholderPasswordConfirm: {
    'en-US': () => 'Please confirm password' as const,
    'zh-CN': () => '请确认密码' as const,
    'zh-TW': () => '請確認密碼' as const,
  },
  registerButtonText: {
    'en-US': () => 'Sign up' as const,
    'zh-CN': () => '注册' as const,
    'zh-TW': () => '註冊' as const,
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
  registerRulesUsernameValidatorNotUnique: {
    'en-US': () => 'Username already exists' as const,
    'zh-CN': () => '用户名已存在' as const,
    'zh-TW': () => '用戶名已存在' as const,
  },
  registerRulesEmailValidatorNotUnique: {
    'en-US': () => 'Email already exists' as const,
    'zh-CN': () => '邮箱已存在' as const,
    'zh-TW': () => '信​​箱已存在' as const,
  },
  registerFailedErrorUnknow: {
    'en-US': () => 'Sign-up failed' as const,
    'zh-CN': () => '注册失败' as const,
    'zh-TW': () => '註冊失敗' as const,
  },
  registerSuccess: {
    'en-US': () => 'Sign-up complete' as const,
    'zh-CN': () => '注册成功' as const,
    'zh-TW': () => '註冊成功' as const,
  },
  // 一些提示的信息
  messageUpdateSuccess: {
    'en-US': () => 'Updated successfully' as const,
    'zh-CN': () => '修改成功' as const,
    'zh-TW': () => '修改成功' as const,
  },
  messageUpdateFailure: {
    'en-US': () => 'Update failed' as const,
    'zh-CN': () => '修改失败' as const,
    'zh-TW': () => '修改失败' as const,
  },
  // 设置页 按钮
  settingButtonSave: {
    'en-US': () => 'Save' as const,
    'zh-CN': () => '保存' as const,
    'zh-TW': () => '保存' as const,
  },
  settingButtonCancel: {
    'en-US': () => 'Cancel' as const,
    'zh-CN': () => '取消' as const,
    'zh-TW': () => '取消' as const,
  },
  settingButtonConfirm: {
    'en-US': () => 'Confirm' as const,
    'zh-CN': () => '确认' as const,
    'zh-TW': () => '確認' as const,
  },
  // 设置页 个人信息 修改名称与简介
  settingProfileUpdateNameBioContentTitle: {
    'en-US': () => 'Edit Name and Bio' as const,
    'zh-CN': () => '修改名称与简介' as const,
    'zh-TW': () => '修改名稱與簡介' as const,
  },
  settingProfileUpdateNameBioNameLabel: {
    'en-US': () => 'Name' as const,
    'zh-CN': () => '名称' as const,
    'zh-TW': () => '名稱' as const,
  },
  settingProfileUpdateNameBioBioLabel: {
    'en-US': () => 'Bio' as const,
    'zh-CN': () => '简介' as const,
    'zh-TW': () => '簡介' as const,
  },
  // 设置页 个人信息 修改用户名
  settingProfileUpdateUsernameContentTitle: {
    'en-US': () => 'Modify Username' as const,
    'zh-CN': () => '修改用户名' as const,
    'zh-TW': () => '修改用戶名' as const,
  },
  settingProfileUpdateUsernameUsernameLable: {
    'en-US': () => 'Username' as const,
    'zh-CN': () => '用户名' as const,
    'zh-TW': () => '用戶名' as const,
  },
  // 设置页 个人信息 修改头像
  settingProfileUpdateAvatarContentTitle: {
    'en-US': () => 'Update Avatar' as const,
    'zh-CN': () => '修改头像' as const,
    'zh-TW': () => '修改頭像' as const,
  },
  // 设置页 个人信息 修改邮箱
  settingProfileUpdateEmailContentTitle: {
    'en-US': () => '' as const,
    'zh-CN': () => '修改邮箱' as const,
    'zh-TW': () => '' as const,
  },
  settingProfileUpdateEmailButtonText: {
    'en-US': () => '' as const,
    'zh-CN': () => '修改邮箱' as const,
    'zh-TW': () => '' as const,
  },
  settingProfileUpdateEmailConfirmContainerTitle: {
    'en-US': () => '' as const,
    'zh-CN': (email: string) => `将向 ${email} 发送邮箱修改邮件` as const,
    'zh-TW': () => '' as const,
  },
} as const satisfies Record<string, Record<I18nLocaleType, unknown>>

// 通过类型体操，获取i18nMessages键的类型
export type I18nMessagesKeyType = keyof typeof i18nMessages

// 将在 src\stores\i18n.ts 使用
// 页面中再使用 i18nStore.t 获取当前语言的内容
