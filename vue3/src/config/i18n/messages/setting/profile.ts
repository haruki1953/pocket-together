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
  // 设置页 个人信息 修改邮箱
  settingProfileUpdateEmailContentTitle: {
    'en-US': () => 'Update Email' as const,
    'zh-CN': () => '修改邮箱' as const,
    'zh-TW': () => '修改信箱' as const,
  },
  settingProfileUpdateEmailConfirmContainerTitle: {
    'en-US': (email: string) =>
      `A verification email will be sent to ${email}` as const,
    'zh-CN': (email: string) => `将向 ${email} 发送邮箱修改验证邮件` as const,
    'zh-TW': (email: string) => `將向 ${email} 發送信箱修改驗證信` as const,
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
  settingProfileUpdateEmailRetryAfterDuration: {
    'en-US': (duration: string) => `Retry after ${duration}` as const,
    'zh-CN': (duration: string) => `${duration}后可重试` as const,
    'zh-TW': (duration: string) => `${duration}後可重試` as const,
  },
} as const satisfies I18nMessagesSatisfiesType
