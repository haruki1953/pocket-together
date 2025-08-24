import type { useTimeAgo } from '@vueuse/core'

/** useTimeAgo的messages类型 */
export type UseTimeAgoMessagesType = NonNullable<
  Parameters<typeof useTimeAgo>[1]['messages']
>

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
