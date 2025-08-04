import type { ConvertSecondsToTimeDurationMessages } from '@/types'
import type { I18nMessagesSatisfiesType } from '.'
/**
 * i18nMessages 日期相关部分
 */
export const i18nMessagesDatePart = {
  // 用于 convertSecondsToTimeDuration
  convertSecondsToTimeDurationMessages: {
    // 国际单位符号
    // day：d
    // hour：h
    // minute：min
    // second：s
    'en-US': () => {
      return {
        day: 'd',
        hour: 'h',
        minute: 'min',
        second: 's',
      } as const satisfies ConvertSecondsToTimeDurationMessages
    },
    'zh-CN': () => {
      return {
        day: '天',
        hour: '小时',
        minute: '分钟',
        second: '秒',
      } as const satisfies ConvertSecondsToTimeDurationMessages
    },
    'zh-TW': () => {
      return {
        day: '天',
        hour: '小時',
        minute: '分鐘',
        second: '秒',
      } as const satisfies ConvertSecondsToTimeDurationMessages
    },
  },
} as const satisfies I18nMessagesSatisfiesType
