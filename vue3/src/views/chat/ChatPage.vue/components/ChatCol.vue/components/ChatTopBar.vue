<script setup lang="ts"></script>

<template>
  <!-- 聊天页顶栏 -->
  <div class="chat-top-bar">
    <div class="top-bar-box flow-root bg-color-background-soft">
      <div class="">
        <!-- 顶栏 -->
        <div class="flex items-center">
          <!-- 返回 -->
          <div
            class="flex h-[40px] w-[48px] cursor-pointer items-center justify-center"
          >
            <RiArrowLeftSFill></RiArrowLeftSFill>
          </div>
          <!-- 标题 -->
          <div class="flex-1"></div>
          <!-- 更多 -->
          <div
            class="flex h-[40px] w-[48px] cursor-pointer items-center justify-center"
          >
            <RiMore2Fill></RiMore2Fill>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-top-bar {
  .top-bar-box {
    border-radius: 0 0 24px 24px;
    box-shadow: 0 0 6px 6px var(--color-background);
  }
}
</style>
