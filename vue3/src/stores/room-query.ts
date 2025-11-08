import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义一个用于管理房间查询参数的 store
export const useRoomQueryStore = defineStore('room-query', () => {
  // 搜索词状态
  const searchTerm = ref('')
  // 是否为只看用户的房间
  const onlyUserRooms = ref(false)
  // 只看收藏吗
  const onlyJoinRooms = ref(false)

  // 返回状态，以便在组件中使用
  return {
    searchTerm,
    onlyUserRooms,
    onlyJoinRooms,
  }
})
