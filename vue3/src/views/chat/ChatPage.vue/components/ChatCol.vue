<script setup lang="ts">
import ChatInputBar from './ChatInputBar.vue'
import ChatMessage from './ChatMessage.vue'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { type MessagesResponse } from '@/lib'
import { pbMessagesListRoomCursorApi } from '@/api'
import { useChatRoomMessagesInfiniteQuery } from '@/queries'

const chatRoomMessagesInfiniteQuery = useChatRoomMessagesInfiniteQuery({
  roomId: '',
})

const testPbPage = async () => {
  chatRoomMessagesInfiniteQuery.fetchNextPage()
}
</script>

<template>
  <div>
    <ContainerBar>
      <template #default>
        <div class="mb-1 mt-6">
          <ElButton @click="testPbPage">pb分页测试</ElButton>
          <!-- 聊天栏 -->
          <div>
            <!-- 自己的消息 -->
            <ChatMessage
              :testIsCurrentUser="true"
              :testShowAvatarAndName="false"
            ></ChatMessage>
            <ChatMessage
              :testIsCurrentUser="true"
              :testShowAvatarAndName="true"
            ></ChatMessage>
            <!-- 其他用户的消息 -->
            <ChatMessage
              :testIsCurrentUser="false"
              :testShowAvatarAndName="false"
            ></ChatMessage>
            <ChatMessage
              :testIsCurrentUser="false"
              :testShowAvatarAndName="true"
            ></ChatMessage>
            <ChatMessage
              :testIsCurrentUser="false"
              :testShowAvatarAndName="false"
            ></ChatMessage>
            <ChatMessage
              :testIsCurrentUser="false"
              :testShowAvatarAndName="true"
            ></ChatMessage>
            <ChatMessage
              :testIsCurrentUser="false"
              :testShowAvatarAndName="true"
            ></ChatMessage>
            <ChatMessage
              :testIsCurrentUser="false"
              :testShowAvatarAndName="false"
            ></ChatMessage>
            <ChatMessage
              :testIsCurrentUser="false"
              :testShowAvatarAndName="true"
            ></ChatMessage>
            <!-- 自己的消息 -->
            <ChatMessage
              :testIsCurrentUser="true"
              :testShowAvatarAndName="false"
            ></ChatMessage>
            <ChatMessage
              :testIsCurrentUser="true"
              :testShowAvatarAndName="false"
            ></ChatMessage>
            <ChatMessage
              :testIsCurrentUser="true"
              :testShowAvatarAndName="true"
            ></ChatMessage>
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
