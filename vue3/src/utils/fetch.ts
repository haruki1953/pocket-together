import { fetchConfig } from '@/config'

/**
 * 封装一个 fetch 超时逻辑，用 AbortController 实现：
 *
 * 使用时如
 * ```ts
 * // 超时时间10秒
 * // fetchWithTimeout类型和fetch一样
 * const fetchWithTimeout = createFetchWithTimeout(10000)
 * ```
 *
 * @param {number} timeout 超时时间 毫秒
 */
export const createFetchWithTimeout = (timeout: number) => {
  const fetchWithTimeout = (
    url: RequestInfo | URL,
    options: RequestInit = {}
  ) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    return fetch(url, { ...options, signal: controller.signal }).finally(() =>
      clearTimeout(id)
    )
  }
  return fetchWithTimeout
}

/**
 * 首选的、推荐的 fetchWithTimeout，timeout为5000（fetchConfig.timeout）
 *
 * 由一般的小数据接口使用，对于数据比较大的接口使用自定义的timeout
 */
export const fetchWithTimeoutPreferred = createFetchWithTimeout(
  fetchConfig.timeoutPreferred
)

// export const fetchWithTimeout = (
//   url: RequestInfo | URL,
//   options: RequestInit = {},
//   timeout = 10000
// ) => {
//   const controller = new AbortController()
//   const id = setTimeout(() => controller.abort(), timeout)
//   return fetch(url, { ...options, signal: controller.signal }).finally(() =>
//     clearTimeout(id)
//   )
// }
