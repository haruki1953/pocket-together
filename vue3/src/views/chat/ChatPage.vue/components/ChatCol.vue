<script setup lang="ts">
import ChatInputBar from './ChatInputBar.vue'
</script>

<template>
  <div>
    <ContainerBar>
      <template #default>
        <div class="mb-1 mt-6">
          <!-- 聊天栏 -->
          <div>
            <!-- 自己的消息 -->
            <div>
              <div class="flex flex-row-reverse justify-end">
                <!-- 头像 -->
                <div></div>
                <!-- 消息 -->
                <div></div>
              </div>
            </div>
            <!-- 其他用户的消息 -->
          </div>
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
