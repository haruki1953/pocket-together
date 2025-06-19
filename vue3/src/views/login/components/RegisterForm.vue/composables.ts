import type { RegisterFormForm, RegisterFormFormModel } from './index.vue'
import { PotoFormValidationError } from '@/class'
import { pb, UsersLevelOptions, Collections, type Create } from '@/lib'
import { useI18nStore } from '@/stores'
import { potoMessage } from '@/utils'
import type { FormRules } from 'element-plus'
import { ClientResponseError } from 'pocketbase'

/**
 * 封装了表单规则相关
 *
 * @param {{ formModel: RegisterFormFormModel }} data
 * @return {*}
 */
export const useRegisterFormRules = (data: {
  formModel: RegisterFormFormModel
}) => {
  const { formModel } = data

  const i18nStore = useI18nStore()

  // 记录错误的表单项，以便在规则中判断并使用
  // 在提交时，如果出现错误，就会判断错误信息并向对应List添加错误的值
  // 已存在的用户名
  const errorUsernameList_validation_not_unique = ref<string[]>([])
  // 已存在的邮箱
  const errorEmailList_validation_not_unique = ref<string[]>([])

  // 为避免切换语言时触发required校验的问题，默认不添加required规则
  // 提交前isPrepareToSubmit将设置为true，此时再应用非空校验
  const isPrepareToSubmit = ref(false)

  const rules = computed<FormRules<typeof formModel>>(() => {
    return {
      username: [
        ...(() => {
          if (isPrepareToSubmit.value) {
            return [
              {
                required: true,
                message: i18nStore.t('loginRulesUsernameRequiredMessage')(),
                trigger: 'blur',
              },
            ]
          }
          return []
        })(),

        {
          pattern: /^[a-zA-Z0-9_]{1,32}$/,
          message: i18nStore.t('loginRulesUsernamePatternMessage')(),
          trigger: 'blur',
        },

        {
          validator: (rule, value, callback) => {
            if (
              errorUsernameList_validation_not_unique.value.includes(
                formModel.value.username
              )
            ) {
              callback(
                new Error(
                  i18nStore.t('registerRulesUsernameValidatorNotUnique')()
                )
              )
            } else {
              callback()
            }
          },
          trigger: 'blur',
        },
      ],
      password: [
        ...(() => {
          if (isPrepareToSubmit.value) {
            return [
              {
                required: true,
                message: i18nStore.t('loginRulesPasswordRequiredMessage')(),
                trigger: 'blur',
              },
            ]
          }
          return []
        })(),

        {
          pattern: /^.{8,}$/,
          message: i18nStore.t('loginRulesPasswordPatternMessage')(),
          trigger: 'blur',
        },
      ],
      passwordConfirm: [
        ...(() => {
          if (isPrepareToSubmit.value) {
            return [
              {
                required: true,
                message: i18nStore.t(
                  'registerRulesPasswordConfirmRequiredMessage'
                )(),
                trigger: 'blur',
              },
            ]
          }
          return []
        })(),

        {
          validator: (rule, value, callback) => {
            if (value !== formModel.value.password) {
              callback(
                new Error(
                  i18nStore.t('registerRulesPasswordConfirmValidatorMessage')()
                )
              )
            } else {
              callback()
            }
          },
          trigger: 'blur',
        },
      ],
      email: [
        ...(() => {
          if (isPrepareToSubmit.value) {
            return [
              {
                required: true,
                message: i18nStore.t('registerRulesEmailRequiredMessage')(),
                trigger: 'blur',
              },
            ]
          }
          return []
        })(),

        {
          type: 'email',
          message: i18nStore.t('registerRulesEmailTypeMessage')(),
          trigger: 'blur',
        },

        {
          validator: (rule, value, callback) => {
            if (
              errorEmailList_validation_not_unique.value.includes(
                formModel.value.email
              )
            ) {
              callback(
                new Error(i18nStore.t('registerRulesEmailValidatorNotUnique')())
              )
            } else {
              callback()
            }
          },
          trigger: 'blur',
        },
      ],
    }
  })

  return {
    rules,
    isPrepareToSubmit,
    errorUsernameList_validation_not_unique,
    errorEmailList_validation_not_unique,
  }
}

/**
 * 封装了提交函数相关
 *
 * @param {{
 *   formModel: RegisterFormFormModel
 *   form: RegisterFormForm
 *   isPrepareToSubmit: ReturnType<
 *     typeof useRegisterFormRules
 *   >['isPrepareToSubmit']
 *   errorEmailList_validation_not_unique: ReturnType<
 *     typeof useRegisterFormRules
 *   >['errorEmailList_validation_not_unique']
 *   errorUsernameList_validation_not_unique: ReturnType<
 *     typeof useRegisterFormRules
 *   >['errorUsernameList_validation_not_unique']
 * }} data
 * @return {*}
 */
export const useRegisterFormSubmit = (data: {
  formModel: RegisterFormFormModel
  form: RegisterFormForm
  isPrepareToSubmit: ReturnType<
    typeof useRegisterFormRules
  >['isPrepareToSubmit']
  errorEmailList_validation_not_unique: ReturnType<
    typeof useRegisterFormRules
  >['errorEmailList_validation_not_unique']
  errorUsernameList_validation_not_unique: ReturnType<
    typeof useRegisterFormRules
  >['errorUsernameList_validation_not_unique']
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
