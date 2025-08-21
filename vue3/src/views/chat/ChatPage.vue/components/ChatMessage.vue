<script setup lang="ts">
import { appLogo } from '@/config'

defineProps<{
  /** 测试，是否为当前用户 */
  testIsCurrentUser: boolean
  /** 测试，是否显示头像和名称 */
  testShowAvatarAndName: boolean
}>()
</script>

<template>
  <div class="mt-1">
    <!-- 头像与消息 -->
    <div
      class="flex items-stretch gap-1"
      :class="{
        // 消息为当前用户发送，flex-row-reverse使其靠右显示
        'flex-row-reverse': testIsCurrentUser,
      }"
    >
      <!-- 头像列 -->
      <div class="min-h-[40px] w-[40px]">
        <div class="flex h-full flex-col-reverse items-center">
          <!-- 头像 -->
          <div
            v-if="
              // 当下一条消息是同一用户且时间相差较短时，不显示头像和名称
              testShowAvatarAndName
            "
            class="h-[40px] w-full rounded-full bg-color-background-soft"
            :style="{
              backgroundImage: `url('${appLogo}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }"
          ></div>
        </div>
      </div>
      <!-- 消息列 -->
      <div class="flex-1">
        <div
          class="flex"
          :class="{
            // 消息为当前用户发送，flex-row-reverse使其靠右显示
            'flex-row-reverse': testIsCurrentUser,
          }"
        >
          <div
            class="flex min-h-[40px] items-center rounded-[20px]"
            :class="{
              // 消息为当前用户发送，显示不同的消息背景色
              'bg-el-primary-light-4': testIsCurrentUser,
              'bg-color-background-soft': !testIsCurrentUser,
            }"
          >
            <div class="flex-1">
              <div class="mx-3 my-2">啊啊啊啊啊啊啊啊</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 占位 -->
      <div class="w-[40px]"></div>
    </div>
    <!-- 用户名与时间 -->
    <div
      v-if="
        // 当下一条消息是同一用户且时间相差较短时，不显示头像和名称
        testShowAvatarAndName
      "
      class="mb-3 flex items-center"
      :class="{
        // 消息为当前用户发送，flex-row-reverse使其靠右显示
        'flex-row-reverse': testIsCurrentUser,
      }"
    >
      <!-- 用户名 -->
      <div class="max-w-[50%] truncate text-[12px] font-bold text-color-text">
        啊啊啊
      </div>
      <!-- 分隔 -->
      <div class="mx-[8px]">
        <RiCircleFill size="4px" class="text-color-text-soft"></RiCircleFill>
      </div>
      <!-- 时间 -->
      <div class="truncate text-[12px] text-color-text-soft">2025-08-21</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
