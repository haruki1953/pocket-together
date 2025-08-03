// 取自 /node_modules/.pnpm/%40vueuse%2Bcore%4010.11.0_vue%403.4.33/node_modules/%40vueuse/core/index.d.mts#L4337
type UseTimeAgoFormatter<T = number> = (value: T, isPast: boolean) => string
type UseTimeAgoUnitNamesDefault =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year'
interface UseTimeAgoMessagesBuiltIn {
  justNow: string
  past: string | UseTimeAgoFormatter<string>
  future: string | UseTimeAgoFormatter<string>
  invalid: string
}
type UseTimeAgoMessages<UnitNames extends string = UseTimeAgoUnitNamesDefault> =
  UseTimeAgoMessagesBuiltIn &
    Record<UnitNames, string | UseTimeAgoFormatter<number>>

/**
 * formatTimeAgo 的 messages 的类型，如
 * ```
 *  const formatTimeAgoChsMessages = {
 *    justNow: '刚刚',
 *    past: (n: string | number) => `${n}前`,
 *    future: (n: string | number) => `${n}后`,
 *    month: (n: number, past?: boolean) =>
 *      n === 1 ? (past ? '上个月' : '下个月') : `${n}个月`,
 *    year: (n: number, past?: boolean) =>
 *      n === 1 ? (past ? '去年' : '明年') : `${n}年`,
 *    // day: (n: number, past?: boolean) =>
 *    //   n === 1 ? (past ? '昨天' : '明天') : `${n}天`,
 *    day: (n: number) => `${n}天`,
 *    week: (n: number, past?: boolean) =>
 *      n === 1 ? (past ? '上周' : '下周') : `${n}周`,
 *    hour: (n: number) => `${n}小时`,
 *    minute: (n: number) => `${n}分钟`,
 *    second: (n: number) => `${n}秒`,
 *    invalid: '无效时间'
 *  }
 * ```
 */
export type FormatTimeAgoMessages = UseTimeAgoMessages

/**
 * convertSecondsToTimeDuration 的 messages 的类型
 */
export type ConvertSecondsToTimeDurationMessages = {
  // 避免使用模糊单位如“月”作为时间长度，“年”也最好不要用
  // year: string
  // month: string
  day: string
  hour: string
  minute: string
  second: string
}
