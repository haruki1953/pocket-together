import type { RegisterFormForm, RegisterFormFormModel } from './dependencise'
import { PotoFormValidationError } from '@/classes'
import { pb, UsersLevelOptions, Collections, type Create } from '@/lib'
import { useI18nStore } from '@/stores'
import { potoMessage } from '@/utils'
import { ClientResponseError } from 'pocketbase'
import type { useRegisterFormRules } from './rules'

type RegisterFormRules = ReturnType<typeof useRegisterFormRules>

/**
 * 封装了提交函数相关
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

  const isSubmitting = ref(false)
  const submit = async () => {
    isSubmitting.value = true
    try {
      isPrepareToSubmit.value = true
      // 设置 isPrepareToSubmit 后，最好等待一会以免计算属性未更新
      await new Promise((resolve) => setTimeout(resolve, 500))
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
      const pbRes = await pb.collection(Collections.Users).create(createData)
      console.log(pbRes)

      // 一些收尾工作
      form.value?.resetFields()
      isPrepareToSubmit.value = false
      potoMessage({
        type: 'success',
        message: i18nStore.t('registerSuccess')(),
      })
    } catch (error) {
      // 错误处理
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
      // ClientResponseError 400: Failed to create record.
      console.log(error)
      // console.log((error as any).data)
      /* 错误示例
{
  "data": {
    "username": {
      "code": "validation_not_unique",
      "message": "Value must be unique."
    }
  },
  "message": "Failed to create record.",
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
