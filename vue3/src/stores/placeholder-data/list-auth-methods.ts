import { defineStore } from 'pinia'
import type { AuthMethodsList } from 'pocketbase'
import { ref } from 'vue'

type ListAuthMethodsQueryData = AuthMethodsList

// 用于 useListAuthMethodsQuery 的 placeholderData
export const usePlaceholderDataListAuthMethodsStore = defineStore(
  'pocket-together-usePlaceholderDataListAuthMethodsStore',
  () => {
    const data = ref<ListAuthMethodsQueryData | null>(null)
    const set = (newData: ListAuthMethodsQueryData | null) => {
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
