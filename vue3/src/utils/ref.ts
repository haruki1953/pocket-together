import type { Ref, ComputedRef } from 'vue'

// 一些响应式相关的工具

/**
 * 等待一个响应式数据满足指定条件。
 * 适用于 Ref 或 ComputedRef 类型的数据，通过传入判断函数，
 * 当该函数返回 true 时，Promise resolve；否则持续监听直到满足。
 *
 * @template T - 响应式数据的类型
 * @param source - 要监听的响应式数据（Ref 或 ComputedRef）
 * @param condition - 判断条件函数，接收当前值，返回 true 表示满足条件
 * @returns Promise<void> - 条件满足时 resolve，可用于异步流程控制
 *
 * @example
 * const count = ref(0)
 * await watchUntilSourceCondition(count, val => val >= 5)
 * console.log('✅ count 已达到 5')
 */
export const watchUntilSourceCondition = <T>(
  source: Ref<T> | ComputedRef<T>,
  condition: (value: T) => boolean
): Promise<void> => {
  return new Promise((resolve) => {
    // 如果初始值已满足条件，立即 resolve
    if (condition(source.value)) {
      return resolve()
    }

    // 启动响应式监听，直到条件满足
    const stop = watch(
      source,
      (val) => {
        if (condition(val)) {
          stop() // 停止监听，避免内存泄漏
          resolve()
        }
      },
      { immediate: true } // 立即执行一次，以应对初始值已满足的情况
    )
  })
}

/**
 * 等待 useQuery 查询完成（@tanstack/vue-query）。
 * 此版本使用 watchUntilSourceCondition 监听一个计算属性，
 * 判断是否处于请求过程中当 isLoading 和 isFetching 都为 false 时，认为查询完成。
 * 如发生错误，则抛出异常；否则正常返回。
 *
 * @param queryStatus - 包含 isLoading、isFetching（都是 Ref<boolean>）和可选的错误 Ref
 * @returns Promise<void> - 查询完成后 resolve，发生错误则 reject
 *
 * @example
 * const query = useQuery({ ... })
 * await awaitQueryReady(query)
 * console.log('✅ 查询完成:', query.data.value)
 */
export const watchUntilQueryReady = async (queryStatus: {
  isLoading: Ref<boolean>
  isFetching: Ref<boolean>
  error?: Ref<unknown>
}): Promise<void> => {
  // 创建一个计算属性，表示是否仍在加载中
  const isQueryPending = computed(() => {
    return queryStatus.isLoading.value || queryStatus.isFetching.value
  })

  // 等待查询状态变为“非加载中”
  await watchUntilSourceCondition(isQueryPending, (pending) => !pending)

  // 查询完成后，判断是否有错误
  if (queryStatus.error?.value != null) {
    throw queryStatus.error.value
  }
}
