import { rulesPassword, rulesUsername } from '@/config'
import type { RegisterFormFormModel } from './dependencise'
import { useI18nStore } from '@/stores'
import type { FormRules } from 'element-plus'

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
                message: i18nStore.t('registerRulesUsernameRequiredMessage')(),
                trigger: 'blur',
              },
            ]
          }
          return []
        })(),

        {
          // 字符规则 Char
          pattern: rulesUsername.patternChar,
          message: i18nStore.t('registerRulesUsernamePatternCharMessage')(),
          trigger: 'blur',
        },
        {
          // 长度规则 Length
          pattern: rulesUsername.patternLength,
          message: i18nStore.t('registerRulesUsernamePatternLengthMessage')(),
          trigger: 'blur',
        },
        {
          // 已存在的用户名记录数组中如果有当前值，则表示此用户名已存在
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
                message: i18nStore.t('registerRulesPasswordRequiredMessage')(),
                trigger: 'blur',
              },
            ]
          }
          return []
        })(),

        {
          pattern: rulesPassword.patternMinLength,
          message: i18nStore.t('registerRulesPasswordPatternMessage')(),
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
