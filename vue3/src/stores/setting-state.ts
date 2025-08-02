import { useNow } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStateStore = defineStore(
  'pocket-together-setting-state',
  () => {
    // 用于邮箱修改，记录已提交的、要修改为的邮箱
    const emailUpdatePendingVerificationEmail = ref('')
    // 用于邮箱修改，记录上次提交的时间，以此实现速率限制
    const emailUpdateLastSubmitDate = ref('')
    /**
     * 用于邮箱修改，提交后调用此函数来设置信息
     */
    const emailUpdateSet = (data: {
      emailUpdatePendingVerificationEmail: string
    }) => {
      emailUpdatePendingVerificationEmail.value =
        data.emailUpdatePendingVerificationEmail
      emailUpdateLastSubmitDate.value = new Date().toISOString()
    }

    // 【TODO】感觉这些东西放在store里并不好，明天再改
    // 响应式的当前时间，每秒更新一次
    const nowRef = useNow({ interval: 1000 })
    // 邮箱提交最短间隔（速率限制时间，一会要记得封装到config，最终还要实现）
    /**
     * 用于邮箱修改，页面中使用此计算属性获取当前待验证邮件相关信息
     */
    const emailUpdatePendingVerificationInfo = computed(() => {})

    return {}
  },
  {
    persist: true, // 持久化
  }
)
