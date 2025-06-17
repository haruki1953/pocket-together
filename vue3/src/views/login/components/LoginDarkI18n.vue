<script setup lang="ts">
import { i18nLocaleInfo, i18nLocaleList } from '@/config'
import { useI18nStore } from '@/stores'
import { useDark } from '@vueuse/core'

const i18nStore = useI18nStore()

const isDark = useDark()
</script>

<template>
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
            <span class="ml-2 text-xs text-color-text-soft">
              {{ i18nLocaleInfo[key].region }}
            </span>
          </div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<style lang="scss" scoped>
.el-dropdown {
  color: inherit;
}
</style>
