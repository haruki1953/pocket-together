// 导入element-plus的国际化配置（将控制某些组件如时间选择器的语言）
import elEnUS from 'element-plus/es/locale/lang/en'
import elZhCN from 'element-plus/es/locale/lang/zh-cn'
import elZhTW from 'element-plus/es/locale/lang/zh-tw'

import {
  enUS as nuEnUS,
  dateEnUS as nuDateEnUS,
  zhCN as nuZhCN,
  dateZhCN as nuDateZhCN,
  zhTW as nuZhTW,
  dateZhTW as nuDateZhTW,
} from 'naive-ui'

// 当前所支持的语言，格式：(ISO 639-1)-(Country Code)
export const i18nLocaleList = ['en-US', 'zh-CN', 'zh-TW'] as const

// 通过类型体操，根据i18nLocaleList的值得到联合类型（Union Types）
export type I18nLocaleType = (typeof i18nLocaleList)[number]

// 语言信息
export const i18nLocaleInfo = {
  'en-US': {
    language: 'English',
    region: 'USA',
    elLocale: elEnUS,
    nuLocale: nuEnUS,
    nuDateLocale: nuDateEnUS,
  },
  'zh-CN': {
    language: '简体中文',
    region: '中国',
    elLocale: elZhCN,
    nuLocale: nuZhCN,
    nuDateLocale: nuDateZhCN,
  },
  'zh-TW': {
    language: '繁體中文',
    region: '台灣',
    elLocale: elZhTW,
    nuLocale: nuZhTW,
    nuDateLocale: nuDateZhTW,
  },
} as const satisfies Record<
  // 确保类型正确
  I18nLocaleType,
  {
    language: string
    region: string
    elLocale: typeof elEnUS | typeof elZhCN | typeof elZhTW
    nuLocale: typeof nuEnUS | typeof nuZhCN | typeof nuZhTW
    nuDateLocale: typeof nuDateEnUS | typeof nuDateZhCN | typeof nuDateZhTW
  }
>

// 默认语言，优先使用navigator.language，否则i18nfallbackLocale
const i18nfallbackLocale = 'en-US'
export const i18nDefaultLocale: I18nLocaleType = (() => {
  if (navigator.language == null || navigator.language === '') {
    return i18nfallbackLocale
  }
  // 找到系统语言对应代码，转为小写避免意外
  const findLocale = i18nLocaleList.find(
    (i) => i.toLowerCase() === navigator.language.toLowerCase()
  )
  if (findLocale != null) {
    return findLocale
  }
  // 有的浏览器可能只返回语言标志，用startsWith匹配
  const findLocaleStartsWith = i18nLocaleList.find((i) =>
    i.toLowerCase().startsWith(navigator.language.toLowerCase())
  )
  if (findLocaleStartsWith != null) {
    return findLocaleStartsWith
  }
  return i18nfallbackLocale
})()
