/**
 * 导航栏布局配置
 */
export const layoutLayoutNavConfig = {
  /**
   * 导航栏布局配置
   * rightNav >= 768 > botttomNav |
   * 大于等于768将显示右侧导航栏，小于768将显示底部导航栏
   * useWindowSize
   */
  breakpointNavRightToNavBottom: 768,
  /**
   * 小屏时底部导航栏的高度
   */
  navBottomHeight: 80,
} as const

/**
 * 登录页布局配置
 */
export const layoutLoginPageConfig = {
  /**
   * Col2 >= 768 > Col1
   * 大于等于768显示两列，小于则显示一列
   * useWindowSize
   */
  breakpointCol2ToCol1: 768,
} as const

/**
 * 设置页及其导航栏布局配置
 */
export const layoutSettingPageConfig = {
  /**
   * leftNav >= 768 > topNav |
   * 大于等于768将显示左侧导航栏，小于768将显示顶部导航栏
   * 和 全局导航栏 类似
   * useWindowSize
   */
  breakpointNavLeftToNavTop:
    layoutLayoutNavConfig.breakpointNavRightToNavBottom,
  /**
   * 导航栏位于顶部时（小屏），内容的最大宽度
   */
  contentMaxWidthOnNavTop: 500,
  /**
   * 窗口大于等于1024显示两列，小于则显示一列
   * useWindowSize
   */
  breakpointContentCol2ToCol1: 1024,
} as const

/** 全局聊天页布局配置 */
export const layoutChatPageConfig = {
  /**
   * Col2 >= 768 > Col1
   * 大于等于768显示两列，小于则显示一列（只显示用户列表，聊天在另外的页面）
   * useWindowSize
   */
  breakpointCol2ToCol1: 768,
  /**
   * Width500 >= 1024 > Width400
   * 大于1024时聊天栏宽度为500，小于则为400
   * useWindowSize
   */
  breakpointChatWidth5ToWidth4: 1024,
  /**
   * 导航栏位于底部时（小屏），内容的最大宽度
   */
  contentMaxWidthOnNavBottom: 500,
  /** 移动端全局聊天页最大宽度 */
  chatPageMobileMaxWidth: 500,
} as const

// 参考
// breakpoints: {
//   xs: 480, // 超小屏幕
//   sm: 640, // 小屏幕
//   md: 768, // 中等屏幕
//   lg: 1024, // 大屏幕
//   xl: 1280, // 超大屏幕
//   '2xl': 1536, // 特大屏幕
// },
