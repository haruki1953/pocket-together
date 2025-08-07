<script setup lang="ts">
// 用来写一些临时的演示代码
</script>

<template>
  <!-- 多卡片 -->
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
  <!-- 需登录 修改密码 -->
  <div
    v-if="authStore.isValid"
    class="mb-6 flow-root rounded-3xl bg-color-background-soft"
  >
    <div class="m-4">
      <UpdatePassword></UpdatePassword>
    </div>
  </div>

  <!-- 合并为一个卡片 -->
  <!-- 需登录 修改邮箱 验证邮箱 修改密码 -->
  <div
    v-if="authStore.isValid"
    class="mb-6 flow-root rounded-3xl bg-color-background-soft"
  >
    <div class="m-4">
      <UpdateEmail></UpdateEmail>
    </div>

    <!-- 分割线 -->
    <div class="border border-color-background"></div>

    <div class="m-4">
      <VerifyEmail></VerifyEmail>
    </div>

    <!-- 分割线 -->
    <div class="border border-color-background"></div>

    <div class="m-4">
      <UpdatePassword></UpdatePassword>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
