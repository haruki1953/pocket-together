import { pocketbaseConfig } from '@/config'
import PocketBase, { ClientResponseError } from 'pocketbase'

import { type TypedPocketBase } from './pocketbase-types'
export * from './pocketbase-types'
export * from './utility-types-for-create-update-operations'

export const pb = new PocketBase(pocketbaseConfig.baseUrl) as TypedPocketBase

// https://github.com/pocketbase/js-sdk#auto-cancellation
// globally disable auto cancellation
pb.autoCancellation(false)

/**
 * 代码封装，出现鉴权失败则清除authStore，将在包含pocketbase请求的地方的错误处理中使用
 */
export const onPbResErrorStatus401AuthClear = (error: unknown) => {
  if (error instanceof ClientResponseError && error.status === 401) {
    pb.authStore.clear()
    return true
  }
  return false
}
