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
import {
  useChatDataProcessMessages,
  useChatScrollMessageChange,
  useChatShowLimitControl,
  useChatShowMoreOnTopOrBottom,
} from './composables'

const props = defineProps<{
  /** 滚动容器元素 */
  refScrollWarp?: HTMLDivElement
}>()
// 供封装的组件或组合式函数使用
export type PropsType = typeof props

/** 封装了聊天页的数据及其处理相关内容 */
const {
  // 聊天页消息 游标分页无限查询
  chatRoomMessagesInfiniteQuery,
  // 将分页数据处理为消息数组，反转（从旧到新）
  chatRoomMessagesList,
  // 从实时消息中，获取本房间的消息
  chatRoomMessagesRealtime,
  // 将 MessagesRealtime 和 MessagesList 融合
  chatRoomMessagesListAndRealtime,
} = useChatDataProcessMessages()
// 导出一些类型
export type ChatRoomMessagesInfiniteQueryType =
  typeof chatRoomMessagesInfiniteQuery
export type ChatRoomMessagesListType = typeof chatRoomMessagesList
export type ChatRoomMessagesItem = NonNullable<
  typeof chatRoomMessagesList.value
>[number]
export type ChatRoomMessagesRealtimeType = typeof chatRoomMessagesRealtime
export type ChatRoomMessagesListAndRealtimeType =
  typeof chatRoomMessagesListAndRealtime

/** 封装了聊天页消息显示数量限制控制相关的内容 */
const {
  // 限制消息显示数量，顶部游标与底部游标
  chatRoomMessagesLimitTopCursor,
  chatRoomMessagesLimitBottomCursor,
  // 已限制数量的消息列表
  chatRoomMessagesLimitList,
} = useChatShowLimitControl({
  //
  chatRoomMessagesListAndRealtime,
})
// 导出一些类型
export type ChatRoomMessagesLimitTopCursorType =
  typeof chatRoomMessagesLimitTopCursor
export type ChatRoomMessagesLimitBottomCursorType =
  typeof chatRoomMessagesLimitBottomCursor
export type ChatRoomMessagesLimitListType = typeof chatRoomMessagesLimitList

// 最终用于渲染的数据
const chatRoomMessagesForShow = computed(() => chatRoomMessagesLimitList.value)
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
export type ChatScrollCaptureSnapshotBeforeMessageChangeType =
  typeof chatScrollCaptureSnapshotBeforeMessageChange
export type ChatScrollAdjustPositionAfterMessageChangeType =
  typeof chatScrollAdjustPositionAfterMessageChange

/** 封装了在聊天顶部或底部显示更多的函数，加载更多，控制显示限制 */
const {
  // 聊天顶部加载更多
  chatShowMoreOnTop,
  // 聊天底部加载更多
  chatShowMoreOnBottom,
} = useChatShowMoreOnTopOrBottom({
  chatRoomMessagesListAndRealtime,
  chatRoomMessagesLimitList,
  chatRoomMessagesInfiniteQuery,
  chatRoomMessagesLimitTopCursor,
  chatRoomMessagesLimitBottomCursor,
  chatScrollCaptureSnapshotBeforeMessageChange,
  chatScrollAdjustPositionAfterMessageChange,
})

// 测试，查询下一页
const testPbPage = async () => {
  chatShowMoreOnTop()
}

// 测试，查询上一页（控制显示限制）
const testPbPageBottom = async () => {
  chatShowMoreOnBottom()
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
</script>

<template>
  <div>
    <!-- bottomHeight测量的高度会有延时，如果需要立即测量滚动高度就会导致问题，此时可以通过此参数指定默认高度 -->
    <!-- 聊天页的滚动控制，初始需要在底部，需要指定默认高度（输入框为空时的高度） -->
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
          <ElButton @click="testPbPageBottom">pb分页测试</ElButton>
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
