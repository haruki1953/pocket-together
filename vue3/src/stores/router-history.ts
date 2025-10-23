import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { useRoute } from 'vue-router'
import type { $ZodString } from 'zod/v4/core'

type Route = ReturnType<typeof useRoute>

/** 路由信息栈中每一项的类型 */
export type RouterHistoryEntryType = {
  uuid: string
  name: Route['name']
  path: Route['path']
  fullPath: Route['fullPath']
}

/**
 * 自建路由历史栈，记录路由历史信息，可供每个页面设置自己的数据
 * - 主要用于路由返回时，页面中的数据恢复（返回时保持之前浏览的位置和数据）
 * - 也用于某些页面的顶栏的返回按钮，可判断前一历史是否为当前app（是则可以返回，不是则应转到首页）
 */
export const useRouterHistoryStore = defineStore(
  'pocket-together-router-history',
  () => {
    // 路由历史栈，记录路由历史信息
    const stack = ref<Array<RouterHistoryEntryType>>([])
    // 当前路由的uuid，未初始化等特殊情况时为null
    const currentUuid = ref<string | null>(null)

    /** 在router.afterEach中调用此函数，将检查history.state并控制路由历史栈相关的数据 */
    const routerAfterEachCheckHistoryStateAndControlRouterHistoryStack =
      () => {}

    return {
      routerAfterEachCheckHistoryStateAndControlRouterHistoryStack,
    }
  }
)
