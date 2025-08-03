import type { I18nMessagesSatisfiesType } from '.'
/**
 * i18nMessages 提示信息相关部分
 */
export const i18nMessagesNotificationPart = {
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
} as const satisfies I18nMessagesSatisfiesType
