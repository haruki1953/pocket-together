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
    const emailUpdateRateLimitSet = (data: {
      emailUpdatePendingVerificationEmail: string
    }) => {
      emailUpdatePendingVerificationEmail.value =
        data.emailUpdatePendingVerificationEmail
      emailUpdateLastSubmitDate.value = new Date().toISOString()
    }

    return {
      emailUpdatePendingVerificationEmail,
      emailUpdateLastSubmitDate,
      emailUpdateRateLimitSet,
    }
  },
  {
    persist: true, // 持久化
  }
)
