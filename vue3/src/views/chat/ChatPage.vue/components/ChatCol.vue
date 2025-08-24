<script setup lang="ts">
import type { Group } from '@/types'
import ChatInputBar from './ChatInputBar.vue'
import ChatMessage from './ChatMessage.vue'
import { useChatRoomMessagesInfiniteQuery } from '@/queries'

// 聊天页消息 游标分页无限查询
const chatRoomMessagesInfiniteQuery = useChatRoomMessagesInfiniteQuery({
  roomId: '',
})

const testPbPage = async () => {
  console.log(chatRoomMessagesInfiniteQuery.data.value)
  // 加载下一页
  chatRoomMessagesInfiniteQuery.fetchNextPage()
}

// 将分页数据处理为消息数组，反转（从旧到新）
const chatRoomMessagesList = computed(() => {
  if (chatRoomMessagesInfiniteQuery.data.value == null) {
    return null
  }
  // 处理为数组
  const messagesListData: Array<
    (typeof chatRoomMessagesInfiniteQuery.data.value)['pages'][number]['items'][number]
  > = []
  chatRoomMessagesInfiniteQuery.data.value.pages.forEach((pagesItem) => {
    messagesListData.push(...pagesItem.items)
  })
  // 反转
  const messagesListReverseData = messagesListData.reverse()
  return messagesListReverseData
})

// 消息的类型
export type ChatRoomMessagesItem = NonNullable<
  typeof chatRoomMessagesList.value
>[number]

//
</script>

<template>
  <div>
    <ContainerBar>
      <template #default>
        <div class="mb-1 mt-6">
          <!-- <ElButton @click="testPbPage">pb分页测试</ElButton> -->
          <!-- 聊天栏 -->
          <div v-if="chatRoomMessagesList != null">
            <!-- 自己的消息 -->
            <ChatMessage
              v-for="(item, index) in chatRoomMessagesList"
              :key="item.id"
              :chatRoomMessagesItem="item"
              :chatRoomMessagesItemPrevious="
                (() => {
                  // 上一条消息
                  // 确保存在
                  // index === 0
                  if (index < 1) {
                    return null
                  }
                  return chatRoomMessagesList[index - 1]
                })()
              "
              :chatRoomMessagesItemNext="
                (() => {
                  // 下一条消息
                  // 确保存在
                  // index === chatRoomMessagesList.length - 1
                  if (index > chatRoomMessagesList.length - 2) {
                    return null
                  }
                  return chatRoomMessagesList[index + 1]
                })()
              "
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
