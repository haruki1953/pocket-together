<script setup lang="ts">
import ChatInputBar from './ChatInputBar.vue'
import ChatMessage from './ChatMessage.vue'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { type MessagesResponse } from '@/lib'
import { pbMessagesListRoomCursorApi } from '@/api'

const infiniteQuery = useInfiniteQuery({
  queryKey: ['CharCol-temp'],
  queryFn: async ({ pageParam }: { pageParam: MessagesResponse | null }) => {
    const pbRes = await pbMessagesListRoomCursorApi({
      roomId: '',
      pageParam,
    })

    return pbRes
  },
  initialPageParam: null,
  getNextPageParam: (lastPage, pages) => {
    if (lastPage.items.length === 0 || lastPage.totalPages === 1) {
      return undefined
    }
    return lastPage.items[lastPage.items.length - 1]
  },
})

const testPbPage = async () => {
  infiniteQuery.fetchNextPage()
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
