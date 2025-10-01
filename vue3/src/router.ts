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
} from './views'

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
          // path: routerDict.RoomPage.path,
          // name: routerDict.RoomPage.name
          ...routerDict.RoomPage,
          component: RoomPage,
        },
        {
          ...routerDict.RoomInfoPage,
          component: RoomInfoPage,
        },
      ],
    },
  ],
})

// 路由访问拦截
router.beforeEach((to, from) => {
  // 路由不存在，拦截到首页
  if (router.resolve(to.path).matched.length === 0) {
    return routerDict.HomePage.path
  }
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
