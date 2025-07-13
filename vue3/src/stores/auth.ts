import type { pb } from '@/lib'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * pb.authStore 的主要内容，将其响应式
 *
 * 对于不需要响应式的地方，还是推荐使用 pb.authStore
 */
export const useAuthStore = defineStore(
  'pocket-together-auth',
  () => {
    // pb.authStore 的主要内容，将其响应式
    const record = ref<typeof pb.authStore.record>(null)
    const token = ref('')
    const isValid = ref(false)
    const isSuperuser = ref(false)

    // 设置 AuthStore，在 pb.authStore.onChange 时传入 pb.authStore
    const setAuth = (data: {
      record: typeof pb.authStore.record
      token: string
      isValid: boolean
      isSuperuser: boolean
    }) => {
      record.value = data.record
      token.value = data.token
      isValid.value = data.isValid
      isSuperuser.value = data.isSuperuser
    }

    return {
      record,
      token,
      isValid,
      isSuperuser,
      setAuth,
    }
  },
  {
    persist: true, // 持久化
  }
)
