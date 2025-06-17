<script setup lang="ts">
import { useI18nStore } from '@/stores'
import { useDark } from '@vueuse/core'
import LoginForm from './components/LoginForm.vue'
import LoginDarkI18n from './components/LoginDarkI18n.vue'
import { RiGithubFill, RiGoogleFill, RiMicrosoftFill } from '@remixicon/vue'

const i18nStore = useI18nStore()
useSeoMeta({
  title: computed(() => i18nStore.t('pageLogin')()),
})
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
            <div
              :style="{
                borderTopRightRadius: '0',
                borderBottomRightRadius: '0',
              }"
              class="flex-1 rounded-3xl bg-color-background-soft"
            >
              <div class="mx-auto max-w-96">
                <div class="m-8">
                  <LoginForm></LoginForm>
                </div>
              </div>
            </div>
            <div class="w-0 border border-transparent"></div>
            <div
              :style="{
                borderTopLeftRadius: undefined,
                borderBottomLeftRadius: undefined,
              }"
              class="flex-1 rounded-3xl bg-color-background-soft"
            >
              <div class="mx-auto max-w-96">
                <div class="m-8">
                  <!-- <button
                    class="my-4 flex w-full items-center rounded-full bg-[#ea4136] px-5 py-2 text-white"
                  >
                    <div>
                      <RiGoogleFill size="20px"></RiGoogleFill>
                    </div>
                    <div class="flex flex-1 items-center justify-center">
                      <span> 使用 Google 登录 </span>
                    </div>
                  </button>
                  <button
                    class="my-4 flex w-full items-center rounded-full bg-[#0067b8] px-5 py-2 text-white"
                  >
                    <div>
                      <RiMicrosoftFill size="20px"></RiMicrosoftFill>
                    </div>
                    <div class="flex flex-1 items-center justify-center">
                      <span> 使用 Microsoft 登录 </span>
                    </div>
                  </button>
                  <button
                    class="my-4 flex w-full items-center rounded-full bg-[#000000] px-5 py-2 text-white"
                  >
                    <div>
                      <RiGithubFill size="20px"></RiGithubFill>
                    </div>
                    <div class="flex flex-1 items-center justify-center">
                      <span> 使用 Github 登录 </span>
                    </div>
                  </button> -->
                  <button
                    class="my-4 flex h-10 w-full items-center rounded-full border-2 border-color-text-soft bg-color-background-soft px-5 py-2 transition-colors hover:bg-color-background hover:text-color-text"
                  >
                    <div>
                      <img
                        src="https://pocketbase.io/_/images/oauth2/google.svg"
                        class="h-5 w-5"
                      />
                    </div>
                    <div class="flex flex-1 items-center justify-center">
                      <span> 使用 Google 登录 </span>
                    </div>
                  </button>
                  <button
                    class="my-4 flex h-10 w-full items-center rounded-full border-2 border-color-text-soft bg-color-background-soft px-5 py-2 transition-colors hover:bg-color-background hover:text-color-text"
                  >
                    <div>
                      <img
                        src="https://pocketbase.io/_/images/oauth2/microsoft.svg"
                        class="h-5 w-5"
                      />
                    </div>
                    <div class="flex flex-1 items-center justify-center">
                      <span> 使用 Microsoft 登录 </span>
                    </div>
                  </button>
                  <button
                    class="my-4 flex h-10 w-full items-center rounded-full border-2 border-color-text-soft bg-color-background-soft px-5 py-2 transition-colors hover:bg-color-background hover:text-color-text"
                  >
                    <div>
                      <img
                        src="https://pocketbase.io/_/images/oauth2/github.svg"
                        class="h-5 w-5"
                      />
                    </div>
                    <div class="flex flex-1 items-center justify-center">
                      <span> 使用 Github 登录 </span>
                    </div>
                  </button>
                  <button
                    class="my-4 flex h-10 w-full items-center rounded-full border-2 border-color-text-soft bg-color-background-soft px-5 py-2 transition-colors hover:bg-color-background hover:text-color-text"
                  >
                    <div>
                      <img
                        src="https://pocketbase.io/_/images/oauth2/apple.svg"
                        class="h-5 w-5"
                      />
                    </div>
                    <div class="flex flex-1 items-center justify-center">
                      <span> 使用 Apple 登录 </span>
                    </div>
                  </button>
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
