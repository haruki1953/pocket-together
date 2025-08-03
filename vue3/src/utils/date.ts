import type { useI18nStore } from '@/stores'
import type { ConvertSecondsToTimeDurationMessages } from '@/types'

/**
 * 比较两个日期字符串，返回先后关系
 *
 * -1: a < b
 *
 * 0: 相等
 *
 * 1: a > b
 *
 * 自动处理无效值和空值
 */
export const compareDatesSafe = (
  a?: string | null,
  b?: string | null
): -1 | 0 | 1 => {
  const dateA = a != null ? new Date(a) : null
  const dateB = b != null ? new Date(b) : null

  const isValidDateA = dateA instanceof Date && !isNaN(dateA.getTime())
  const isValidDateB = dateB instanceof Date && !isNaN(dateB.getTime())

  if (!isValidDateA && !isValidDateB) return 0 // 两个都无效，视为相等
  if (!isValidDateA) return -1 // a 无效，b 有效
  if (!isValidDateB) return 1 // b 无效，a 有效

  const timeA = dateA.getTime()
  const timeB = dateB.getTime()

  if (timeA < timeB) return -1
  if (timeA > timeB) return 1
  return 0
}

/**
 * 根据指定级别解析 ISO 格式的日期字符串，返回 Date 或 null。
 *
 * 解析级别说明：
 * - 'strict': 仅接受 UTC 标准格式（YYYY-MM-DDTHH:mm:ss(.sss)?Z）
 * - 'loose': 接受带时区偏移（+09:00）或无毫秒的格式
 * - 'flexible'（默认）: 同时接受纯日期、日期+时间、完整格式
 *
 * @param str 要解析的字符串
 * @param level 可选解析级别，默认为 'flexible'
 * @returns 如果符合解析规则则返回 Date 对象，否则返回 null
 */
export const parseISODate = (
  str: string,
  level: 'strict' | 'loose' | 'flexible' = 'flexible'
): Date | null => {
  if (typeof str !== 'string') return null

  const regexMap: Record<typeof level, RegExp> = {
    strict: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/,
    loose:
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/,
    flexible:
      /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?$/,
  }

  const selectedRegex = regexMap[level]

  if (!selectedRegex.test(str)) return null

  const date = new Date(str)
  return isNaN(date.getTime()) ? null : date
}

/**
 * 将秒数转换为易读的时间长度字符串，例如"2 小时 15 分钟"。
 *
 * @param data.seconds - 输入的时间长度（以秒为单位）。
 * @param data.unitLength - 可选，控制返回字符串中的时间单位数量。
 *  例如传入 2 返回 "2 小时 15 分钟"。
 *  如果为 0 或未传入，则显示所有单位。
 * @param data.messages - 用于 i18n 的本地化消息定义。
 * @returns 格式化后的时间长度字符串。
 */
export const convertSecondsToTimeDuration = (data: {
  seconds: number
  unitLength: number
  messages: ConvertSecondsToTimeDurationMessages
}) => {
  const { seconds, unitLength, messages } = data

  // 秒数转换常数
  const unitsConst = [
    // 避免使用模糊单位如“月”作为时间长度，“年”也最好不要用
    // { key: 'year', seconds: 365 * 24 * 60 * 60 },
    // { key: 'month', seconds: 30 * 24 * 60 * 60 },
    { key: 'day', seconds: 24 * 60 * 60 },
    { key: 'hour', seconds: 60 * 60 },
    { key: 'minute', seconds: 60 },
    { key: 'second', seconds: 1 },
  ] as const satisfies Array<{
    key: keyof ConvertSecondsToTimeDurationMessages
    seconds: number
  }>
  // 有lable的units（i18n）
  const units = unitsConst.map((i) => {
    return {
      ...i,
      label: messages[i.key],
    }
  })

  const result: string[] = []
  let remainingSeconds = seconds
  let addedUnits = 0

  for (const { label, seconds: unitSeconds } of units) {
    const value = Math.floor(remainingSeconds / unitSeconds)
    remainingSeconds %= unitSeconds

    if (value > 0) {
      result.push(`${value}${label}`)
      addedUnits++
    }

    // 如果达到了限制的单位长度并且没有后续单位，处理四舍五入
    if (unitLength !== 0 && addedUnits === unitLength) {
      if (remainingSeconds >= unitSeconds / 2) {
        result[result.length - 1] = `${value + 1} ${label}`
      }
      break
    }
  }

  return result.length > 0 ? result.join(' ') : `0 ${messages.second}`
}
