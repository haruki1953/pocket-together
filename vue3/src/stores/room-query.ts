
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义一个用于管理房间查询参数的 store
export const useRoomQueryStore = defineStore('room-query', () => {
  // 使用 ref 创建一个响应式的搜索词状态
  const searchTerm = ref('')

  // 返回状态，以便在组件中使用
  return {
    searchTerm,
  }
})
