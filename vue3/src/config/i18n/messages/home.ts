import type { I18nMessagesSatisfiesType } from '.'

/**
 * i18nMessages 主页相关部分
 */
export const i18nMessagesHomePart = {
  homeMenuAllRooms: {
    'en-US': () => 'All Rooms' as const,
    'zh-CN': () => '全部房间' as const,
    'zh-TW': () => '全部房間' as const,
  },
  homeMenuSearchRooms: {
    'en-US': () => 'Search Rooms' as const,
    'zh-CN': () => '搜索房间' as const,
    'zh-TW': () => '搜尋房間' as const,
  },
  homeMenuFavoriteRooms: {
    'en-US': () => 'Favorite Rooms' as const,
    'zh-CN': () => '收藏房间' as const,
    'zh-TW': () => '收藏房間' as const,
  },
  homeMenuCreateRoom: {
    'en-US': () => 'Create New Room' as const,
    'zh-CN': () => '创建新房间' as const,
    'zh-TW': () => '創建新房間' as const,
  },
  homeCardPeopleOnline: {
    'en-US': (count: number) => `${count} people online` as const,
    'zh-CN': (count: number) => `${count} 人在线` as const,
    'zh-TW': (count: number) => `${count} 人在線` as const,
  },

  // CreateRoomPage
  createRoomTitle: {
    'en-US': () => 'Create Room' as const,
    'zh-CN': () => '创建房间' as const,
    'zh-TW': () => '創建房間' as const,
  },
  createRoomEditInfo: {
    'en-US': () => 'Edit Information' as const,
    'zh-CN': () => '信息编辑' as const,
    'zh-TW': () => '資訊編輯' as const,
  },
  createRoomEditInfoDesc: {
    'en-US': () => 'This is how your room will be seen by others' as const,
    'zh-CN': () => '这是您的房间被其他人看到的样子' as const,
    'zh-TW': () => '這是您的房間被其他人看到的樣子' as const,
  },
  createRoomUploadCover: {
    'en-US': () => 'Please upload a cover image' as const,
    'zh-CN': () => '请上传封面图片' as const,
    'zh-TW': () => '請上傳封面圖片' as const,
  },
  createRoomUploadCoverDesc: {
    'en-US': () => 'Supports JPG, PNG, WEBP.' as const,
    'zh-CN': () => '支持 JPG, PNG, WEBP 等多种格式' as const,
    'zh-TW': () => '支援 JPG, PNG, WEBP 等多種格式' as const,
  },
  createRoomPlaceholderTitle: {
    'en-US': () => 'Click here to enter a title' as const,
    'zh-CN': () => '单击此处输入标题' as const,
    'zh-TW': () => '點擊此處輸入標題' as const,
  },
  createRoomPlaceholderDesc: {
    'en-US': () => 'Click here to enter a description' as const,
    'zh-CN': () => '单击此处输入简介' as const,
    'zh-TW': () => '點擊此處輸入簡介' as const,
  },
  createRoomPlaceholderTags: {
    'en-US': () =>
      'Click to enter text and press Enter to create a tag' as const,
    'zh-CN': () => '单击输入文本后按 Enter 创建标签' as const,
    'zh-TW': () => '點擊輸入文本後按 Enter 創建標籤' as const,
  },
  createRoomPreview: {
    'en-US': () => 'Preview' as const,
    'zh-CN': () => '预览' as const,
    'zh-TW': () => '預覽' as const,
  },
  createRoomRoomSettings: {
    'en-US': () => 'Room Settings' as const,
    'zh-CN': () => '房间设置' as const,
    'zh-TW': () => '房間設定' as const,
  },
  createRoomLimitUsers: {
    'en-US': () => 'User Limit' as const,
    'zh-CN': () => '人数限制' as const,
    'zh-TW': () => '人數限制' as const,
  },
  createRoomUserLimitStatus: {
    'en-US': (limit: number | string) => `Unlimited | ${limit} people` as const,
    'zh-CN': (limit: number | string) => `不限制 | ${limit} 人` as const,
    'zh-TW': (limit: number | string) => `無限制 | ${limit} 人` as const,
  },
  createRoomLimitPassword: {
    'en-US': () => 'Password' as const,
    'zh-CN': () => '密码限制' as const,
    'zh-TW': () => '密碼限制' as const,
  },
  createRoomPasswordStatus: {
    'en-US': (status: string) => `Password: ${status}` as const,
    'zh-CN': (status: string) => `密码: ${status}` as const,
    'zh-TW': (status: string) => `密碼: ${status}` as const,
  },
  passwordStatusSet: {
    'en-US': () => 'Set' as const,
    'zh-CN': () => '已设置' as const,
    'zh-TW': () => '已設定' as const,
  },
  createRoomSubmitButton: {
    'en-US': () => 'Create Room >' as const,
    'zh-CN': () => '创建房间 >' as const,
    'zh-TW': () => '創建房間 >' as const,
  },

  // CreateRoomOK
  createRoomOKTitle: {
    'en-US': () => 'Creation successful, nya!' as const,
    'zh-CN': () => '创建成功喵！' as const,
    'zh-TW': () => '創建成功喵！' as const,
  },
  createRoomOKGoToHome: {
    'en-US': () => 'Back to Home' as const,
    'zh-CN': () => '返回首页' as const,
    'zh-TW': () => '返回首頁' as const,
  },
  createRoomOKGoToRoom: {
    'en-US': () => 'Enter Room' as const,
    'zh-CN': () => '进入房间' as const,
    'zh-TW': () => '進入房間' as const,
  },

  // CreateRoomPage Errors
  createRoomError_fileTooLarge: {
    'en-US': () =>
      'Image size cannot exceed 10MB, nya! Please select a smaller image, nya!' as const,
    'zh-CN': () => '图片大小不能超过 10MB 喵，请选择更小的图片喵' as const,
    'zh-TW': () => '圖片大小不能超過 10MB 喵，請選擇更小的圖片喵' as const,
  },
  createRoomError_notLoggedIn: {
    'en-US': () => 'Please log in first, nya!' as const,
    'zh-CN': () => '请先登陆喵' as const,
    'zh-TW': () => '請先登陸喵' as const,
  },
  createRoomError_noCover: {
    'en-US': () => 'Please upload a cover image, nya!' as const,
    'zh-CN': () => '请上传封面喵' as const,
    'zh-TW': () => '請上傳封面喵' as const,
  },
  createRoomError_noTitle: {
    'en-US': () => 'Please enter a title, nya!' as const,
    'zh-CN': () => '请输入标题喵' as const,
    'zh-TW': () => '請輸入標題喵' as const,
  },
  createRoomError_creationFailed: {
    'en-US': () =>
      'Failed to create room, nya! Please try again later, nya!' as const,
    'zh-CN': () => '创建房间失败喵，请稍后再试喵' as const,
    'zh-TW': () => '創建房間失敗喵，請稍後再試喵' as const,
  },
} as const satisfies I18nMessagesSatisfiesType
