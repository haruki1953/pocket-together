import type { I18nMessagesSatisfiesType } from './dependencies'
/**
 * i18nMessagesSettingPart 个人信息相关部分
 */
export const i18nMessagesSettingPartProfilePart = {
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
  settingProfileUpdateAvatarDialogTitle: {
    'en-US': () => 'Crop Avatar' as const,
    'zh-CN': () => '裁剪头像' as const,
    'zh-TW': () => '裁剪頭像' as const,
  },
  settingProfileUpdateAvatarDialogCancelButton: {
    'en-US': () => 'Cancel' as const,
    'zh-CN': () => '取消' as const,
    'zh-TW': () => '取消' as const,
  },
  settingProfileUpdateAvatarDialogCropButton: {
    'en-US': () => 'Crop' as const,
    'zh-CN': () => '裁剪' as const,
    'zh-TW': () => '裁剪' as const,
  },
  // 设置页 个人信息 修改邮箱
  settingProfileUpdateEmailContentTitle: {
    'en-US': () => 'Update Email' as const,
    'zh-CN': () => '修改邮箱' as const,
    'zh-TW': () => '修改信箱' as const,
  },
  settingProfileUpdateEmailConfirmContainerTitle: {
    'en-US': (email: string) =>
      `A verification email will be sent to ${email}` as const,
    'zh-CN': (email: string) => `将向 ${email} 发送验证邮件` as const,
    'zh-TW': (email: string) => `將向 ${email} 發送驗證信` as const,
  },
  settingProfileUpdateEmailEmailLable: {
    'en-US': () => 'Email' as const,
    'zh-CN': () => '邮箱' as const,
    'zh-TW': () => '信箱' as const,
  },
  settingProfileUpdateEmailPendingVerificationText: {
    'en-US': () => 'Pending verification' as const,
    'zh-CN': () => '待验证' as const,
    'zh-TW': () => '待驗證' as const,
  },
  settingProfileUpdateEmailVerifiedText: {
    'en-US': () => 'Verified' as const,
    'zh-CN': () => '已验证' as const,
    'zh-TW': () => '已驗證' as const,
  },
  settingProfileUpdateEmailRetryAfterDuration: {
    'en-US': (duration: string) => `Retry after ${duration}` as const,
    'zh-CN': (duration: string) => `${duration}后可重试` as const,
    'zh-TW': (duration: string) => `${duration}後可重試` as const,
  },
  // 设置页 个人信息 验证邮箱
  settingProfileVerifyEmailContentTitle: {
    'en-US': () => 'Verify Email' as const,
    'zh-CN': () => '验证邮箱' as const,
    'zh-TW': () => '驗證信箱' as const,
  },
  settingProfileVerifyEmailVerifiedText: {
    'en-US': () => 'Verified' as const,
    'zh-CN': () => '已验证' as const,
    'zh-TW': () => '已驗證' as const,
  },
  settingProfileVerifyEmailUnverifiedText: {
    'en-US': () => 'Unverified' as const,
    'zh-CN': () => '未验证' as const,
    'zh-TW': () => '未驗證' as const,
  },
  settingProfileVerifyEmailPendingVerificationText: {
    'en-US': () => 'Pending verification' as const,
    'zh-CN': () => '待验证' as const,
    'zh-TW': () => '待驗證' as const,
  },
  settingProfileVerifyEmailButtonSubmitText: {
    'en-US': () => 'Verify Email' as const,
    'zh-CN': () => '验证邮箱' as const,
    'zh-TW': () => '驗證信箱' as const,
  },
  settingProfileVerifyEmailConfirmContainerTitle: {
    'en-US': (email: string) =>
      `A verification email will be sent to ${email}` as const,
    'zh-CN': (email: string) => `将向 ${email} 发送验证邮件` as const,
    'zh-TW': (email: string) => `將向 ${email} 發送驗證信` as const,
  },
  settingProfileVerifyEmailRetryAfterDuration: {
    'en-US': (duration: string) => `Retry after ${duration}` as const,
    'zh-CN': (duration: string) => `${duration}后可重试` as const,
    'zh-TW': (duration: string) => `${duration}後可重試` as const,
  },
  // 设置页 个人信息 修改密码
  settingProfileUpdatePasswordContentTitle: {
    'en-US': () => 'Modify Password' as const,
    'zh-CN': () => '修改密码' as const,
    'zh-TW': () => '修改密碼' as const,
  },
  settingProfileUpdatePasswordConfirmContainerTitle: {
    'en-US': (email: string) =>
      `A password reset link will be sent to ${email}` as const,
    'zh-CN': (email: string) => `密码重置链接将发送至 ${email}` as const,
    'zh-TW': (email: string) => `密碼重置連結將發送至 ${email}` as const,
  },
  settingProfileUpdatePasswordButtonSubmitText: {
    'en-US': () => 'Modify Password' as const,
    'zh-CN': () => '修改密码' as const,
    'zh-TW': () => '修改密碼' as const,
  },
  settingProfileUpdatePasswordRetryAfterDuration: {
    'en-US': (duration: string) => `Retry after ${duration}` as const,
    'zh-CN': (duration: string) => `${duration}后可重试` as const,
    'zh-TW': (duration: string) => `${duration}後可重試` as const,
  },
  // 设置页 个人信息 退出登录
  settingProfileLogOutContentTitle: {
    'en-US': () => 'Log Out' as const,
    'zh-CN': () => '退出登录' as const,
    'zh-TW': () => '登出' as const,
  },
  settingProfileLogOutConfirmContainerTitle: {
    'en-US': () => 'Are you sure you want to log out?' as const,
    'zh-CN': () => '确认要退出登录吗？' as const,
    'zh-TW': () => '確定要登出嗎？' as const,
  },
  settingProfileLogOutButtonSubmitText: {
    'en-US': () => 'Log Out' as const,
    'zh-CN': () => '退出登录' as const,
    'zh-TW': () => '登出' as const,
  },
  // 设置页 个人信息 未登录提示
  settingProfileNotLoginPromptTitle: {
    'en-US': () =>
      // eslint-disable-next-line prettier/prettier
      'You\'re not logged in. Sign in to access more content.' as const,
    'zh-CN': () => '当前未登录，登录后可查看更多内容' as const,
    'zh-TW': () => '尚未登入，登入後可查看更多內容' as const,
  },
  settingProfileNotLoginPromptLoginText: {
    'en-US': () => 'Sign in' as const,
    'zh-CN': () => '登 录' as const,
    'zh-TW': () => '登 入' as const,
  },
} as const satisfies I18nMessagesSatisfiesType
