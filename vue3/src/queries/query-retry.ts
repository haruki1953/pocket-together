import { ClientResponseError } from 'pocketbase'

/**
 * useQuery useMutation retry pocketbase fetchWithTimeout
 * 仅在 pocketbase 使用的 fetch:fetchWithTimeout 中断（超时）时进行重试（最多重试 2 次）（请求三次）
 */
export const queryRetryPbFetchTimeout = (
  failureCount: number,
  error: Error
) => {
  const isTimeout =
    error instanceof ClientResponseError && error.isAbort === true
  const hasAttemptsLeft = failureCount < 2
  return isTimeout && hasAttemptsLeft
}
