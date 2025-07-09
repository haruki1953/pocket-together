import { createRouter, createWebHistory } from 'vue-router'
import LayoutNav from './views/layout/LayoutNav.vue'
import LayoutSimple from './views/layout/LayoutSimple.vue'
import HomePage from './views/home/HomePage.vue'
import LoginPage from './views/login/LoginPage.vue'
import ChatPage from './views/chat/ChatPage.vue'
import FilePage from './views/file/FilePage.vue'
import SettingPage from './views/setting/SettingPage.vue'
import type { I18nMessagesKeyType } from './config'
import NavPage from './views/nav/NavPage.vue'
import type { Component } from 'vue'
import {
  RiFolderFill,
  RiHomeFill,
  RiMessage3Fill,
  RiSettingsFill,
  RiUserLine,
} from '@remixicon/vue'
import SettingProfile from './views/setting/views/SettingProfile.vue'

interface RouterInfo {
  path: string
  name: string
  titleI18nMessageKey: I18nMessagesKeyType
}

// 显示在LayoutNav的路由
export const routerNavInfo = {
  navList: [
    {
      path: '/',
      name: 'HomePage',
      titleI18nMessageKey: 'pageHome',
      icon: markRaw(RiHomeFill),
    },
    {
      path: '/chat',
      name: 'ChatPage',
      titleI18nMessageKey: 'pageChat',
      icon: markRaw(RiMessage3Fill),
    },
    {
      path: '/file',
      name: 'FilePage',
      titleI18nMessageKey: 'pageFile',
      icon: markRaw(RiFolderFill),
    },
    {
      path: '/setting',
      name: 'SettingPage',
      titleI18nMessageKey: 'pageSetting',
      icon: markRaw(RiSettingsFill),
    },
  ],
  navPage: {
    path: '/nav',
    name: 'NavPage',
    titleI18nMessageKey: 'pageNav',
  },
} as const satisfies {
  navList: (RouterInfo & {
    icon: Component
  })[]
  navPage: RouterInfo
}

// 显示在设置页的路由
export const routerSettingList = [
  {
    path: '/setting/profile',
    name: 'SettingProfile',
    titleI18nMessageKey: 'pageSettingProfile',
    icon: markRaw(RiUserLine),
  },
  {
    path: '/setting/profile1',
    name: 'SettingProfile1',
    titleI18nMessageKey: 'pageSettingProfile',
    icon: markRaw(RiUserLine),
  },
  {
    path: '/setting/profile1',
    name: 'SettingProfile1',
    titleI18nMessageKey: 'pageSettingProfile',
    icon: markRaw(RiUserLine),
  },
  {
    path: '/setting/profile1',
    name: 'SettingProfile1',
    titleI18nMessageKey: 'pageSettingProfile',
    icon: markRaw(RiUserLine),
  },
  {
    path: '/setting/profile1',
    name: 'SettingProfile1',
    titleI18nMessageKey: 'pageSettingProfile',
    icon: markRaw(RiUserLine),
  },
  {
    path: '/setting/profile1',
    name: 'SettingProfile1',
    titleI18nMessageKey: 'pageSettingProfile',
    icon: markRaw(RiUserLine),
  },
  {
    path: '/setting/profile1',
    name: 'SettingProfile1',
    titleI18nMessageKey: 'pageSettingProfile',
    icon: markRaw(RiUserLine),
  },
] as const satisfies (RouterInfo & {
  icon: Component
})[]

// 路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/LayoutNav',
      name: 'LayoutNav',
      component: LayoutNav,
      redirect: '/',
      children: [
        {
          path: '/',
          name: 'HomePage',
          component: HomePage,
        },
        {
          path: '/chat',
          name: 'ChatPage',
          component: ChatPage,
        },
        {
          path: '/file',
          name: 'FilePage',
          component: FilePage,
        },
        {
          path: '/setting',
          name: 'SettingPage',
          component: SettingPage,
          redirect: '/setting/profile',
          children: [
            {
              path: '/setting/profile',
              name: 'SettingProfile',
              component: SettingProfile,
            },
          ],
        },
        {
          path: '/nav',
          name: 'NavPage',
          component: NavPage,
        },
      ],
    },
    {
      path: '/LayoutSimple',
      name: 'LayoutSimple',
      component: LayoutSimple,
      redirect: '/',
      children: [
        {
          path: '/login',
          name: 'LoginPage',
          component: LoginPage,
        },
      ],
    },
  ],
})

export default router
