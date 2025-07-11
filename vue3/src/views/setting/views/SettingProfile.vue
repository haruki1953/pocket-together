<script setup lang="ts">
import { layoutSettingPageConfig } from '@/config'
import { useI18nStore } from '@/stores'
import { useWindowSize } from '@vueuse/core'

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

const name = ref('')
const bio = ref('')
</script>

<template>
  <div>
    <!-- 大屏 双列-->
    <div v-if="showContentTrueCol2FalseCol1" class="flex gap-x-6">
      <!-- 第一列 -->
      <div class="flex-1">
        <!-- 圆角盒子 -->
        <div class="mb-6 flow-root rounded-3xl bg-color-background-soft">
          <!-- 内容盒子 -->
          <div class="m-4">
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
                    :placeholder="
                      i18nStore.t('settingProfileNamePlaceholder')()
                    "
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
                <ElButton
                  :loading="false"
                  type="primary"
                  round
                  @click="() => {}"
                >
                  {{ i18nStore.t('settingProfileSaveButton')() }}
                </ElButton>
                <ElButton type="info" round @click="() => {}">
                  {{ i18nStore.t('settingProfileCancelButton')() }}
                </ElButton>
              </div>
            </div>
          </div>
          <!-- 分割线 -->
          <!-- <div class="border border-color-background"></div> -->
        </div>
      </div>
      <!-- 第二列 -->
      <div class="flex-1"></div>
    </div>
    <!-- 小屏 单列 -->
    <div v-else>
      <div class="mb-6 flow-root rounded-3xl bg-color-background-soft">
        <div class="m-4"></div>
        <div class="border border-color-background"></div>
        <div class="m-4"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
