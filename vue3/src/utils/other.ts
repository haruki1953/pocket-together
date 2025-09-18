import type { useRouter } from 'vue-router'

export const potoGoBack = (router: ReturnType<typeof useRouter>) => {
  if (window.history.length > 2) {
    router.back()
  } else {
    // 如果没有历史记录，则导航到首页
    router.push('/')
  }
}

// 打开链接
export const openLink = (url: string) => {
  window.open(url, '_blank')
}

// // 生成随机密钥
// export const generateRandomKey = (length: number = 16) => {
//   const array = new Uint8Array(length)
//   window.crypto.getRandomValues(array)
//   return btoa(String.fromCharCode(...array))
// }
// // 生成随机类名
// export const generateRandomClassName = (length?: number) => {
//   return generateRandomKey(length).replace(/[^a-zA-Z]/g, '')
// }
// 使用预设字符集生成随机字符串
export const generateRandomKey = (length: number = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    result += chars[randomIndex]
  }
  return result
}
export const generateRandomClassName = (length?: number) => {
  return generateRandomKey(length)
}

export const getScrollbarWidth = () => {
  // 创建一个带有滚动条的隐藏元素
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll' // 强制显示滚动条
  document.body.appendChild(outer)

  // 创建一个内部元素
  const inner = document.createElement('div')
  outer.appendChild(inner)

  // 计算滚动条的宽度
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

  // 移除临时元素
  outer.parentNode?.removeChild(outer)

  return scrollbarWidth
}

export const arraysEqual = (arr1: number[], arr2: number[]): boolean => {
  if (arr1.length !== arr2.length) return false
  const sortedArr1 = [...arr1].sort((a, b) => a - b)
  const sortedArr2 = [...arr2].sort((a, b) => a - b)
  return sortedArr1.every((value, index) => value === sortedArr2[index])
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '无'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const size = bytes / Math.pow(k, i)
  return (i < 2 ? size.toFixed(0) : size.toFixed(1)) + sizes[i]
}

// 拼接 url
export const urlJoinUtil = (...segments: string[]): string => {
  // 是否以斜杠开头，是则在最后加上斜杠
  const isStartsWithSlash = (() => {
    if (segments.length > 0 && segments[0].startsWith('/')) {
      return true
    }
    return false
  })()

  // 合并路径并确保正确的斜杠
  const joinedStr = segments
    .map((segment) => segment.replace(/(^\/+|\/+$)/g, '')) // 去除前后多余的斜杠
    .filter(Boolean) // 删除空值
    .join('/') // 用单个斜杠连接

  if (isStartsWithSlash) {
    return '/' + joinedStr
  }
  return joinedStr
}

// 将字符串的首字母大写
export const capitalizeFirstLetter = (str: string) => {
  return str.replace(/^\S/, (char) => char.toUpperCase())
}

/**
 * 生成指定范围内的随机整数（包含 min 和 max）
 * 参数顺序不敏感，会自动处理 min/max 的大小关系
 * @param a 任意一个边界值
 * @param b 另一个边界值
 * @returns 随机整数
 */
export const generateRandomIntegerBetween = (a: number, b: number): number => {
  const min = Math.min(a, b)
  const max = Math.max(a, b)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 将滚动容器滚动至指定子元素的位置，使其垂直方向进入可视区域。
 *
 * 使用 getBoundingClientRect 计算目标元素相对于容器的偏移量，
 * 然后通过 scrollTo 方法控制容器滚动。支持额外偏移量设置，可用于微调定位。
 *
 * @param container - 滚动容器元素，必须是 HTMLDivElement。
 * @param target - 目标子元素，必须是容器内的 HTMLElement。
 * @param behavior - 可选的滚动行为，可设置为 "auto"（默认）、"instant"（立即滚动）、"smooth"（平滑滚动）。
 * @param offset - 可选的额外偏移量（单位 px），用于在滚动定位基础上进行微调。正值向下偏移，负值向上偏移。
 *
 * @example
 * // 默认立即滚动至目标元素顶部
 * scrollToElementInContainer(container, target);
 *
 * // 平滑滚动至目标元素
 * scrollToElementInContainer(container, target, 'smooth');
 *
 * // 平滑滚动至目标元素向下偏移 20px 的位置
 * scrollToElementInContainer(container, target, 'smooth', 20);
 *
 * // 立即滚动至目标元素向上偏移 50px 的位置
 * scrollToElementInContainer(container, target, 'instant', -50);
 */

export const scrollToElementInContainer = (
  container: HTMLDivElement,
  target: HTMLElement,
  behavior?: ScrollBehavior,
  offset?: number
): void => {
  const containerRect = container.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()

  const topVal = targetRect.top - containerRect.top + container.scrollTop
  const topValWidthOffset = (() => {
    // 未设置 offset ，返回 topVal
    if (offset == null) {
      return topVal
    }
    // offset 有值，返回 topVal 与 offset 之和
    return topVal + offset
  })()

  container.scrollTo({
    top: topValWidthOffset,
    behavior,
  })
}
