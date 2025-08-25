import type {
  ConvertSecondsToTimeDurationMessages,
  UseTimeAgoMessagesType,
} from '@/types'
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
  // 用于 useTimeAgo '@vueuse/core'
  useTimeAgoMessages: {
    'en-US': () => {
      // 参考 DEFAULT_MESSAGES
      // node_modules\.pnpm\@vueuse+core@13.3.0_vue@3.5.16_typescript@5.8.3_\node_modules\@vueuse\core\index.mjs#L6752
      return {
        justNow: 'just now',
        past: (n: string | number) =>
          typeof n === 'string' && n.match(/\d/) ? `${n} ago` : `${n}`,
        future: (n: string | number) =>
          typeof n === 'string' && n.match(/\d/) ? `in ${n}` : `${n}`,
        month: (n: number, past?: boolean) =>
          n === 1
            ? past === true
              ? 'last month'
              : 'next month'
            : `${n} month${n > 1 ? 's' : ''}`,
        year: (n: number, past?: boolean) =>
          n === 1
            ? past === true
              ? 'last year'
              : 'next year'
            : `${n} year${n > 1 ? 's' : ''}`,
        day: (n: number, past?: boolean) =>
          n === 1
            ? past === true
              ? 'yesterday'
              : 'tomorrow'
            : `${n} day${n > 1 ? 's' : ''}`,
        week: (n: number, past?: boolean) =>
          n === 1
            ? past === true
              ? 'last week'
              : 'next week'
            : `${n} week${n > 1 ? 's' : ''}`,
        hour: (n: number) => `${n} hour${n > 1 ? 's' : ''}`,
        minute: (n: number) => `${n} minute${n > 1 ? 's' : ''}`,
        second: (n: number) => `${n} second${n > 1 ? 's' : ''}`,
        invalid: '',
      } as const satisfies UseTimeAgoMessagesType
    },

    'zh-CN': () => {
      return {
        justNow: '刚刚',
        past: (n: string | number) =>
          typeof n === 'string' && n.match(/\d/) ? `${n}前` : `${n}`,
        future: (n: string | number) =>
          typeof n === 'string' && n.match(/\d/) ? `${n}后` : `${n}`,
        month: (n: number, past?: boolean) =>
          n === 1 ? (past === true ? '上个月' : '下个月') : `${n}个月`,
        year: (n: number, past?: boolean) =>
          n === 1 ? (past === true ? '去年' : '明年') : `${n}年`,
        day: (n: number, past?: boolean) =>
          n === 1 ? (past === true ? '昨天' : '明天') : `${n}天`,
        week: (n: number, past?: boolean) =>
          n === 1 ? (past === true ? '上周' : '下周') : `${n}周`,
        hour: (n: number) => `${n}小时`,
        minute: (n: number) => `${n}分钟`,
        second: (n: number) => `${n}秒`,
        invalid: '无效时间',
      } as const satisfies UseTimeAgoMessagesType
    },

    'zh-TW': () => {
      return {
        justNow: '剛剛',
        past: (n: string | number) =>
          typeof n === 'string' && n.match(/\d/) ? `${n}前` : `${n}`,
        future: (n: string | number) =>
          typeof n === 'string' && n.match(/\d/) ? `${n}後` : `${n}`,
        month: (n: number, past?: boolean) =>
          n === 1 ? (past === true ? '上個月' : '下個月') : `${n}個月`,
        year: (n: number, past?: boolean) =>
          n === 1 ? (past === true ? '去年' : '明年') : `${n}年`,
        day: (n: number, past?: boolean) =>
          n === 1 ? (past === true ? '昨天' : '明天') : `${n}天`,
        week: (n: number, past?: boolean) =>
          n === 1 ? (past === true ? '上週' : '下週') : `${n}週`,
        hour: (n: number) => `${n}小時`,
        minute: (n: number) => `${n}分鐘`,
        second: (n: number) => `${n}秒`,
        invalid: '無效時間',
      } as const satisfies UseTimeAgoMessagesType
    },
  },
} as const satisfies I18nMessagesSatisfiesType
