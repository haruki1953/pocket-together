<script setup lang="ts">
import { useI18nStore } from '@/stores'
import type { ElForm } from 'element-plus'

const i18nStore = useI18nStore()

const formModel = ref({
  username: '',
  password: '',
})

const form = ref<InstanceType<typeof ElForm> | null>(null)

const rules = computed(() => {
  return {
    username: [
      {
        required: true,
        message: i18nStore.t('loginRulesUsernameRequiredMessage')(),
        trigger: 'blur',
      },
      {
        pattern: /^[a-zA-Z0-9_]{1,32}$/,
        message: i18nStore.t('loginRulesUsernamePatternMessage')(),
        trigger: 'blur',
      },
    ],
    password: [
      {
        required: true,
        message: i18nStore.t('loginRulesPasswordRequiredMessage')(),
        trigger: 'blur',
      },
      {
        pattern: /^.{8,}$/,
        message: i18nStore.t('loginRulesPasswordPatternMessage')(),
        trigger: 'blur',
      },
    ],
  }
})
</script>

<template>
  <ElForm ref="form" :model="formModel" :rules="rules" size="large">
    <ElFormItem prop="username">
      <ElInput
        v-model="formModel.username"
        :placeholder="i18nStore.t('loginPlaceholderUsername')()"
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
    :loading="false"
    class="w-full"
    type="primary"
    round
    size="large"
    @click="() => {}"
  >
    <span class="font-bold">
      {{ i18nStore.t('loginButtonText')() }}
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
