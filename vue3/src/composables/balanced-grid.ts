// composables/useBalancedGrid.ts
import type { Ref } from 'vue'
import { ref, computed } from 'vue'
import { useElementSize } from '@vueuse/core'

/**
 * 根据容器宽度和每项宽度，将项目列表均匀地分配成二维网格布局。
 *
 * @template T 任意类型的项目（div、组件、模型等）
 * @param {Ref<HTMLElement | null>} containerRef - 绑定容器的 ref，用于监听宽度变化
 * @param {Ref<T[]>} items - 待布局的项目数组
 * @param {Ref<number>} itemWidth - 每项期望宽度（单位：像素）
 * @returns {{
 *   grid: Ref<T[][]>,               // 每一行的项目数组
 *   containerWidth: Ref<number>    // 当前容器宽度（响应式）
 * }}
 *
 * @example
 * const containerRef = ref<HTMLElement | null>(null)
 * const items = ref([{ id: 1 }, { id: 2 }, { id: 3 }])
 * const itemWidth = ref(120)
 * const { grid } = useBalancedGrid(containerRef, items, itemWidth)
 */
export const useBalancedGrid = <T>(
  containerRef: Ref<HTMLElement | null>,
  items: Ref<T[]>,
  itemWidth: Ref<number>
): {
  grid: Ref<T[][]> // 每一行的项目数组
  containerWidth: Ref<number> // 当前容器宽度（响应式）
} => {
  // 使用 vueuse 监听容器宽度变化（支持响应式）
  const { width: containerWidth } = useElementSize(containerRef)

  const grid = computed(() => {
    const totalWidth = containerWidth.value
    const widthPerItem = itemWidth.value
    const totalItems = items.value.length

    // ⚠️ 边界处理：如果无内容或宽度非法，返回空数组
    if (totalItems === 0 || totalWidth <= 0 || widthPerItem <= 0) {
      return []
    }

    // 📏 如果容器不足放下两个项目，强制每项单独成行
    if (totalWidth < widthPerItem * 2) {
      return items.value.map((item) => [item])
    }

    // 🧮 计算理论上一行最多可放多少个元素
    const itemsPerRow = Math.floor(totalWidth / widthPerItem)
    // ⛓️ 总共需要多少行（向上取整）
    const totalRows = Math.ceil(totalItems / itemsPerRow)

    // 🎯 每行应分配的基础数量（平均分配）
    const baseCount = Math.floor(totalItems / totalRows)
    // 🧩 有多少行需要比其他行多放一个（用来填平）
    const extraRows = totalItems % totalRows

    const gridRows: T[][] = []
    let index = 0

    for (let row = 0; row < totalRows; row++) {
      // 📊 前 extraRows 行平均分配 baseCount + 1 个
      const count = row < extraRows ? baseCount + 1 : baseCount
      gridRows.push(items.value.slice(index, index + count))
      index += count
    }

    return gridRows
  })

  return {
    grid, // 最终布局结果（二维数组）
    containerWidth, // 当前容器宽度（响应式，可用于调试）
  }
}
