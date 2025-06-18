<script setup lang="ts">
import { useI18nStore } from '@/stores'
import { RiLockUnlockLine, RiMailLine } from '@remixicon/vue'
import type { ElForm, FormRules } from 'element-plus'

const i18nStore = useI18nStore()

const formModel = ref({
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
})

const form = ref<InstanceType<typeof ElForm> | null>(null)

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
    ],
  }
})

const isSubmitting = ref(false)
const submit = async () => {
  isSubmitting.value = true
  try {
    isPrepareToSubmit.value = true
    // 设置 isPrepareToSubmit 后，最好等待一会以免计算属性未更新
    await new Promise((resolve) => setTimeout(resolve, 100))
    await form.value?.validate()
    console.log('通过')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <ElForm ref="form" :model="formModel" :rules="rules" size="large">
    <ElFormItem prop="username">
      <ElInput
        v-model="formModel.username"
        :placeholder="i18nStore.t('loginPlaceholderUsername')()"
        class="poto-el-input-line"
      >
        <template #prefix>
          <RiUser4Line size="16px"></RiUser4Line>
        </template>
      </ElInput>
    </ElFormItem>
    <ElFormItem prop="email">
      <ElInput
        v-model="formModel.email"
        :placeholder="i18nStore.t('registerPlaceholderEmail')()"
        class="poto-el-input-line"
      >
        <template #prefix>
          <RiMailLine size="16px"></RiMailLine>
        </template>
      </ElInput>
    </ElFormItem>
    <ElFormItem prop="password">
      <ElInput
        v-model="formModel.password"
        :placeholder="i18nStore.t('loginPlaceholderPassword')()"
        class="poto-el-input-line"
      >
        <template #prefix>
          <RiLockUnlockLine size="16px"></RiLockUnlockLine>
        </template>
      </ElInput>
    </ElFormItem>
    <ElFormItem prop="passwordConfirm">
      <ElInput
        v-model="formModel.passwordConfirm"
        :placeholder="i18nStore.t('registerPlaceholderPasswordConfirm')()"
        class="poto-el-input-line"
      >
        <template #prefix>
          <RiLockLine size="16px"></RiLockLine>
        </template>
      </ElInput>
    </ElFormItem>
  </ElForm>
  <ElButton
    :loading="isSubmitting"
    class="w-full"
    type="primary"
    round
    size="large"
    @click="submit"
  >
    <span class="font-bold">
      {{ i18nStore.t('registerButtonText')() }}
    </span>
  </ElButton>
</template>

<style lang="scss" scoped>
.el-form {
  :deep() {
    .el-form-item__error {
      // position: static;
      z-index: 1;
    }
  }
}
</style>
