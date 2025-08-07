import { useNow } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStateStore = defineStore(
  'pocket-together-setting-state',
  () => {
    // 邮箱修改
    /** 用于邮箱修改，记录已提交的、要修改为的邮箱 */
    const emailUpdatePendingVerificationEmail = ref('')
    /** 用于邮箱修改，记录上次提交的时间，以此实现速率限制 */
    const emailUpdateLastSubmitDate = ref('')
    /** 用于邮箱修改，提交后调用此函数来设置信息 */
    const emailUpdateRateLimitSet = (data: {
      emailUpdatePendingVerificationEmail: string
    }) => {
      emailUpdatePendingVerificationEmail.value =
        data.emailUpdatePendingVerificationEmail
      emailUpdateLastSubmitDate.value = new Date().toISOString()
    }

    // 邮箱验证
    /** 用于邮箱验证，记录已提交的邮箱 */
    const emailVerifyPendingVerificationEmail = ref('')
    /** 用于邮箱验证，记录上次提交的时间，以此实现速率限制 */
    const emailVerifyLastSubmitDate = ref('')
    /** 用于邮箱验证，提交后调用此函数来设置信息 */
    const emailVerifyRateLimitSet = (data: {
      emailVerifyPendingVerificationEmail: string
    }) => {
      emailVerifyPendingVerificationEmail.value =
        data.emailVerifyPendingVerificationEmail
      emailVerifyLastSubmitDate.value = new Date().toISOString()
    }

    // 密码修改
    /** 用于密码修改，记录已提交的邮箱 */
    const passwordUpdatePendingVerificationEmail = ref('')
    /** 用于密码修改，记录上次提交的时间，以此实现速率限制 */
    const passwordUpdateLastSubmitDate = ref('')
    /** 用于密码修改，提交后调用此函数来设置信息 */
    const passwordUpdateRateLimitSet = (data: {
      passwordUpdatePendingVerificationEmail: string
    }) => {
      passwordUpdatePendingVerificationEmail.value =
        data.passwordUpdatePendingVerificationEmail
      passwordUpdateLastSubmitDate.value = new Date().toISOString()
    }

    return {
      emailUpdatePendingVerificationEmail,
      emailUpdateLastSubmitDate,
      emailUpdateRateLimitSet,
      emailVerifyPendingVerificationEmail,
      emailVerifyLastSubmitDate,
      emailVerifyRateLimitSet,
      passwordUpdatePendingVerificationEmail,
      passwordUpdateLastSubmitDate,
      passwordUpdateRateLimitSet,
    }
  },
  {
    persist: true, // 持久化
  }
)
