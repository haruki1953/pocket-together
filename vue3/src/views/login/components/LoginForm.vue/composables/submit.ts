import { Collections, pb } from '@/lib'
import { useI18nStore } from '@/stores'
import { potoMessage } from '@/utils'
import type { useLoginFormRules } from './rules'
import type { LoginFormForm, LoginFormFormModel } from './dependencies'

type LoginFormRules = ReturnType<typeof useLoginFormRules>

/**
 * 封装了提交函数相关
 */
export const useLoginFormSubmit = (data: {
  formModel: LoginFormFormModel
  form: LoginFormForm
  isPrepareToSubmit: LoginFormRules['isPrepareToSubmit']
}) => {
  const { formModel, form, isPrepareToSubmit } = data

  const i18nStore = useI18nStore()

  const isSubmitting = ref(false)
  const submit = async () => {
    isSubmitting.value = true
    try {
      isPrepareToSubmit.value = true
      // 设置 isPrepareToSubmit 后，最好等待一会以免计算属性未更新
      await new Promise((resolve) => setTimeout(resolve, 500))
      await form.value?.validate()

      const pbRes = await pb
        .collection(Collections.Users)
        .authWithPassword(
          formModel.value.usernameOrEmail,
          formModel.value.password
        )

      console.log(pbRes)
      // 一些收尾工作
      // form.value?.resetFields()
      // isPrepareToSubmit.value = false
      potoMessage({
        type: 'success',
        message: i18nStore.t('loginSuccess')(),
      })
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isSubmitting,
    submit,
  }
}
