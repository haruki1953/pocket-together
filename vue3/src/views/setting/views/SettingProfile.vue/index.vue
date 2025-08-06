<script setup lang="ts">
import { layoutSettingPageConfig } from '@/config'
import { useAuthStore, useI18nStore } from '@/stores'
import { useWindowSize } from '@vueuse/core'
import UpdateNameBio from './components/UpdateNameBio.vue'
import UpdateUsername from './components/UpdateUsername.vue'
import UpdateAvatar from './components/UpdateAvatar.vue'
import UpdateEmail from './components/UpdateEmail.vue'
import VerifyEmail from './components/VerifyEmail.vue'
import UpdatePassword from './components/UpdatePassword.vue'

const i18nStore = useI18nStore()
useSeoMeta({
  title: computed(() => i18nStore.t('pageSettingProfile')()),
})

const { width: windowWidth } = useWindowSize()
/**
 * 窗口大于等于1024显示两列，小于则显示一列
 * useWindowSize
 */
const showContentTrueCol2FalseCol1 = computed(() => {
  if (
    windowWidth.value >= layoutSettingPageConfig.breakpointContentCol2ToCol1
  ) {
    return true
  }
  return false
})

const authStore = useAuthStore()
</script>

<template>
  <div>
    <!-- 大屏 双列-->
    <div v-if="showContentTrueCol2FalseCol1" class="flex gap-x-6">
      <!-- 第一列 -->
      <div class="flex-1">
        <!-- 需登录 修改昵称简介 -->
        <!-- 圆角盒子 -->
        <div
          v-if="authStore.isValid"
          class="
          transition-all duration-900 ease-in-out
          mb-6 flow-root rounded-3xl bg-color-background-soft shadow-none hover:shadow-md dark:hover:shadow-black/60 hover:shadow-black/20"
        >
          <!-- 内容盒子 -->
          <div class="m-4">
            <!-- 修改昵称简介组件 -->
            <UpdateNameBio></UpdateNameBio>
          </div>
        </div>
        <!-- 需登录 修改用户名 -->
        <div
          v-if="authStore.isValid"
          class="
          transition-all duration-900 ease-in-out
          mb-6 flow-root rounded-3xl bg-color-background-soft shadow-none hover:shadow-md dark:hover:shadow-black/60 hover:shadow-black/30"
        >
          <div class="m-4">
            <UpdateUsername></UpdateUsername>
          </div>
        </div>
        <!-- 需登录 修改头像 -->
        <div
          v-if="authStore.isValid"
          class="
          transition-all duration-900 ease-in-out
          mb-6 flow-root rounded-3xl bg-color-background-soft shadow-none hover:shadow-md dark:hover:shadow-black/60 hover:shadow-black/30"
        >
          <div class="m-4">
            <UpdateAvatar></UpdateAvatar>
          </div>
        </div>
        <!-- 需登录 修改邮箱 -->
        <div
          v-if="authStore.isValid"
          class="
          transition-all duration-900 ease-in-out
          mb-1 flow-root rounded-t-3xl bg-color-background-soft shadow-none hover:shadow-md dark:hover:shadow-black/60 hover:shadow-black/30"
        >
          <div class="m-4">
            <UpdateEmail></UpdateEmail>
          </div>
        </div>
        <!-- 需登录 验证邮箱 -->
        <div
          v-if="authStore.isValid"
          class="
          transition-all duration-900 ease-in-out
          mb-1 flow-root rounded-none bg-color-background-soft shadow-none hover:shadow-md dark:hover:shadow-black/60 hover:shadow-black/30"
        >
          <div class="m-4">
            <VerifyEmail></VerifyEmail>
          </div>
        </div>
        <!-- 需登录 修改密码 -->
        <div
          v-if="authStore.isValid"
          class="
          transition-all duration-900 ease-in-out
          mb-6 flow-root rounded-b-3xl bg-color-background-soft shadow-none hover:shadow-md dark:hover:shadow-black/60 hover:shadow-black/30"
        >
          <div class="m-4">
            <UpdatePassword></UpdatePassword>
          </div>
        </div>
      </div>
      <!-- 第二列 -->
      <div class="flex-1"></div>
    </div>

    <!-- 小屏 单列 -->
    <div v-else>
      <!-- 需登录 修改昵称简介 -->
      <div
        v-if="authStore.isValid"
        class="mb-6 flow-root rounded-3xl bg-color-background-soft"
      >
        <div class="m-4">
          <UpdateNameBio></UpdateNameBio>
        </div>
      </div>
      <!-- 需登录 修改用户名 -->
      <div
        v-if="authStore.isValid"
        class="mb-6 flow-root rounded-3xl bg-color-background-soft"
      >
        <div class="m-4">
          <UpdateUsername></UpdateUsername>
        </div>
      </div>
      <!-- 需登录 修改头像 -->
      <div
        v-if="authStore.isValid"
        class="mb-6 flow-root rounded-3xl bg-color-background-soft"
      >
        <div class="m-4">
          <UpdateAvatar></UpdateAvatar>
        </div>
      </div>
      <!-- 需登录 修改邮箱 -->
      <div
        v-if="authStore.isValid"
        class="mb-6 flow-root rounded-3xl bg-color-background-soft"
      >
        <div class="m-4">
          <UpdateEmail></UpdateEmail>
        </div>
      </div>
      <!-- 需登录 验证邮箱 -->
      <div
        v-if="authStore.isValid"
        class="mb-6 flow-root rounded-3xl bg-color-background-soft"
      >
        <div class="m-4">
          <VerifyEmail></VerifyEmail>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
