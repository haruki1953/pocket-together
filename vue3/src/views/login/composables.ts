import { useElementSize } from '@vueuse/core'

export const useLoginPageBoxLeftRightStyle = () => {
  // 控制左右两栏的圆角样式
  const refBoxLeft = ref<HTMLElement | null>()
  const refBoxRight = ref<HTMLElement | null>()
  const { height: heightBoxLeft } = useElementSize(refBoxLeft)
  const { height: heightBoxRight } = useElementSize(refBoxRight)
  const styleBoxLeftRight = computed(() => {
    const maxRadius = 24
    if (heightBoxLeft.value > heightBoxRight.value) {
      const heightDifference = heightBoxLeft.value - heightBoxRight.value
      const borderRadius = (() => {
        if (heightDifference / 2 < maxRadius) {
          return heightDifference / 2
        }
        return maxRadius
      })()
      return {
        left: {
          borderTopRightRadius: `${borderRadius}px`,
          borderBottomRightRadius: `${borderRadius}px`,
        },
        right: {
          borderTopLeftRadius: '0',
          borderBottomLeftRadius: '0',
        },
      }
    } else if (heightBoxLeft.value < heightBoxRight.value) {
      const heightDifference = heightBoxRight.value - heightBoxLeft.value
      const borderRadius = (() => {
        if (heightDifference / 2 < maxRadius) {
          return heightDifference / 2
        }
        return maxRadius
      })()
      return {
        left: {
          borderTopRightRadius: '0',
          borderBottomRightRadius: '0',
        },
        right: {
          borderTopLeftRadius: `${borderRadius}px`,
          borderBottomLeftRadius: `${borderRadius}px`,
        },
      }
    } else {
      return {
        left: {
          borderTopRightRadius: '0',
          borderBottomRightRadius: '0',
        },
        right: {
          borderTopLeftRadius: '0',
          borderBottomLeftRadius: '0',
        },
      }
    }
  })

  return {
    refBoxLeft,
    refBoxRight,
    styleBoxLeftRight,
  }
}
