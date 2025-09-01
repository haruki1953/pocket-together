import type { I18nMessagesSatisfiesType } from '.'

/**
 * i18nMessages 标签相关部分
 */
export const i18nMessagesTagsPart = {
  tagMovie: {
    'en-US': () => 'Movie' as const,
    'zh-CN': () => '电影' as const,
    'zh-TW': () => '電影' as const,
  },
  tagGame: {
    'en-US': () => 'Game' as const,
    'zh-CN': () => '游戏' as const,
    'zh-TW': () => '遊戲' as const,
  },
  tagStudy: {
    'en-US': () => 'Study' as const,
    'zh-CN': () => '学习' as const,
    'zh-TW': () => '學習' as const,
  },
  tagMusic: {
    'en-US': () => 'Music' as const,
    'zh-CN': () => '音乐' as const,
    'zh-TW': () => '音樂' as const,
  },
  tagTravel: {
    'en-US': () => 'Travel' as const,
    'zh-CN': () => '旅行' as const,
    'zh-TW': () => '旅行' as const,
  },
  tagAnime: {
    'en-US': () => 'Anime' as const,
    'zh-CN': () => '动漫' as const,
    'zh-TW': () => '動漫' as const,
  },
  tagASMR: {
    'en-US': () => 'ASMR' as const,
    'zh-CN': () => '助眠' as const,
    'zh-TW': () => '助眠' as const,
  },
  tagChat: {
    'en-US': () => 'Chat' as const,
    'zh-CN': () => '聊天' as const,
    'zh-TW': () => '聊天' as const,
  },
} as const satisfies I18nMessagesSatisfiesType
