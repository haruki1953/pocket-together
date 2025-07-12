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
export function compareDatesSafe(
  a?: string | null,
  b?: string | null
): -1 | 0 | 1 {
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
