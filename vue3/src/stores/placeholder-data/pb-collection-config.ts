import type { PbCollectionConfigType } from '@/config'
import { defineStore } from 'pinia'
import { ref } from 'vue'

type PbCollectionConfigQueryData = PbCollectionConfigType

// 用于 usePbCollectionConfigQuery 的 placeholderData
export const usePlaceholderDataPbCollectionConfigStore = defineStore(
  'pocket-together-usePlaceholderDataPbCollectionConfigStore',
  () => {
    const data = ref<PbCollectionConfigQueryData | null>(null)
    const set = (newData: PbCollectionConfigQueryData | null) => {
      data.value = newData
    }
    return {
      data,
      set,
    }
  },
  {
    persist: true, // 持久化
  }
)
