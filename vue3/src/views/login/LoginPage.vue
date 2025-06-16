<script setup lang="ts">
import { i18nLocaleInfo, i18nLocaleList } from '@/config'
import { useI18nStore } from '@/stores'
import { RiMoonLine, RiSunLine, RiTranslate2 } from '@remixicon/vue'
import { useDark } from '@vueuse/core'

const i18nStore = useI18nStore()
useSeoMeta({
  title: computed(() => i18nStore.t('pageLogin')()),
})

const isDark = useDark()
</script>

<template>
  <div>
    <div class="flex min-h-screen items-center justify-center">
      <div class="w-full max-w-[1000px]">
        <div class="mx-10">
          <div class="gradient-text p-10 text-center text-4xl font-bold">
            {{ i18nStore.t('appNameI18n')() }}
          </div>
          <div class="flex items-center justify-center">
            <div
              :style="{
                borderTopRightRadius: '0',
                borderBottomRightRadius: '0',
              }"
              class="h-80 flex-1 rounded-3xl bg-color-background-soft"
            ></div>
            <div class="w-0 border border-transparent"></div>
            <div
              :style="{
                borderTopLeftRadius: undefined,
                borderBottomLeftRadius: undefined,
              }"
              class="h-96 flex-1 rounded-3xl bg-color-background-soft"
            ></div>
          </div>
          <div class="m-10 flex items-center justify-center">
            <div class="mx-1 cursor-pointer p-1" @click="isDark = !isDark">
              <RiMoonLine v-if="isDark"></RiMoonLine>
              <RiSunLine v-else></RiSunLine>
            </div>
            <ElDropdown trigger="click">
              <div class="mx-1 cursor-pointer p-1">
                <RiTranslate2></RiTranslate2>
              </div>
              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem
                    v-for="key in i18nLocaleList"
                    :key="key"
                    @click="i18nStore.localeSet(key)"
                  >
                    <div class="flex w-full items-center justify-between">
                      <span>
                        {{ i18nLocaleInfo[key].language }}
                      </span>
                      <span class="ml-2 text-color-text-soft">
                        {{ i18nLocaleInfo[key].region }}
                      </span>
                    </div>
                  </ElDropdownItem>
                </ElDropdownMenu>
              </template>
            </ElDropdown>
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
.el-dropdown {
  color: inherit;
}

.gradient-text {
  background: linear-gradient(
    to right,
    var(--color-text),
    var(--el-color-primary)
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
