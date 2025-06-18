/**
 * 导航栏布局配置
 */
export const layoutLayoutNavConfig = {
  /**
   * rightNav >= 768 > botttomNav |
   * 大于768将显示右侧导航栏，小于768将显示底部导航栏
   */
  breakpointNavRightToNavBottom: 560,
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
   * 大于768显示两列，小于768显示一列
   */
  breakpointCol2ToCol1: 768,
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
