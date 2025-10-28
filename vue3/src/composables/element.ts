import { useResizeObserver } from '@vueuse/core'

/**
 * useElementScrollMetrics
 *
 * 响应式获取滚动容器的 scrollHeight 和 clientHeight。
 * 同时监听容器元素（wrap）和内容元素（view）的尺寸变化，确保高度信息实时更新。
 *
 * Reactively tracks `scrollHeight` and `clientHeight` of a scrollable container.
 * Observes both the wrapper element and its inner content to ensure accurate updates.
 *
 * @param {ComputedRef<HTMLElement | null | undefined>} targetWrap - 滚动容器元素的 ref，通常是具有 overflow 的外层元素
 * @param {ComputedRef<HTMLElement | null | undefined>} targetView - 内容区域元素的 ref，通常是撑开 scrollHeight 的内层元素
 *
 * @returns {{
 *   scrollHeight: Ref<number>,
 *   clientHeight: Ref<number>
 * }} 返回一个对象，包含响应式的 scrollHeight 和 clientHeight
 *
 * @example
 * ```ts
 * const wrap = ref<HTMLElement | null>(null)
 * const view = ref<HTMLElement | null>(null)
 * const { scrollHeight, clientHeight } = useElementScrollMetrics(computed(() => wrap.value), computed(() => view.value))
 * ```
 *
 * @remarks
 * - `scrollHeight` 表示容器内容的总高度（包括不可见部分）
 * - `clientHeight` 表示容器的可视区域高度
 * - 如果内容变化不会触发容器尺寸变化，监听 `targetView` 是必要的
 * - 若需监听 `scrollTop`，请结合 `useScroll` 使用
 */

export const useElementScrollMetrics = (
  targetWrap: ComputedRef<HTMLElement | null | undefined>,
  targetView: ComputedRef<HTMLElement | null | undefined>
) => {
  const scrollHeight = ref(0)
  const clientHeight = ref(0)

  const updateMetrics = () => {
    if (targetWrap.value) {
      scrollHeight.value = targetWrap.value.scrollHeight
      clientHeight.value = targetWrap.value.clientHeight
    }
  }

  useResizeObserver(targetWrap, updateMetrics)
  useResizeObserver(targetView, updateMetrics)

  return { scrollHeight, clientHeight }
}
