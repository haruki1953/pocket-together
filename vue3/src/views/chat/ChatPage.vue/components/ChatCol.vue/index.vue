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
import {
  chatRoomMessagesLimitInitShowItemNumberConfig,
  chatRoomMessagesLimitLoadMoreMaxItemNumberConfig,
  chatRoomMessagesLimitShowItemMaxNumberConfig,
  chatRoomMessagesScrollRealtimeIsBottomDistanceConfig,
} from '@/config'

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

/**
 * 下一页逻辑，向上加载更多
 * ```
 * chatRoomMessagesListAndRealtime 简称 cRMLAR ，是当前无限查询加实时消息全部的数组
 * chatRoomMessagesLimitLoadMoreMaxItemNumberConfig 简称 cRMLLMMINC ，是每次加载更多消息的最多数量
 * chatRoomMessagesLimitTopCursor
 * chatRoomMessagesLimitBottomCursor
 *
 * 循环 {
 *   判断剩余的 cRMLAR 是否足够 cRMLLMMINC，够 {
 *     退出循环
 *   }
 *   是否最后一页，是 {
 *     退出循环
 *   }
 *   请求下一页
 * }
 *
 * 计算限制游标
 *
 *
 * ```
 */
// 测试，查询下一页
const testPbPage = async () => {
  console.log(chatRoomMessagesInfiniteQuery.data.value)

  // 处理聊天滚动（在消息变动前），将在下面的回调中被赋值
  let chatScrollCaptureSnapshot = null as ReturnType<
    typeof chatScrollCaptureSnapshotBeforeMessageChange
  > | null

  await (async (data: {
    /**
     * 在显示限制游标被赋值的前一刻，会调用这个函数
     * 也就是显示内容改变的前一刻，主要用于 chatScrollCaptureSnapshotBeforeMessageChange 调用
     */
    beforeLimitCursorUpdate: () => void
  }) => {
    // 没有消息数据，直接返回
    if (chatRoomMessagesListAndRealtime.value == null) {
      return
    }
    if (chatRoomMessagesLimitList.value == null) {
      return
    }
    // 已经显示最顶部的数据，返回
    if (
      chatRoomMessagesInfiniteQuery.hasNextPage.value === false &&
      chatRoomMessagesLimitList.value.length > 0 &&
      chatRoomMessagesListAndRealtime.value.length > 0 &&
      chatRoomMessagesLimitList.value[0].id ===
        chatRoomMessagesListAndRealtime.value[0].id
    ) {
      return
    }
    // chatRoomMessagesLimitTopCursor 为 null，这是不正常的情况，返回
    if (chatRoomMessagesLimitTopCursor.value == null) {
      // 为了增强或许可以进行一些操作
      return
    }
    while (true) {
      // 计算顶部剩余的数量（cRMLAR）
      const topRemainingNumber = (() => {
        // 获取 index
        const findIndex = chatRoomMessagesListAndRealtime.value.findIndex(
          (i) => i.id === chatRoomMessagesLimitTopCursor.value
        )
        // 未找到 index
        if (findIndex === -1) {
          return 'findIndex === -1' as const
        }
        // index 的值即为数组在此项前方的数量
        return findIndex
      })()
      // 未找到 TopCursor 对应的item，这是不正常的
      if (topRemainingNumber === 'findIndex === -1') {
        return
      }
      // 【break 1】判断剩余的 cRMLAR 是否足够 cRMLLMMINC ，够则退出循环
      if (
        topRemainingNumber >= chatRoomMessagesLimitLoadMoreMaxItemNumberConfig
      ) {
        break
      }
      // 【break 2】是否最后一页（没有下一页），是则退出循环
      if (chatRoomMessagesInfiniteQuery.hasNextPage.value === false) {
        break
      }
      // 请求下一页
      await chatRoomMessagesInfiniteQuery.fetchNextPage()
    }
    // 计算限制游标
    // 当前TopCursor的index
    const indexTopCursorNow = (() => {
      // 获取当前index，因为上面找过，所以这里肯定是找到的（不可能等于-1）
      const findIndex = chatRoomMessagesListAndRealtime.value.findIndex(
        (i) => i.id === chatRoomMessagesLimitTopCursor.value
      )
      return findIndex
    })()
    // 新的TopCursor的index
    const indexTopCursorNew = (() => {
      // 顶部增加 cRMLLMMINC 个消息
      const newIndex =
        indexTopCursorNow - chatRoomMessagesLimitLoadMoreMaxItemNumberConfig
      // 避免index不合法，一般是数组过短引起的 index < 0，返回 0 即可，意为数组从后往前不够 cRMLLMMINC 个则尽可能靠前的item
      if (
        newIndex < 0 ||
        newIndex > chatRoomMessagesListAndRealtime.value.length - 1
      ) {
        return 0
      }
      // index合法，返回
      return newIndex
    })()
    // 新的BottomCursor的index
    const indexBottomCursorNew = (() => {
      // 计算将增加的数量 indexTopCursorNow 的值大于 indexTopCursorNew
      const willAddItemNumber = indexTopCursorNow - indexTopCursorNew
      // 计算增加后的总数量
      const AddedArrayLength =
        chatRoomMessagesLimitList.value.length + willAddItemNumber
      // 判断是否超出，未超出，返回 'AddedArrayLength <= chatRoomMessagesLimitShowItemMaxNumberConfig'
      if (AddedArrayLength <= chatRoomMessagesLimitShowItemMaxNumberConfig) {
        return 'AddedArrayLength <= chatRoomMessagesLimitShowItemMaxNumberConfig'
      }
      // 超出，根据indexTopCursorNew计算indexBottomCursorNew，index肯定不会大于最大值，其实不必担心index不合法
      const newIndex =
        indexTopCursorNew + (chatRoomMessagesLimitShowItemMaxNumberConfig - 1)
      if (
        newIndex < 0 ||
        newIndex > chatRoomMessagesListAndRealtime.value.length - 1
      ) {
        return chatRoomMessagesListAndRealtime.value.length - 1
      }
      return newIndex
    })()

    // 获取游标值
    const valTopCursorNew =
      chatRoomMessagesListAndRealtime.value[indexTopCursorNew].id
    const valBottomCursorNew = (() => {
      // 未超出，则 chatRoomMessagesLimitBottomCursor 不用改，返回当前值即可
      if (
        indexBottomCursorNew ===
        'AddedArrayLength <= chatRoomMessagesLimitShowItemMaxNumberConfig'
      ) {
        return chatRoomMessagesLimitBottomCursor.value
      }
      // 超出，即根据刚刚得到indexBottomCursorNew获取
      return chatRoomMessagesListAndRealtime.value[indexBottomCursorNew].id
    })()

    // 调用回调函数 beforeLimitCursorUpdate
    data.beforeLimitCursorUpdate()

    // 为显示限制游标赋值
    chatRoomMessagesLimitTopCursor.value = valTopCursorNew
    chatRoomMessagesLimitBottomCursor.value = valBottomCursorNew

    // console.log(chatRoomMessagesLimitTopCursor.value)
    // console.log(chatRoomMessagesLimitBottomCursor.value)
    // console.log(chatRoomMessagesLimitList.value)
  })({
    // 在显示限制游标被赋值的前一刻，会调用这个函数 也就是显示内容改变的前一刻
    beforeLimitCursorUpdate: () => {
      chatScrollCaptureSnapshot = chatScrollCaptureSnapshotBeforeMessageChange()
    },
  })

  if (chatScrollCaptureSnapshot == null) {
    return
  }
  // 处理聊天滚动（在消息变动后）
  chatScrollAdjustPositionAfterMessageChange(chatScrollCaptureSnapshot)
}

