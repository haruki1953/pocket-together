<script setup lang="ts">
import { appLogo } from '@/config'
import { pb } from '@/lib'
import { useProfileQuery } from '@/queries'
import { useI18nStore } from '@/stores'

const i18nStore = useI18nStore()

// 个人信息查询
const profileQuery = useProfileQuery()
const profileAvatarUrl = computed(() => {
  if (
    profileQuery.data.value == null ||
    profileQuery.data.value.avatar === ''
  ) {
    return appLogo
  }
  return pb.files.getURL(
    profileQuery.data.value,
    profileQuery.data.value.avatar,
    { thumb: '200x200f' }
  )
})

const cancelFn = () => {}

const isSubmitting = false
const submit = () => {}
</script>

<template>
  <!-- 修改头像组件 -->
  <div>
    <!-- 内容标题 -->
    <div class="mb-3 ml-3 text-sm font-bold text-color-text-soft">
      {{ i18nStore.t('settingProfileUpdateAvatarContentTitle')() }}
    </div>
    <!-- 头像盒子 -->
    <div>
      <!-- 居中 -->
      <div class="flex justify-center">
        <!-- ElUpload -->
        <div>
          <div
            class="cursor-pointer rounded-full border-2 border-dashed border-color-text-soft transition-colors hover:border-el-primary"
          >
            <div
              class="m-[1px] h-[100px] w-[100px] overflow-hidden rounded-full"
            >
              <img
                :src="profileAvatarUrl"
                alt="App Icon"
                class="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 按钮盒子 -->
    <div class="poto-setting-button-box center-mt-3">
      <ElButton :loading="isSubmitting" type="primary" round @click="submit()">
        {{ i18nStore.t('settingButtonSave')() }}
      </ElButton>
      <ElButton type="info" round @click="cancelFn()">
        {{ i18nStore.t('settingButtonCancel')() }}
      </ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
