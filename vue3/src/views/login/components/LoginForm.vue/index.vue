<script setup lang="ts">
import { useI18nStore } from '@/stores'
import type { ElForm } from 'element-plus'
import { useLoginFormRules, useLoginFormSubmit } from './composables'

const i18nStore = useI18nStore()

const formModel = ref({
  usernameOrEmail: '',
  password: '',
})
export type LoginFormFormModel = typeof formModel
const form = ref<InstanceType<typeof ElForm> | null>(null)
export type LoginFormForm = typeof form

// 封装了表单规则相关
const { rules, isPrepareToSubmit } = useLoginFormRules({
  formModel,
})

// 封装了提交函数相关
const { isSubmitting, submit } = useLoginFormSubmit({
  form,
  formModel,
  isPrepareToSubmit,
})
</script>

<template>
  <ElForm
    ref="form"
    :model="formModel"
    :rules="rules"
    size="large"
    class="poto-el-form-line"
  >
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
    @click="submit()"
  >
    <span class="font-bold">
      {{ i18nStore.t('loginButtonText')() }}
    </span>
  </ElButton>
  <div class="relative h-2">
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
