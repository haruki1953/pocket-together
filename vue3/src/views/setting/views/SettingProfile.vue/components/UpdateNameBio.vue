<script setup lang="ts">
import { useI18nStore } from '@/stores'

const i18nStore = useI18nStore()

const name = ref('')
const bio = ref('')
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
      <ElButton :loading="false" type="primary" round @click="() => {}">
        {{ i18nStore.t('settingProfileSaveButton')() }}
      </ElButton>
      <ElButton type="info" round @click="() => {}">
        {{ i18nStore.t('settingProfileCancelButton')() }}
      </ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