// 测试，查询上一页（控制显示限制）
const testPbPageBottom = async () => {
  // 处理聊天滚动（在消息变动前），将在下面的回调中被赋值
  let chatScrollCaptureSnapshot = null as ReturnType<
    typeof chatScrollCaptureSnapshotBeforeMessageChange
  > | null

  await (async (data: {
    /**
     * 在显示限制游标被赋值的前一刻，会调用这个函数
     * 也就是显示内容改变的前一刻，主要用于 chatScrollCaptureSnapshotBeforeMessageChange 调用
     */
    beforeLimitCursorUpdate: () => void
  }) => {
    // 没有消息数据，直接返回
    if (chatRoomMessagesListAndRealtime.value == null) {
      return
    }
    if (chatRoomMessagesLimitList.value == null) {
      return
    }
    // 已显示最底部的数据，返回
    if (chatRoomMessagesLimitBottomCursor.value == null) {
      return
    }
    // chatRoomMessagesLimitTopCursor 为 null，这是不正常的情况，返回
    if (chatRoomMessagesLimitTopCursor.value == null) {
      // 为了增强或许可以进行一些操作
      return
    }
    // 计算限制游标
    // 当前BottomCursor的index
    const indexBottomCursorNow =
      chatRoomMessagesListAndRealtime.value.findIndex(
        (i) => i.id === chatRoomMessagesLimitBottomCursor.value
      )
    // 未找到 BottomCursor 对应的item，这是不正常的，返回
    if (indexBottomCursorNow === -1) {
      return
    }
    // 新的BottomCursor的index
    const indexBottomCursorNew = (() => {
      // 底部增加 cRMLLMMINC 个消息
      const newIndex =
        indexBottomCursorNow + chatRoomMessagesLimitLoadMoreMaxItemNumberConfig
      // 避免index不合法，增加后可能会超出数组长度，返回最大的index即可，即代表数组最后一个元素
      if (
        newIndex < 0 ||
        newIndex > chatRoomMessagesListAndRealtime.value.length - 1
      ) {
        return chatRoomMessagesListAndRealtime.value.length - 1
      }
      return newIndex
    })()
    // 新的TopCursor的index
    const indexTopCursorNew = (() => {
      // 计算将增加的数量 indexBottomCursorNew 的值大于 indexBottomCursorNow
      const willAddItemNumber = indexBottomCursorNew - indexBottomCursorNow
      // 计算增加后的总数量
      const AddedArrayLength =
        chatRoomMessagesLimitList.value.length + willAddItemNumber
      // 判断是否超出，未超出，返回 'AddedArrayLength <= chatRoomMessagesLimitShowItemMaxNumberConfig'
      if (AddedArrayLength <= chatRoomMessagesLimitShowItemMaxNumberConfig) {
        return 'AddedArrayLength <= chatRoomMessagesLimitShowItemMaxNumberConfig'
      }
      // 超出，根据indexBottomCursorNew计算indexTopCursorNew，index肯定不会小于0，其实不必担心index不合法
      const newIndex =
        indexBottomCursorNew -
        (chatRoomMessagesLimitShowItemMaxNumberConfig - 1)
      if (
        newIndex < 0 ||
        newIndex > chatRoomMessagesListAndRealtime.value.length - 1
      ) {
        return 0
      }
      return newIndex
    })()

    // 获取游标值
    const valTopCursorNew = (() => {
      // 未超出，则 chatRoomMessagesLimitTopCursor 不用改，返回当前值即可
      if (
        indexTopCursorNew ===
        'AddedArrayLength <= chatRoomMessagesLimitShowItemMaxNumberConfig'
      ) {
        return chatRoomMessagesLimitTopCursor.value
      }
      // 超出，即根据刚刚得到indexTopCursorNew获取
      return chatRoomMessagesListAndRealtime.value[indexTopCursorNew].id
    })()
    const valBottomCursorNew = (() => {
      // indexBottomCursorNew 为数组中最后一个，则返回null
      if (
        indexBottomCursorNew ===
        chatRoomMessagesListAndRealtime.value.length - 1
      ) {
        return null
      }
      // 正常，即根据刚刚得到indexBottomCursorNew获取
      return chatRoomMessagesListAndRealtime.value[indexBottomCursorNew].id
    })()

    console.log(props.refScrollWarp?.scrollHeight)
    console.log(props.refScrollWarp?.scrollTop)

    // 调用回调函数 beforeLimitCursorUpdate
    data.beforeLimitCursorUpdate()

    // 为显示限制游标赋值
    chatRoomMessagesLimitTopCursor.value = valTopCursorNew
    chatRoomMessagesLimitBottomCursor.value = valBottomCursorNew
  })({
    // 在显示限制游标被赋值的前一刻，会调用这个函数 也就是显示内容改变的前一刻
    beforeLimitCursorUpdate: () => {
      chatScrollCaptureSnapshot = chatScrollCaptureSnapshotBeforeMessageChange()
    },
  })

  if (chatScrollCaptureSnapshot == null) {
    return
  }
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

// 限制消息显示数量，顶部游标与底部游标
const chatRoomMessagesLimitTopCursor = ref<string | null>(null)
const chatRoomMessagesLimitBottomCursor = ref<string | null>(null)

// 已限制数量的消息列表
const chatRoomMessagesLimitList = computed(() => {
  // chatRoomMessagesListAndRealtime 没有值，返回null
  if (chatRoomMessagesListAndRealtime.value == null) {
    return null
  }
  // 都为默认值，限制数量功能还未初始化，返回null
  if (
    chatRoomMessagesLimitTopCursor.value == null &&
    chatRoomMessagesLimitBottomCursor.value == null
  ) {
    return null
  }

  // 找到两个Cursor所对应的序列值
  const indexTopCursor = (() => {
    // 未找到则默认为第一个
    const defaultIndex = 0
    if (chatRoomMessagesLimitTopCursor.value == null) {
      return defaultIndex
    }
    const findIndex = chatRoomMessagesListAndRealtime.value.findIndex(
      (i) => i.id === chatRoomMessagesLimitTopCursor.value
    )
    if (findIndex === -1) {
      return defaultIndex
    }
    return findIndex
  })()
  const indexBottomCursor = (() => {
    // 未找到则默认为最后一个
    const defaultIndex = chatRoomMessagesListAndRealtime.value.length - 1
    if (chatRoomMessagesLimitBottomCursor.value == null) {
      return defaultIndex
    }
    const findIndex = chatRoomMessagesListAndRealtime.value.findIndex(
      (i) => i.id === chatRoomMessagesLimitBottomCursor.value
    )
    if (findIndex === -1) {
      return defaultIndex
    }
    return findIndex
  })()

  // 包含indexBottomCursor所指的
  const limitList = chatRoomMessagesListAndRealtime.value.slice(
    indexTopCursor,
    indexBottomCursor + 1
  )
  return limitList
})

// 初始化显示限制，setup时就可以进行
;(async () => {
  // 等待存在消息数据
  await watchUntilSourceCondition(
    chatRoomMessagesListAndRealtime,
    (val) => val != null
  )
  // 此时仍不存在消息数据是异常的，直接返回
  // watchUntilSourceCondition 并不能约束类型
  // 主要目的是让下文的 chatRoomMessagesListAndRealtime 类型正确
  if (chatRoomMessagesListAndRealtime.value == null) {
    console.error('chatRoomMessagesListAndRealtime.value == null')
    return
  }

  // chatRoomMessagesLimitInitShowItemNumberConfig 简称为 cRMLISINC
  // 从后往前限制 cRMLISINC 个，也就是找到从后往前第 cRMLISINC 个的item
  const indexTopCursor = (() => {
    // length - cRMLISINC 即从后往前第 cRMLISINC 个的item
    const index =
      chatRoomMessagesListAndRealtime.value.length -
      chatRoomMessagesLimitInitShowItemNumberConfig
    // 避免index不合法，一般是数组过短引起的 index < 0，返回 0 即可，意为数组从后往前不够 cRMLISINC 个则尽可能靠前的item
    if (index < 0 || index > chatRoomMessagesListAndRealtime.value.length - 1) {
      return 0
    }
    return index
  })()

  const itemTopCursor = chatRoomMessagesListAndRealtime.value[indexTopCursor]

  // 为用于显示数量限制的游标赋值
  chatRoomMessagesLimitTopCursor.value = itemTopCursor.id
})()

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
