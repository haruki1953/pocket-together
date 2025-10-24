import { useRouterHistoryStore } from '@/stores'
import { useRouter, type RouteLocationRaw } from 'vue-router'

/** 一些关于路由的工具 */
export const useRouterHistoryTool = () => {
  const routerHistoryStore = useRouterHistoryStore()
  const router = useRouter()

  /** 如果可以后退且来源是本站，则后退；否则跳转至指定页面 */
  const routerBackSafe = (data: {
    /** 失败时跳转到的页面，类型和router.push的参数一样，默认为 '/' */
    fallbackTo?: RouteLocationRaw
  }) => {
    const { fallbackTo = '/' } = data

    console.log('routerBackSafe')
    console.log('routerHistoryStore.stack', routerHistoryStore.stack)
    console.log(
      'routerHistoryStore.currentUuid',
      routerHistoryStore.currentUuid
    )
    console.log(
      'routerHistoryStore.currentPreviousRouterHistoryEntry',
      routerHistoryStore.currentPreviousRouterHistoryEntry
    )

    // 为null即代表当前app中没有上一页
    if (routerHistoryStore.currentPreviousRouterHistoryEntry == null) {
      router.push(fallbackTo)
      return
    }
    router.back()
  }

  return {
    routerBackSafe,
  }
}
