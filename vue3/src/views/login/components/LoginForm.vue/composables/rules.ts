import { useI18nStore } from '@/stores'
import type { LoginFormFormModel } from './dependencies'

/**
 * 封装了表单规则相关
 */
export const useLoginFormRules = (data: {
  //
  formModel: LoginFormFormModel
}) => {
  const { formModel } = data
  const i18nStore = useI18nStore()

  // 为避免切换语言时触发required校验的问题，默认不添加required规则
  // 提交前isPrepareToSubmit将设置为true，此时再应用非空校验
  const isPrepareToSubmit = ref(false)

  const rules = computed(() => {
    return {
      usernameOrEmail: [
        ...(() => {
          if (isPrepareToSubmit.value) {
            return [
              {
                required: true,
                // message: i18nStore.t('loginRulesUsernameRequiredMessage')(),
                message: i18nStore.t(
                  'loginRulesUsernameOrEmailRequiredMessage'
                )(),
                trigger: 'blur',
              },
            ]
          }
          return []
        })(),
        // {
        //   pattern: /^[a-zA-Z0-9_]{1,32}$/,
        //   message: i18nStore.t('loginRulesUsernamePatternMessage')(),
        //   trigger: 'blur',
        // },
        // 将上面的规则拆分为两个
        // {
        //   // 字符规则 Char
        //   pattern: /^[a-zA-Z0-9_]*$/,
        //   message: i18nStore.t('loginRulesUsernamePatternCharMessage')(),
        //   trigger: 'blur',
        // },
        // {
        //   // 长度规则 Length
        //   pattern: /^.{1,32}$/,
        //   message: i18nStore.t('loginRulesUsernamePatternLengthMessage')(),
        //   trigger: 'blur',
        // },
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
    }
  })

  return {
    //
    rules,
    isPrepareToSubmit,
  }
}
