import type { I18nMessagesSatisfiesType } from '.'
/**
 * i18nMessages 登录相关部分
 */
export const i18nMessagesLoginPart = {
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
    'zh-CN': () => '登 录' as const,
    'zh-TW': () => '登 入' as const,
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
  // 忘记密码
  loginForgotPasswordContentTitle: {
    'en-US': () => 'Forgot password' as const,
    'zh-CN': () => '忘记密码' as const,
    'zh-TW': () => '忘記密碼' as const,
  },
  loginForgotPasswordRulesEmailRequiredMessage: {
    'en-US': () => 'Please enter email' as const,
    'zh-CN': () => '请输入邮箱' as const,
    'zh-TW': () => '請輸入信​​箱' as const,
  },
  loginForgotPasswordRulesEmailTypeMessage: {
    'en-US': () => 'Incorrect email format' as const,
    'zh-CN': () => '邮箱格式不正确' as const,
    'zh-TW': () => '信​​箱格式不正確' as const,
  },
  loginForgotPasswordConfirmContainerTitle: {
    'en-US': (email: string) =>
      `A password reset link will be sent to ${email}` as const,
    'zh-CN': (email: string) => `密码重置链接将发送至 ${email}` as const,
    'zh-TW': (email: string) => `密碼重置連結將發送至 ${email}` as const,
  },
  loginForgotPasswordEmailLable: {
    'en-US': () => 'Email' as const,
    'zh-CN': () => '邮箱' as const,
    'zh-TW': () => '信箱' as const,
  },
  loginForgotPasswordPlaceholderEmail: {
    'en-US': () => 'Please enter email' as const,
    'zh-CN': () => '请输入邮箱' as const,
    'zh-TW': () => '請輸入信箱' as const,
  },
  loginForgotPasswordButtonSubmitText: {
    'en-US': () => 'Reset Password' as const,
    'zh-CN': () => '重置密码' as const,
    'zh-TW': () => '重設密碼' as const,
  },
  loginForgotPasswordRetryAfterDuration: {
    'en-US': (duration: string) => `Retry after ${duration}` as const,
    'zh-CN': (duration: string) => `${duration}后可重试` as const,
    'zh-TW': (duration: string) => `${duration}後可重試` as const,
  },
} as const satisfies I18nMessagesSatisfiesType
