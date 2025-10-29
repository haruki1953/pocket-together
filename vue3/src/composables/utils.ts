/**
 * useAutoCyclicValue
 * 自动在值列表中周期切换，组件挂载时启动，卸载时停止。
 *
 * @param values 要循环的值列表
 * @param intervalMs 每次切换的间隔时间（毫秒）
 * @returns 当前值（响应式）
 */
export const useAutoCyclicValue = <T>(values: T[], intervalMs = 2000) => {
  const currentIndex = ref(0)
  const currentValue = ref(values[0])

  let isActive = true

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function loop() {
    while (isActive) {
      await sleep(intervalMs)
      currentIndex.value = (currentIndex.value + 1) % values.length
      currentValue.value = values[currentIndex.value]
    }
  }

  onMounted(() => {
    isActive = true
    loop()
  })

  onUnmounted(() => {
    isActive = false
  })

  return currentValue
}
