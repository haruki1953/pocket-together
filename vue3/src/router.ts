import { createRouter, createWebHistory } from 'vue-router'
import { routerDict } from './config'

import {
  LayoutNav,
  LayoutSimple,
  HomePage,
  LoginPage,
  ChatPage,
  FilePage,
  SettingPage,
  NavPage,
  SettingProfile,
  ChatPageMobile,
  RoomPage,
  RoomInfoPage,
  CreateRoomPage,
  CreateRoomOK,
  TestPage,
} from './views'
import { useRouterHistoryStore } from './stores'
import { injectAppMainElScrollbar } from './composables'
import { getAppMainElScrollbarWrap } from './utils'

// 路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      ...routerDict.LayoutNav,
      component: LayoutNav,
      redirect: routerDict.HomePage.path,
      children: [
        {
          path: '/test',
          name: 'TestPage',
          component: TestPage,
        },
        {
          ...routerDict.HomePage,
          component: HomePage,
        },
        {
          ...routerDict.ChatPage,
          component: ChatPage,
        },
        {
          ...routerDict.FilePage,
          component: FilePage,
        },
        {
          ...routerDict.SettingPage,
          component: SettingPage,
          redirect: routerDict.SettingProfile.path,
          children: [
            {
              ...routerDict.SettingProfile,
              component: SettingProfile,
            },
          ],
        },
        {
          ...routerDict.NavPage,
          component: NavPage,
        },
      ],
    },
    {
      ...routerDict.LayoutSimple,
      component: LayoutSimple,
      redirect: routerDict.HomePage.path,
      children: [
        {
          ...routerDict.LoginPage,
          component: LoginPage,
        },
        {
          ...routerDict.ChatPageMobile,
          component: ChatPageMobile,
        },
        {
          ...routerDict.RoomPage,
          component: RoomPage,
        },
        {
          ...routerDict.RoomInfoPage,
          component: RoomInfoPage,
        },
        {
          ...routerDict.CreateRoomPage,
          component: CreateRoomPage,
        },
        {
          ...routerDict.CreateRoomOK,
          component: CreateRoomOK,
        },
      ],
    },
  ],
  // 路由滚动行为定制
  // scrollBehavior: async (to, from, savedPosition) => {}
})

// 路由访问拦截
router.beforeEach((to, from) => {
  // 路由不存在，拦截到首页
  if (router.resolve(to.path).matched.length === 0) {
    return routerDict.HomePage.path
  }
})

// 新页面回到顶部
router.afterEach((to, from) => {
  // 之所以不用 createRouter 中的 scrollBehavior 来控制，是因为 scrollBehavior 会等到组件onMounted后再进行，会影响聊天页的滚动控制
  // router.afterEach 是在组件setup前进行

  // 路径不变时（query可以改变），不滚动
  if (to.path === from.path) {
    return
  }
  // 回到顶部（不使用页面原生滚动条，使用的是自设的滚动条）
  const appMainElScrollbarWrap = getAppMainElScrollbarWrap()
  appMainElScrollbarWrap?.scrollTo({
    top: 0,
    behavior: 'instant',
  })
})

// 自建路由历史栈
router.afterEach(() => {
  const routerHistoryStore = useRouterHistoryStore()
  routerHistoryStore.routerAfterEachCheckHistoryStateAndControlRouterHistoryStack()
})

// // 测试
// router.beforeEach((to, from) => {
//   console.log('beforeEach')
//   console.log('location.href', location.href)
//   console.log('to.fullPath', to.fullPath)
//   console.log('from.fullPath', from.fullPath)
// })
// router.afterEach((to, from) => {
//   console.log('afterEach')
//   console.log('location.href', location.href)
//   console.log('to.fullPath', to.fullPath)
//   console.log('from.fullPath', from.fullPath)
// })

export default router
