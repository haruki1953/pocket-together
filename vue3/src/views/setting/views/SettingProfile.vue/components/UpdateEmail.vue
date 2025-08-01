<script setup lang="ts">
import { PotoFormValidationError } from '@/classes'
import type ConfirmContainer from '@/components/tool/ConfirmContainer.vue'
import { Collections, pb } from '@/lib'
import { queryRetryPbNetworkError, useProfileQuery } from '@/queries'
import { useI18nStore } from '@/stores'
import {
  fetchWithTimeoutForPbRequestEmailChange,
  fetchWithTimeoutPreferred,
  potoMessage,
} from '@/utils'
import { useMutation } from '@tanstack/vue-query'
import type { ElForm, FormRules } from 'element-plus'
import { ClientResponseError } from 'pocketbase'

const i18nStore = useI18nStore()

// 个人信息查询
const profileQuery = useProfileQuery()

const formModel = ref({
  email: '',
})
const form = ref<InstanceType<typeof ElForm> | null>(null)
// 当前表单是否已编辑，已编辑则不再跟随profileQuery.data变化
const isEdited = ref(false)
const setEdited = (val: boolean) => {
  isEdited.value = val
}

/**
 * 表示当前表单中的 email 字段是否与远程用户资料中的 email 相同。
 * 当两者一致时，说明未被修改，用于禁用“保存”按钮
 */
const isDataUnchanged = computed(() => {
  if (profileQuery.data.value?.email !== formModel.value.email) {
    return false
  }
  return true
})

// 初始化表单数据
const initData = () => {
  if (profileQuery.data.value == null) {
    return
  }
  formModel.value.email = profileQuery.data.value.email
}

// 取消按钮函数
const cancelFn = () => {
  setEdited(false)
  initData()
  // 触发校验以将可能的错误信息消除
  form.value?.validate()
}

// 监听profileQuery.data，改变时赋值给当前表单数据。组件setup时也会立即执行
watch(
  profileQuery.data,
  () => {
    if (isEdited.value) {
      return
    }
    initData()
  },
  { deep: true, immediate: true }
)

// 记录错误的表单项，以便在规则中判断并使用
// 在提交时，如果出现错误，就会判断错误信息并向对应List添加错误的值
// 已存在的邮箱
const errorEmailList_validation_not_unique = ref<string[]>([])

const rules: FormRules<typeof formModel> = {
  email: [
    {
      required: true,
      message: i18nStore.t('registerRulesEmailRequiredMessage')(),
      trigger: 'blur',
    },
    {
      type: 'email',
      message: i18nStore.t('registerRulesEmailTypeMessage')(),
      trigger: 'blur',
    },
    {
      // 已存在的邮箱记录数组中如果有当前值，则表示此邮箱已存在
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

// 遮罩确认框
const refConfirmContainer = ref<InstanceType<typeof ConfirmContainer> | null>(
  null
)

// 修改邮箱请求mutation
const mutation = useMutation({
  // mutation函数
  mutationFn: async () => {
    // 未登录，抛出错误
    if (!pb.authStore.isValid || pb.authStore.record?.id == null) {
      throw new Error(
        '!pb.authStore.isValid || pb.authStore.record?.id == null'
      )
    }
    // 个人信息没有值，抛出错误
    if (profileQuery.data.value == null) {
      throw new Error('!profileQuery.data.value == null')
    }

    // 通过 pocketbase SDK 请求
    const pbRes = await pb
      .collection(Collections.Users)
      .requestEmailChange(formModel.value.email, {
        // requestEmailChange 服务端pocketbase将发送邮件，用时比较长
        // timeout为30秒
        fetch: fetchWithTimeoutForPbRequestEmailChange,
      })
    console.log(pbRes)
    return pbRes
  },
  // ✅ 在网络错误时重试
  retry: queryRetryPbNetworkError,
  // 错误处理
  onError: (error) => {
    if (error instanceof ClientResponseError) {
      console.log(error.data)
      if (error.data?.data?.newEmail?.code === 'validation_invalid_new_email') {
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
        message: i18nStore.t('messageUpdateFailure')(),
      })
    }
  },
  // 一些收尾工作
  onSuccess: (data) => {},
})

const submitRunning = ref(false)
// 修改邮件
const submit = async () => {
  submitRunning.value = true
  try {
    // 表单校验
    await form.value?.validate().catch(() => {
      throw new PotoFormValidationError()
    })

    // 进行实质操作前，先重新请求个人信息（避免邮件已修改）
    await profileQuery.refetch()
    // 遮罩确认框
    await refConfirmContainer.value?.confirm()

    // 修改邮箱请求mutation.mutateAsync
    await mutation.mutateAsync()

    // } catch (error) {
  } finally {
    submitRunning.value = false
  }
}
</script>

<template>
  <!-- 修改邮箱组件 -->
  <div>
    <ConfirmContainer
      ref="refConfirmContainer"
      backgroundColorTwcss="bg-color-background-soft"
      :title="
        i18nStore.t('settingProfileUpdateEmailConfirmContainerTitle')(
          formModel.email
        )
      "
      size="small"
    >
      <!-- 内容标题 -->
      <div class="mb-3 ml-3 text-sm font-bold text-color-text-soft">
        {{ i18nStore.t('settingProfileUpdateEmailContentTitle')() }}
      </div>
      <!-- 表单盒子 -->
      <div class="mx-auto max-w-[500px]">
        <ElForm
          ref="form"
          :model="formModel"
          :rules="rules"
          size="large"
          class="poto-el-form-line"
        >
          <ElFormItem prop="email">
            <!-- 输入框标题 -->
            <div class="mb-[2px] ml-[25px] text-[12px] leading-[12px]">
              {{ i18nStore.t('settingProfileUpdateEmailEmailLable')() }}
            </div>
            <ElInput
              v-model="formModel.email"
              class="poto-el-input-line"
              :disabled="submitRunning"
            >
              <template #prefix>
                <RiMailLine size="16px"></RiMailLine>
              </template>
            </ElInput>
          </ElFormItem>
        </ElForm>
      </div>
      <!-- 按钮盒子 -->
      <div class="poto-setting-button-box not-center">
        <ElButton
          :loading="submitRunning"
          :disabled="isDataUnchanged"
          type="primary"
          round
          @click="submit()"
        >
          {{ i18nStore.t('settingButtonSave')() }}
        </ElButton>
        <ElButton
          type="info"
          round
          :disabled="submitRunning"
          @click="cancelFn()"
        >
          {{ i18nStore.t('settingButtonCancel')() }}
        </ElButton>
      </div>
    </ConfirmContainer>
  </div>
</template>

<style lang="scss" scoped></style>
