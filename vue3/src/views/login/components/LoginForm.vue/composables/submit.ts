import { Collections, pb } from '@/lib'
import { useI18nStore } from '@/stores'
import { potoMessage } from '@/utils'
import type { useLoginFormRules } from './rules'
import type { LoginFormForm, LoginFormFormModel } from './dependencies'
import { ClientResponseError } from 'pocketbase'
import { PotoFormValidationError } from '@/classes'

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

      // console.log(pbRes)
      // 一些收尾工作
      // form.value?.resetFields()
      // isPrepareToSubmit.value = false
      potoMessage({
        type: 'success',
        message: i18nStore.t('loginSuccess')(),
      })
    } catch (error) {
      // 错误处理
      if (error instanceof ClientResponseError) {
        // 登录失败
        // ClientResponseError 400: Failed to authenticate.
        form.value?.resetFields()
        potoMessage({
          type: 'error',
          message: i18nStore.t('loginFailed')(),
        })
      } else if (error instanceof PotoFormValidationError) {
        // 这是表单校验抛出的错误，什么都不用做
      } else {
        // 未知错误
        potoMessage({
          type: 'error',
          message: i18nStore.t('loginFailedErrorUnknow')(),
        })
      }
      // console.log(error)
      // ClientResponseError 400: Failed to authenticate.
      // console.log((error as any).data)
      /* 错误示例
{
  "data": {},
  "message": "Failed to authenticate.",
  "status": 400
}
      */
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isSubmitting,
    submit,
  }
}
