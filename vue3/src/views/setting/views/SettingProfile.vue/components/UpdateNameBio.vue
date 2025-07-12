<script setup lang="ts">
import { Collections, pb, type Update } from '@/lib'
import { queryKeys, queryRetryPbFetchTimeout } from '@/queries'
import { useI18nStore } from '@/stores'
import {
  compareDatesSafe,
  fetchWithTimeoutPreferred,
  potoMessage,
} from '@/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

const i18nStore = useI18nStore()

// 当前表单数据
const name = ref('')
const bio = ref('')

// 当前表单是否已编，已编辑则不再跟随profileData变化
const isEdited = ref(false)
const setEdited = (val: boolean) => {
  isEdited.value = val
}

// 初始化表单数据
const initData = () => {
  if (isEdited.value) {
    return
  }
  if (profileData.value == null) {
    return
  }
  name.value = profileData.value.name
  bio.value = profileData.value.bio
}

// 取消按钮函数
const cancelFn = () => {
  setEdited(false)
  initData()
}

const queryClient = useQueryClient()

// 修改名称与简介mutation
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
  // 成功之后的处理
  onSuccess: (data) => {
    // 更新query缓存
    // 更新前，应确认data.update时间为最新的，以此方式避免两次很近的请求导致问题
    if (
      profileData.value != null &&
      // data.updated > profileData.value.updated
      compareDatesSafe(data.updated, profileData.value.updated) === 1
    ) {
      // 更新query缓存
      queryClient.setQueryData(
        queryKeys.users.getOne(pb.authStore.record?.id ?? ''),
        // 确保类型正确
        data satisfies NonNullable<typeof profileData.value>
      )
    }
    potoMessage({
      type: 'success',
      message: i18nStore.t('messageUpdateSuccess')(),
    })
  },
  // 失败之后的处理
  onError: (error) => {
    potoMessage({
      type: 'error',
      message: i18nStore.t('messageUpdateFailure')(),
    })
  },
})
const isSubmitting = mutation.isPending
const submit = mutation.mutateAsync

// 个人信息查询
const query = useQuery({
  // 查询依赖，需登录（待完善为响应式）
  enabled: pb.authStore.record?.id != null,
  // 查询键
  queryKey: computed(() =>
    //（待完善为响应式）
    queryKeys.users.getOne(pb.authStore.record?.id ?? '')
  ),
  // 查询函数
  queryFn: async () => {
    // 未登录，抛出错误
    if (!pb.authStore.isValid || pb.authStore.record?.id == null) {
      throw new Error(
        '!pb.authStore.isValid || pb.authStore.record?.id == null'
      )
    }
    // pb请求
    const pbRes = await pb
      .collection(Collections.Users)
      .getOne(pb.authStore.record.id, {
        fetch: fetchWithTimeoutPreferred,
      })
    console.log(pbRes)
    return pbRes
  },
  // ✅ 仅在 fetch 被 AbortController 中断（超时）时进行重试（最多重试 2 次）(请求三次)
  retry: queryRetryPbFetchTimeout,
})
const profileData = query.data

// 监听profileData，改变时赋值给当前表单数据。组件setup时也会立即执行
watch(
  profileData,
  () => {
    initData()
  },
  { deep: true, immediate: true }
)
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
      <ElButton type="info" round @click="cancelFn()">
        {{ i18nStore.t('settingProfileCancelButton')() }}
      </ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
