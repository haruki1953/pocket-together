import { useMutation } from '@tanstack/vue-query'
import { PotoFormValidationError } from '@/classes'
import { pb, UsersLevelOptions, Collections, type Create } from '@/lib'
import { useI18nStore } from '@/stores'
import { fetchWithTimeoutPreferred, potoMessage } from '@/utils'
import { ClientResponseError } from 'pocketbase'
import type { useRegisterFormRules } from './rules'
import type { RegisterFormForm, RegisterFormFormModel } from './dependencise'

type RegisterFormRules = ReturnType<typeof useRegisterFormRules>

/**
 * 封装了提交函数相关（使用 useMutation 管理状态与副作用）
 */
export const useRegisterFormSubmit = (data: {
  formModel: RegisterFormFormModel
  form: RegisterFormForm
  isPrepareToSubmit: RegisterFormRules['isPrepareToSubmit']
  errorEmailList_validation_not_unique: RegisterFormRules['errorEmailList_validation_not_unique']
  errorUsernameList_validation_not_unique: RegisterFormRules['errorUsernameList_validation_not_unique']
}) => {
  const {
    formModel,
    form,
    isPrepareToSubmit,
    errorEmailList_validation_not_unique,
    errorUsernameList_validation_not_unique,
  } = data

  const i18nStore = useI18nStore()

  const mutation = useMutation({
    // 提交逻辑
    mutationFn: async () => {
      // 提交前，优化调整一些校验规则
      if (isPrepareToSubmit.value === false) {
        isPrepareToSubmit.value = true
        // 设置 isPrepareToSubmit 后，最好等待一会以免计算属性未更新
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
      // 表单校验
      await form.value?.validate().catch(() => {
        throw new PotoFormValidationError()
      })

      // 准备数据
      const createData: Create<Collections.Users> = {
        username: formModel.value.username,
        email: formModel.value.email,
        password: formModel.value.password,
        passwordConfirm: formModel.value.passwordConfirm,
        // 默认等级为basic，如果擅自设置为premium则会被api规则阻止
        level: UsersLevelOptions.basic,
      }

      // 通过 pocketbase SDK 请求
      const pbRes = await pb.collection(Collections.Users).create(createData, {
        // timeout为5000
        fetch: fetchWithTimeoutPreferred,
      })

      console.log(pbRes)
      return pbRes
    },

    // 一些收尾工作
    onSuccess: () => {
      form.value?.resetFields()
      isPrepareToSubmit.value = false
      potoMessage({
        type: 'success',
        message: i18nStore.t('registerSuccess')(),
      })
    },

    // 错误处理
    onError: (error) => {
      if (error instanceof ClientResponseError) {
        if (error.data?.data?.username?.code === 'validation_not_unique') {
          // 用户名已存在
          errorUsernameList_validation_not_unique.value.push(
            formModel.value.username
          )
        }
        if (error.data?.data?.email?.code === 'validation_not_unique') {
          // 邮箱已存在
          errorEmailList_validation_not_unique.value.push(formModel.value.email)
        }
        // 触发校验以显示错误
        form.value?.validate()
      } else if (error instanceof PotoFormValidationError) {
        // 这是表单校验抛出的错误，什么都不用做
      } else {
        // 未知错误
        potoMessage({
          type: 'error',
          message: i18nStore.t('registerFailedErrorUnknow')(),
        })
      }
    },

    // ✅ 仅在 fetch 被 AbortController 中断（超时）时进行重试（最多重试 2 次）(请求三次)
    retry: (failureCount, error) => {
      const isTimeout =
        error instanceof ClientResponseError && error.isAbort === true
      const hasAttemptsLeft = failureCount < 2
      console.log(failureCount)
      return isTimeout && hasAttemptsLeft
    },
  })

  return {
    isSubmitting: mutation.isPending,
    submit: mutation.mutateAsync,
  }
}
