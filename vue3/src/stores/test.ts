import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTestStore = defineStore(
  'pocket-together-test',
  () => {
    const testVal = ref(0)

    const testValAdd = () => {
      testVal.value += 1
    }

    return {
      testVal,
      testValAdd,
    }
  },
  {
    persist: true, // 持久化
  }
)
