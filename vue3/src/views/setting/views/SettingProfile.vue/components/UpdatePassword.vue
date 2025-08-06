<script setup lang="ts">
import type { GlobalComponents } from 'vue'
import {
  queryRetryPbNetworkError,
  usePbCollectionConfigQuery,
  useProfileQuery,
} from '@/queries'
import { useI18nStore, useSettingStateStore } from '@/stores'
import { useMutation } from '@tanstack/vue-query'
import { Collections, onPbResErrorStatus401AuthClear, pb } from '@/lib'
import {
  convertSecondsToTimeDuration,
  fetchWithTimeoutForPbRequestWillEmail,
  parseISODate,
  potoMessage,
} from '@/utils'
import { useNow } from '@vueuse/core'
import { pbCollectionConfigDefaultGetFn } from '@/config'

const i18nStore = useI18nStore()

// 查询
const profileQuery = useProfileQuery()
// 确认
const refConfirmContainer = ref<InstanceType<
  GlobalComponents['ConfirmContainer']
> | null>(null)

// 邮箱请求
const mutation = useMutation({
  mutationFn: async () => {
    // 未登录，照搬
    if (!pb.authStore.isValid || pb.authStore.record?.id == null) {
      throw new Error(
        '!pb.authStore.isValid || pb.authStore.record?.id == null'
      )
    }
    // 无个人信息，照搬
    if (profileQuery.data.value == null) {
      throw new Error('!profileQuery.data.value == null')
    }

    // pocketbase SDK
    const pbRes = await pb
      .collection(Collections.Users)
      .requestPasswordReset(profileQuery.data.value.email, {
      fetch: fetchWithTimeoutForPbRequestWillEmail,
      })
    console.log(pbRes)
    return pbRes
  },
  // 网络错误
  retry: queryRetryPbNetworkError,
  onError: (error) => {
    // 出现鉴权失败则清除authStore
    onPbResErrorStatus401AuthClear(error)
    // 未知错误
    potoMessage({
      type: 'error',
      message: i18nStore.t('messageUpdateFailure')(),
    })
  },
  // 收尾
  onSuccess: (data) => {
    potoMessage({
        type: 'success',
        message: i18nStore.t('messageUpdateSuccess')(), 
    })
  },
})

const submitRunning = ref(false)
// 验证邮箱
const submit = async () => {
  submitRunning.value = true
  try {
    await profileQuery.refetch()
    await refConfirmContainer.value?.confirm()
    await mutation.mutateAsync().catch(() => {})


// 等 haruki 添加新的 loding 方法


  } finally {
    submitRunning.value = false
  }
}
</script>

<template>
  <!-- 修改密码 -->
  <div>
    <ConfirmContainer
      size="small"
      ref="refConfirmContainer"
      backgroundColorTwcss="bg-color-background-soft"
      :title="
        i18nStore.t('settingProfilePasswordConfirmContainerTitle')(
        profileQuery.data.value?.email ?? '')">
      <!-- 标题 -->
      <div class="mb-3 ml-3 text-sm font-bold text-color-text-soft">
        <!-- 修改密码 -->
         {{ i18nStore.t('settingProfileUpdatePasswordContentTitle')() }}
      </div>
      <!-- 按钮 -->
      <div class="poto-setting-button-box not-center">
        <ElButton
          :loading="submitRunning"
          :disabled="emailVerifyRateLimitInfo != null"
          type="primary"
          round
          @click="submit()"
        >
          <template v-if="emailVerifyRateLimitInfo != null">
            <!-- 显示：xx 秒后可重试 -->
            {{
              i18nStore.t('settingProfileVerifyEmailRetryAfterDuration')(
                convertSecondsToTimeDuration({
                  seconds: emailVerifyRateLimitInfo.secondsUntilNextEmailSubmit,
                  unitLength: 1,
                  messages: i18nStore.t(
                    'convertSecondsToTimeDurationMessages'
                  )(),
                })
              )
            }}
          </template>
          <!-- 修改点击前 -->
          <template v-else>
            {{ i18nStore.t('settingProfileUpdatePasswordContentTitle')() }}
          </template>
        </ElButton>
      </div>
    </ConfirmContainer>
  </div>
</template>

<style lang="scss" scoped></style>