<script setup lang="ts">
import type { Group } from '@/types'
import ChatInputBar from './ChatInputBar.vue'
import ChatMessage from './ChatMessage.vue'
import { useChatRoomMessagesInfiniteQuery } from '@/queries'
import {
  generateRandomIntegerBetween,
  generateRandomKey,
  watchUntilSourceCondition,
} from '@/utils'
import { pbMessagesSendChatApi } from '@/api'
import { useScroll } from '@vueuse/core'

const props = defineProps<{
  /** 滚动容器元素 */
  refScrollWarp?: HTMLDivElement
}>()

// 聊天页消息 游标分页无限查询
const chatRoomMessagesInfiniteQuery = useChatRoomMessagesInfiniteQuery({
  roomId: '',
})

// 测试，查询下一页
const testPbPage = async () => {
  console.log(chatRoomMessagesInfiniteQuery.data.value)

  /**
   * 获取收集数据
   * 收集旧数据，以供计算处理滚动时使用
   */
  const dataOld = (() => {
    const messageData = (() => {
      if (chatRoomMessagesList.value == null) {
        return null
      }
      return [...chatRoomMessagesList.value]
    })()
    return {
      messageData,
      scrollHeight: props.refScrollWarp?.scrollHeight,
    }
  })()

  // 加载下一页
  await chatRoomMessagesInfiniteQuery.fetchNextPage()

  // 计算处理滚动
  ;(async (data: typeof dataOld) => {
    // // 此时可能能获取更准确的ScrollHeight，意为视图更新的瞬间前的滚动高度（比dataOld的更好，更不容易错位）
    // // 如果此值和之后获取的ScrollHeight不同即是正确的，旧有限使用此值
    // // 否则应使用dataOld.scrollHeight
    // const beforeTickScrollHeight = props.refScrollWarp?.scrollHeight
    const beforeTickScrollHeight = data.scrollHeight
    console.log(beforeTickScrollHeight)
    await nextTick()
    // 通过旧数据判断其是否为在上方添加（暂未实现）
    // 计算出增加的高度，将scrollHeight也增加对应的数值，即可使添加数据后滚动仍处于刚才的位置
    console.log(props.refScrollWarp?.scrollHeight)
    const nowScrollHeight = props.refScrollWarp?.scrollHeight
    // ScrollHeight 没有值是异常的，直接返回
    if (beforeTickScrollHeight == null || nowScrollHeight == null) {
      console.error(beforeTickScrollHeight == null || nowScrollHeight == null)
      return
    }
    // 增加的高度
    const addedHeight = nowScrollHeight - beforeTickScrollHeight
    // 增加的高度小于等于0是异常的，直接返回
    if (addedHeight <= 0) {
      console.error('addedHeight <= 0')
      return
    }
    // 设置当前滚动位置
    props.refScrollWarp?.scrollTo({
      top: props.refScrollWarp.scrollTop + addedHeight,
      // behavior: 'smooth', // 平滑滚动
    })
  })(dataOld)
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

// 消息的类型
export type ChatRoomMessagesItem = NonNullable<
  typeof chatRoomMessagesList.value
>[number]

// 消息变动时的滚动处理
const messagesWarpScroll = useScroll(props.refScrollWarp)
// props.refScrollWarp

onMounted(async () => {
  // 等待存在消息数据
  await watchUntilSourceCondition(chatRoomMessagesList, (val) => val != null)
  // 之后滚动到底部
  await nextTick()
  // console.log(props.refScrollWarp)
  // console.log(props.refScrollWarp?.scrollHeight)
  // console.log(props.refScrollWarp?.scrollTop)
  props.refScrollWarp?.scrollTo({
    top: props.refScrollWarp.scrollHeight,
    // behavior: 'smooth', // 平滑滚动
  })
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
          <div v-if="chatRoomMessagesList != null">
            <!-- 消息 -->
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
