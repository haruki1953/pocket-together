<script setup lang="ts">
import ChatInputBar from './ChatInputBar.vue'
</script>

<template>
  <div>
    <ContainerBar>
      <template #default>
        <div class="mb-1 mt-6">
          <div>聊天栏</div>
          <div class="h-[2000px] bg-red-950"></div>
          <div>聊天栏聊天栏聊天栏聊天栏聊天栏</div>
        </div>
      </template>
      <template #bar>
        <div class="flow-root">
          <!-- 输入栏 -->
          <ChatInputBar></ChatInputBar>
        </div>
      </template>
    </ContainerBar>
  </div>
</template>

<style lang="scss" scoped></style>
