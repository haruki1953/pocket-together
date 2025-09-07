<script setup lang="ts">
import { pbMessagesGetOneApi } from '@/api'
import { useDialogOptimization } from '@/composables'
import { appUserDefaultAvatar, fileUserAvatarConfig } from '@/config'
import { pb } from '@/lib'
import { queryKeys, useChatRoomMessagesGetOneQuery } from '@/queries'
import { generateRandomClassName } from '@/utils'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useWindowSize } from '@vueuse/core'

// 还是通过普通的ref设置dialogMessageId比较好
const dialogMessageId = ref<string | null>(null)
const dialogVisible = ref(false)

const windowSize = useWindowSize()
const dialogWidth = computed(() => {
  const width = 500
  const windowWidth = windowSize.width.value
  return windowWidth * 0.9 < width ? '90%' : width
})

// 自定义遮罩类名，随机生成
const overlayClass = generateRandomClassName()
// 对话框优化
const { open, close } = useDialogOptimization({
  dialogVisible,
  overlayClass,
})

const queryClient = useQueryClient()
const openMessageInfoDialog = (
  messageId: string,
  // 支持预填数据
  messageQueryData?: NonNullable<typeof chatRoomMessagesGetOneQuery.data.value>
) => {
  // 预填数据
  if (messageQueryData != null) {
    // 设置数据
    queryClient.setQueryData(
      queryKeys.chatRoomMessagesGetOne(messageQueryData.id),
      // 确保类型正确
      messageQueryData satisfies NonNullable<
        typeof chatRoomMessagesGetOneQuery.data.value
      >
    )
    // // 立即标记为过期，可选。会使打开对话框时再重新请求数据
    // queryClient.invalidateQueries({
    //   queryKey: queryKeys.chatRoomMessagesGetOne(messageQueryData.id),
    // })
  }
  dialogMessageId.value = messageId
  open()
}

defineExpose({
  openMessageInfoDialog,
  close,
})

const chatRoomMessagesGetOneQuery = useChatRoomMessagesGetOneQuery({
  messageId: computed(() => dialogMessageId.value),
})

// 头像
const messageUserAvatarUrl = computed(() => {
  // 无数据，返回默认头像（其实无数据时根本不会用到头像，返回默认头像是为了使其类型方便）
  if (chatRoomMessagesGetOneQuery.data.value == null) {
    return appUserDefaultAvatar
  }
  // expand.author == null 这是异常（可能pb配置或前端api调用有误），但不抛错了，返回默认头像算了
  if (chatRoomMessagesGetOneQuery.data.value.expand.author == null) {
    console.error(
      'chatRoomMessagesGetOneQuery.data.value.expand.author == null'
    )
    return appUserDefaultAvatar
  }
  // 无头像，返回默认头像
  if (chatRoomMessagesGetOneQuery.data.value.expand.author.avatar === '') {
    return appUserDefaultAvatar
  }
  // 有头像，返回头像url
  return pb.files.getURL(
    chatRoomMessagesGetOneQuery.data.value.expand.author,
    chatRoomMessagesGetOneQuery.data.value.expand.author.avatar,
    { thumb: fileUserAvatarConfig.thumb200x200f }
  )
})

// 名称
const messageUserName = computed(() => {
  // 无数据，返回空字符串
  if (chatRoomMessagesGetOneQuery.data.value == null) {
    return ''
  }
  // expand.author == null 这是异常（可能pb配置或前端api调用有误），但不抛错了，返回空字符串算了
  if (chatRoomMessagesGetOneQuery.data.value.expand.author == null) {
    console.error(
      'chatRoomMessagesGetOneQuery.data.value.expand.author == null'
    )
    return ''
  }
  // 无名称，返回用户名
  if (chatRoomMessagesGetOneQuery.data.value.expand.author.name === '') {
    return chatRoomMessagesGetOneQuery.data.value.expand.author.username
  }
  // 有名称，返回名称
  return chatRoomMessagesGetOneQuery.data.value.expand.author.name
})
</script>

<template>
  <div>
    <ElDialog
      v-model="dialogVisible"
      :width="dialogWidth"
      :lockScroll="false"
      appendToBody
      :modalClass="overlayClass"
    >
      <!-- 显示消息数据 -->
      <template v-if="chatRoomMessagesGetOneQuery.data.value != null">
        <!-- {{ chatRoomMessagesGetOneQuery.data.value }} -->
        <!-- 用户信息 + 关闭按钮 -->
        <div class="flex items-center justify-between">
          <!-- 头像 名称 用户名 -->
          <div class="flex-1 truncate">
            <div class="flex items-center">
              <!-- 头像 -->
              <div
                class="h-[40px] w-[40px] rounded-full bg-color-background-soft"
                :style="{
                  backgroundImage: `url('${messageUserAvatarUrl}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }"
              ></div>
              <!-- 名称 用户名 -->
              <div class="flex-1 truncate">
                <div class="ml-[10px]">
                  <div class="truncate font-bold text-color-text">
                    {{ messageUserName }}
                  </div>
                  <div class="truncate text-[12px] text-color-text-soft">
                    @{{
                      chatRoomMessagesGetOneQuery.data.value.expand.author
                        ?.username
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 关闭按钮 -->
          <div class="mx-[10px] cursor-pointer" @click="close()">
            <RiCloseFill></RiCloseFill>
          </div>
        </div>
        <!-- 消息卡片 -->
        <!-- 操作按钮 -->
      </template>
      <template v-else>
        <!-- 显示获取中 -->
        <template v-if="chatRoomMessagesGetOneQuery.isFetching.value === true">
          获取中
        </template>
        <!-- 消息不存在 -->
        <template v-else> 消息不存在 </template>
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped></style>
