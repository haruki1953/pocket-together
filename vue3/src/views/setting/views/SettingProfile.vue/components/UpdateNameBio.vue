<script setup lang="ts">
import { Collections, pb, type Update } from '@/lib'
import { queryRetryPbFetchTimeout } from '@/queries'
import { useI18nStore } from '@/stores'
import { potoMessage } from '@/utils'
import { useMutation } from '@tanstack/vue-query'

const i18nStore = useI18nStore()

const name = ref('')
const bio = ref('')

const mutation = useMutation({
  // mutation函数
  mutationFn: async () => {
    // 未登录，抛出错误
    if (!pb.authStore.isValid || pb.authStore.record?.id == null) {
      throw new Error(
        '!pb.authStore.isValid || pb.authStore.record?.id == null'
      )
    }
    // 准备数据
    const updateData: Update<Collections.Users> = {
      name: name.value,
      bio: bio.value,
    }

    const pbRes = await pb
      .collection(Collections.Users)
      .update(pb.authStore.record.id, updateData)

    console.log(pbRes)
    return pbRes
  },
  // ✅ 仅在 fetch 被 AbortController 中断（超时）时进行重试（最多重试 2 次）(请求三次)
  retry: queryRetryPbFetchTimeout,
  // 成功与失败之后的处理
  onSuccess: () => {
    potoMessage({
      type: 'success',
      message: i18nStore.t('messageUpdateSuccess')(),
    })
  },
  onError: (error) => {
    potoMessage({
      type: 'error',
      message: i18nStore.t('messageUpdateFailure')(),
    })
  },
})

const isSubmitting = mutation.isPending
const submit = mutation.mutateAsync
</script>

<template>
  <!-- 修改昵称简介盒子 -->
  <div>
    <!-- 内容标题 -->
    <div class="mb-3 ml-3 text-sm font-bold text-color-text-soft">
      {{ i18nStore.t('settingProfileNameBioContentTitle')() }}
    </div>
    <!-- 表单盒子 -->
    <div class="mx-auto max-w-[500px]">
      <!-- 表单行 -->
      <div class="mb-3">
        <!-- 输入框标题 -->
        <div class="mb-[2px] ml-[25px] text-[12px] leading-[12px]">
          {{ i18nStore.t('settingProfileNameLabel')() }}
        </div>
        <!-- 输入框 -->
        <ElInput
          v-model="name"
          :placeholder="i18nStore.t('settingProfileNamePlaceholder')()"
          size="large"
          class="poto-el-input-line"
        >
          <template #prefix>
            <RiUserLine size="16px"></RiUserLine>
          </template>
        </ElInput>
      </div>
      <!-- 表单行 -->
      <div class="mb-3">
        <!-- 输入框标题 -->
        <div class="mb-[2px] ml-[25px] text-[12px] leading-[12px]">
          {{ i18nStore.t('settingProfileBioLabel')() }}
        </div>
        <!-- 输入框 -->
        <ElInput
          v-model="bio"
          :placeholder="i18nStore.t('settingProfileBioPlaceholder')()"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 20 }"
          resize="none"
          class="poto-el-input-line"
        ></ElInput>
      </div>
    </div>
    <!-- 按钮盒子 -->
    <div class="poto-setting-button-box">
      <ElButton :loading="isSubmitting" type="primary" round @click="submit()">
        {{ i18nStore.t('settingProfileSaveButton')() }}
      </ElButton>
      <ElButton type="info" round @click="() => {}">
        {{ i18nStore.t('settingProfileCancelButton')() }}
      </ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
