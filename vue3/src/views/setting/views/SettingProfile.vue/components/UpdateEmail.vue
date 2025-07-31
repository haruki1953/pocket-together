<script setup lang="ts">
import type ConfirmContainer from '@/components/tool/ConfirmContainer.vue'
import { Collections, pb } from '@/lib'
import { useProfileQuery } from '@/queries'
import { useI18nStore } from '@/stores'
import { useMutation } from '@tanstack/vue-query'

const i18nStore = useI18nStore()

// 个人信息查询
const profileQuery = useProfileQuery()

watch(profileQuery.data, () => {
  console.log(profileQuery.data.value)
})

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
    // const pbRes = await pb.collection(Collections.Users)
    // TODO
  },
})

const updateEmailRunning = ref(false)
// 修改邮件
const updateEmail = async () => {
  updateEmailRunning.value = true
  try {
    // 进行实质操作前，先重新请求个人信息（避免邮件已修改）
    await profileQuery.refetch()
    // 遮罩确认框
    refConfirmContainer.value?.confirm()

    // } catch (error) {
  } finally {
    updateEmailRunning.value = false
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
          profileQuery.data.value?.email ?? ''
        )
      "
      size="small"
    >
      <!-- 内容标题 -->
      <div class="mb-3 ml-3 text-sm font-bold text-color-text-soft">
        {{ i18nStore.t('settingProfileUpdateEmailContentTitle')() }}
        |
        {{ profileQuery.data.value?.email }}
      </div>
      <!-- 按钮盒子 -->
      <div class="poto-setting-button-box not-center">
        <ElButton
          :loading="updateEmailRunning"
          type="primary"
          round
          @click="updateEmail"
        >
          {{ i18nStore.t('settingProfileUpdateEmailButtonText')() }}
        </ElButton>
      </div>
    </ConfirmContainer>
  </div>
</template>

<style lang="scss" scoped></style>
