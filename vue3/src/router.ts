import { createRouter, createWebHistory } from 'vue-router'
import LayoutNav from './views/layout/LayoutNav.vue'
import LayoutSimple from './views/layout/LayoutSimple.vue'
import HomePage from './views/home/HomePage.vue'
import LoginPage from './views/login/LoginPage.vue'
import ChatPage from './views/chat/ChatPage.vue'
import FilePage from './views/file/FilePage.vue'
import SettingPage from './views/setting/SettingPage.vue'
import NavPage from './views/nav/NavPage.vue'
import SettingProfile from './views/setting/views/SettingProfile.vue'
import { routerDict } from './config'
import CreateRoomPage from './views/home/CreateRoomPage.vue'

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
          ...routerDict.CreateRoomPage,
          component: CreateRoomPage,
        },
      ],
    },
  ],
})

export default router
