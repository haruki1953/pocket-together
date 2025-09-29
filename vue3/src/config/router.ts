import type { I18nMessagesKeyType } from '@/config'
import type { Component } from 'vue'
import {
  RiFolderFill,
  RiHomeFill,
  RiMessage3Fill,
  RiSettingsFill,
  RiUserLine,
} from '@remixicon/vue'

interface RouterItem {
  path: string
  name: string
}

// 路由信息字典，导出以便整个程序中使用
export const routerDict = {
  LayoutNav: {
    path: '/LayoutNav',
    name: 'LayoutNav',
  },
  HomePage: {
    path: '/',
    name: 'HomePage',
  },
  ChatPage: {
    path: '/chat',
    name: 'ChatPage',
  },
  /**
   * ChatPageMobile 用于移动端，无导航栏
   *
   * 桌面端：
   * - ChatPage 聊天列 用户列表列
   *
   * 移动端：
   * - ChatPage 用户列表列（包含ChatPageMobile入口）
   * - ChatPageMobile 聊天列
   */
  ChatPageMobile: {
    path: '/chat-mobile',
    name: 'ChatPageMobile',
  },
  FilePage: {
    path: '/file',
    name: 'FilePage',
  },
  SettingPage: {
    path: '/setting',
    name: 'SettingPage',
  },
  SettingProfile: {
    path: '/setting/profile',
    name: 'SettingProfile',
  },
  NavPage: {
    path: '/nav',
    name: 'NavPage',
  },
  LayoutSimple: {
    path: '/LayoutSimple',
    name: 'LayoutSimple',
  },
  LoginPage: {
    path: '/login',
    name: 'LoginPage',
  },
} as const satisfies Record<string, RouterItem>

interface RouterInfo extends RouterItem {
  titleI18nMessageKey: I18nMessagesKeyType
}

// 显示在LayoutNav的路由
export const routerNavInfo = {
  navList: [
    {
      ...routerDict.HomePage,
      titleI18nMessageKey: 'pageHome',
      icon: markRaw(RiHomeFill),
    },
    {
      ...routerDict.ChatPage,
      titleI18nMessageKey: 'pageChat',
      icon: markRaw(RiMessage3Fill),
    },
    {
      ...routerDict.FilePage,
      titleI18nMessageKey: 'pageFile',
      icon: markRaw(RiFolderFill),
    },
    {
      ...routerDict.SettingPage,
      titleI18nMessageKey: 'pageSetting',
      icon: markRaw(RiSettingsFill),
    },
  ],
  navPage: {
    ...routerDict.NavPage,
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
    ...routerDict.SettingProfile,
    titleI18nMessageKey: 'pageSettingProfile',
    icon: markRaw(RiUserLine),
  },
] as const satisfies (RouterInfo & {
  icon: Component
})[]
