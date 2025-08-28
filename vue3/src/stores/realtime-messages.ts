import { Collections, pb } from '@/lib'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/** 用于储存订阅的实时Messages */
export const useRealtimeMessagesStore = defineStore(
  'pocket-together-realtime-messages',
  () => {
    // 储存订阅得到的消息
    const messagesListRef = ref([])
    const messagesList = computed(() => messagesListRef.value)

    // 启动订阅，将在App.vue调用
    const startSubscribe = () => {
      pb.collection(Collections.Messages).subscribe('*', (e) => {
        console.log(e)
      })
    }

    return {
      //
      messagesList,
      startSubscribe,
    }
  },
  {
    persist: true, // 持久化
  }
)
