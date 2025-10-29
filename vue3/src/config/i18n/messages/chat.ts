import type { I18nMessagesSatisfiesType } from '.'
/**
 * i18nMessages 聊天页相关部分
 */
export const i18nMessagesChatPart = {
  // 聊天顶部或底部 加载更多按钮
  chatOnTopOrBottomShowMoreText: {
    'en-US': () => 'Load more' as const,
    'zh-CN': () => '加载更多' as const,
    'zh-TW': () => '載入更多' as const,
  },
  chatOnTopOrBottomShowMoreRunningText: {
    'en-US': () => 'Loading' as const,
    'zh-CN': () => '加载中' as const,
    'zh-TW': () => '載入中' as const,
  },
  // 消息详情对话框，消息链接复制
  chatMessageInfoDialogCopyMessageLinkSuccessTitle: {
    'en-US': () => 'Message link copied' as const,
    'zh-CN': () => '消息链接已复制' as const,
    'zh-TW': () => '已複製訊息連結' as const,
  },
  chatMessageInfoDialogCopyMessageLinkNotSupportedTitle: {
    'en-US': () => 'Browser not supported, please copy manually' as const,
    'zh-CN': () => '当前浏览器不支持，请手动复制' as const,
    'zh-TW': () => '目前瀏覽器不支援，請手動複製' as const,
  },
  chatTopBarMoreMenuItemRestartText: {
    'en-US': () => 'Refresh' as const,
    'zh-CN': () => '刷新' as const,
    'zh-TW': () => '刷新' as const,
  },
  chatTopBarGlobalChatTitle: {
    'en-US': () => 'Global Chat' as const,
    'zh-CN': () => '全局聊天' as const,
    'zh-TW': () => '全域聊天' as const,
  },
  chatInputBarBackBottomText: {
    'en-US': () => 'Back to bottom' as const,
    'zh-CN': () => '回到底部' as const,
    'zh-TW': () => '回到底部' as const,
  },
  chatInputBarBackMenuImage: {
    'en-US': () => 'Image' as const,
    'zh-CN': () => '图片' as const,
    'zh-TW': () => '圖片' as const,
  },
  chatInputBarBackMenuFile: {
    'en-US': () => 'File' as const,
    'zh-CN': () => '文件' as const,
    'zh-TW': () => '檔案' as const,
  },
} as const satisfies I18nMessagesSatisfiesType
