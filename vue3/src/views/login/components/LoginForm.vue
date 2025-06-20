<script setup lang="ts">
import { Collections, pb } from '@/lib'
import { useI18nStore } from '@/stores'
import { potoMessage } from '@/utils'
import type { ElForm } from 'element-plus'

const i18nStore = useI18nStore()

const formModel = ref({
  usernameOrEmail: '',
  password: '',
})

const form = ref<InstanceType<typeof ElForm> | null>(null)

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
</script>

<template>
  <ElForm ref="form" :model="formModel" :rules="rules" size="large">
    <ElFormItem prop="usernameOrEmail">
      <ElInput
        v-model="formModel.usernameOrEmail"
        :placeholder="i18nStore.t('loginPlaceholderUsernameOrEmail')()"
        name="username"
        class="poto-el-input-line"
      >
        <template #prefix>
          <RiUser4Line size="16px"></RiUser4Line>
        </template>
      </ElInput>
    </ElFormItem>
    <ElFormItem prop="password">
      <ElInput
        v-model="formModel.password"
        type="password"
        :placeholder="i18nStore.t('loginPlaceholderPassword')()"
        name="password"
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
      {{ i18nStore.t('loginButtonText')() }}
    </span>
  </ElButton>
  <div class="relative h-1">
    <div class="absolute top-2 flex w-full items-center justify-between">
      <div class="flex flex-1 justify-start truncate">
        <a
          href="#"
          class="mx-2 truncate text-xs text-el-primary hover:text-el-primary-light-3"
        >
          {{ i18nStore.t('loginForgetText')() }}
        </a>
      </div>
      <div class="flex flex-1 justify-end truncate">
        <a
          href="#"
          class="mx-2 truncate text-xs text-el-primary hover:text-el-primary-light-3"
        >
          {{ i18nStore.t('loginVisitorText')() }}
        </a>
      </div>
    </div>
  </div>
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
