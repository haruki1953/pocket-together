<script setup lang="ts">
import { useI18nStore } from '@/stores'
import LoginForm from './components/LoginForm.vue'
import LoginDarkI18n from './components/LoginDarkI18n.vue'
import RegisterForm from './components/RegisterForm.vue'
import Oauth2List from './components/Oauth2List.vue'
import { useLoginPageBoxLeftRightStyle } from './composables'

const i18nStore = useI18nStore()
useSeoMeta({
  title: computed(() => i18nStore.t('pageLogin')()),
})

// 控制左右两栏的圆角样式
const { refBoxLeft, refBoxRight, styleBoxLeftRight } =
  useLoginPageBoxLeftRightStyle()
</script>

<template>
  <div>
    <div class="flex min-h-screen items-center justify-center">
      <div class="w-full max-w-[1000px]">
        <div class="mx-10">
          <div
            class="gradient-text select-none p-10 text-center text-5xl font-bold"
          >
            {{ i18nStore.t('appNameI18n')() }}
          </div>
          <div class="flex items-center justify-center">
            <!-- 左栏 -->
            <div
              ref="refBoxLeft"
              :style="styleBoxLeftRight.left"
              class="flex-1 rounded-3xl bg-color-background-soft"
            >
              <!-- 左侧上栏 -->
              <div class="mx-auto max-w-96">
                <div class="m-8">
                  <LoginForm></LoginForm>
                </div>
              </div>
              <!-- 左侧水平分割线 -->
              <!-- 左侧下栏 -->
              <!-- 都在Oauth2List -->
              <Oauth2List></Oauth2List>
            </div>
            <!-- 中间垂直分割线 -->
            <div class="w-0 border border-transparent"></div>
            <!-- 右栏 -->
            <div
              ref="refBoxRight"
              :style="styleBoxLeftRight.right"
              class="flex-1 rounded-3xl bg-color-background-soft"
            >
              <div class="mx-auto max-w-96">
                <div class="m-8">
                  <RegisterForm></RegisterForm>
                </div>
              </div>
            </div>
          </div>
          <div class="m-10 flex items-center justify-center">
            <LoginDarkI18n></LoginDarkI18n>
            <div class="mx-1 cursor-pointer p-1">
              <i
                class="ri-discord-line"
                style="font-size: 24px; line-height: 24px"
              ></i>
            </div>
            <div class="mx-1 cursor-pointer p-1">
              <i
                class="ri-github-line"
                style="font-size: 24px; line-height: 24px"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gradient-text {
  font-family: 'Nunito', sans-serif;
  background: linear-gradient(
    to right,
    var(--color-text) 20%,
    // var(--el-color-danger) 20%,
    var(--el-color-primary) 80%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
