<script setup lang="ts">
import { useChatRoomMessagesInfiniteQuery } from '@/queries'
import {
  generateRandomIntegerBetween,
  generateRandomKey,
  watchUntilSourceCondition,
} from '@/utils'
import { pbMessagesSendChatApi } from '@/api'
import { useScroll } from '@vueuse/core'
import { ChatInputBar, ChatMessage } from './dependencies'
import { useChatScrollMessageChange } from './composables'
import { useRealtimeMessagesStore } from '@/stores'
import { chatRoomMessagesScrollRealtimeIsBottomDistance } from '@/config'

const props = defineProps<{
  /** 滚动容器元素 */
  refScrollWarp?: HTMLDivElement
}>()
// 供封装的组件或组合式函数使用
export type PropsType = typeof props

// 聊天页消息 游标分页无限查询
const chatRoomMessagesInfiniteQuery = useChatRoomMessagesInfiniteQuery({
  roomId: '',
})

// 测试，查询下一页
const testPbPage = async () => {
  console.log(chatRoomMessagesInfiniteQuery.data.value)

  // 处理聊天滚动（在消息变动前）
  const chatScrollCaptureSnapshot =
    chatScrollCaptureSnapshotBeforeMessageChange()

  // 加载下一页
  await chatRoomMessagesInfiniteQuery.fetchNextPage()

  // 处理聊天滚动（在消息变动后）
  chatScrollAdjustPositionAfterMessageChange(chatScrollCaptureSnapshot)
}

// 测试批量添加消息
const testPbSend = async () => {
  const randomInteger = generateRandomIntegerBetween(1, 10)
  for (let i = 0; i < randomInteger; i++) {
    await pbMessagesSendChatApi({
      content: generateRandomKey(
        generateRandomIntegerBetween(5, generateRandomIntegerBetween(20, 200))
      ),
    })
  }
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
export type ChatRoomMessagesListType = typeof chatRoomMessagesList
// 消息的类型
export type ChatRoomMessagesItem = NonNullable<
  typeof chatRoomMessagesList.value
>[number]

// 实时消息Store
const realtimeMessagesStore = useRealtimeMessagesStore()

// 从实时消息中，获取本房间的消息
const chatRoomMessagesRealtime = computed(() => {
  return realtimeMessagesStore.createList.filter((i) => i.room === '')
})
export type ChatRoomMessagesRealtimeType = typeof chatRoomMessagesRealtime

// 将 MessagesRealtime 和 MessagesList 融合
const chatRoomMessagesListAndRealtime = computed(() => {
  if (chatRoomMessagesList.value == null) {
    return null
  }
  // 将MessagesRealtime与MessagesList重复的删除
  const messagesRealtimeDeleteDuplicates =
    chatRoomMessagesRealtime.value.filter(
      (realtimaeItem) =>
        chatRoomMessagesList.value?.find(
          (listItem) => listItem.id === realtimaeItem.id
        ) == null
    )
  return [...chatRoomMessagesList.value, ...messagesRealtimeDeleteDuplicates]
})

// 最终用于渲染的数据
const chatRoomMessagesForShow = computed(
  () => chatRoomMessagesListAndRealtime.value
)
export type ChatRoomMessagesForShowType = typeof chatRoomMessagesForShow

/** 封装了聊天页消息变动时的滚动处理 */
const {
  chatScrollCaptureSnapshotBeforeMessageChange,
  chatScrollAdjustPositionAfterMessageChange,
} = useChatScrollMessageChange({
  props,
  chatRoomMessagesForShow,
  chatRoomMessagesRealtime,
})
</script>

<template>
  <div>
    <ContainerBar :defaultBarHeight="72">
      <template #default>
        <div class="mb-1 mt-6">
          <ElButton @click="testPbPage">pb分页测试</ElButton>
          <ElButton @click="testPbSend">pb批量消息</ElButton>
          <!-- 聊天栏 -->
          <div v-if="chatRoomMessagesForShow != null">
            <!-- 消息 -->
            <ChatMessage
              v-for="(item, index) in chatRoomMessagesForShow"
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
                  return chatRoomMessagesForShow[index - 1]
                })()
              "
              :chatRoomMessagesItemNext="
                (() => {
                  // 下一条消息
                  // 确保存在
                  // index === chatRoomMessagesForShow.length - 1
                  if (index > chatRoomMessagesForShow.length - 2) {
                    return null
                  }
                  return chatRoomMessagesForShow[index + 1]
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
