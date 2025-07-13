import type { Ref } from 'vue'

/**
 * 等待 useQuery 查询完成。
 * 此函数通过监听响应式的 isLoading 和 isFetching 状态，
 * 判断是否处于请求过程中，一旦两者都变为 false，即认为请求完成。
 * 如发生错误，则会 reject；否则 resolve，可用于控制异步流程。
 *
 * @param queryStatus - 包含 isLoading、isFetching（都是 Ref<boolean>）和可选的错误 Ref
 * @returns Promise<void> - 查询完成后 resolve，发生错误则 reject
 *
 * @example
 * const query = useQuery({ ... })
 * await awaitQueryReady(query)
 * console.log('✅ 查询完成:', query.data.value)
 */
export function awaitQueryReady(queryStatus: {
  isLoading: Ref<boolean>
  isFetching: Ref<boolean>
  error?: Ref<unknown>
}) {
  return new Promise<void>((resolve, reject) => {
    // 如果查询已经完成（不是加载中，也不是正在请求），立即 resolve
    if (!queryStatus.isLoading.value && !queryStatus.isFetching.value) {
      return resolve()
    }

    // 启动响应式监听，当 loading 或 fetching 状态发生变化
    const stop = watch(
      () => queryStatus.isLoading.value || queryStatus.isFetching.value,
      (loading) => {
        // 当 loading 状态为 false，说明请求已完成
        if (!loading) {
          stop() // 停止监听，避免内存泄漏

          // 如果查询过程中有错误，reject 出去，交由调用方处理
          if (queryStatus.error?.value != null) {
            reject(queryStatus.error.value)
          } else {
            // 没有错误，正常完成请求，resolve
            resolve()
          }
        }
      },
      { immediate: true } // 立即执行监听逻辑，以应对初始状态已完成场景
    )
  })
}
