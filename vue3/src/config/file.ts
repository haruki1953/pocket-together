/**
 * 用户头像文件相关配置
 */
export const fileUserAvatarConfig = {
  /**
   * 缩略图字符串
   */
  thumb200x200f: '200x200f',
  /**
   * 图片处理 图片大小
   */
  imageResizeNumber: 400,
  /**
   * 图片处理 图片类型
   */
  toBlobType: 'image/jpeg',
  /**
   * 图片处理 图片质量
   */
  toBlobQuality: 0.9,
  /**
   * 图片处理 大小检查 不应大于或等等与 100KB
   */
  imageBlobSizeNotGte: 100000,
} as const
