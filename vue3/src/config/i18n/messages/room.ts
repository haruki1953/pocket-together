import type { I18nMessagesSatisfiesType } from '.'
/**
 * i18nMessages 房间页相关部分
 */
export const i18nMessagesRoomPart = {
  // 房间页聊天顶部更多菜单 房间详情
  roomChatTopBarMoreMenuRoomInfoText: {
    'en-US': () => 'Room Info' as const,
    'zh-CN': () => '房间详情' as const,
    'zh-TW': () => '房間資訊' as const,
  },
  // 房间页聊天顶部更多菜单 返回首页
  roomChatTopBarMoreMenuBackHomeText: {
    'en-US': () => 'Back to Home' as const,
    'zh-CN': () => '返回首页' as const,
    'zh-TW': () => '返回首頁' as const,
  },
} as const satisfies I18nMessagesSatisfiesType
