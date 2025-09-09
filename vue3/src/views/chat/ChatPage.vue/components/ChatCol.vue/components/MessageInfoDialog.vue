<script setup lang="ts">
import { pbMessagesGetOneApi } from '@/api'
import { useDialogOptimization } from '@/composables'
import { appUserDefaultAvatar, fileUserAvatarConfig } from '@/config'
import { pb } from '@/lib'
import { queryKeys, useChatRoomMessagesGetOneQuery } from '@/queries'
import { useAuthStore } from '@/stores'
import { generateRandomClassName, useDateFormatYYYYMMDDHHmmss } from '@/utils'
import {
  RiBookmarkLine,
  RiDiscussLine,
  RiEditLine,
  RiLink,
} from '@remixicon/vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { propsToString } from '@unhead/vue/server'
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

// 当前消息数据 useChatRoomMessagesGetOneQuery
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

// 响应式的 pb.authStore
const authStore = useAuthStore()

// 消息是否由当前用户发送
const isMessageSendByCurrentUser = computed(() => {
  // 未登录，直接返回false
  if (!authStore.isValid || authStore.record?.id == null) {
    return false
  }
  // 无消息数据，直接返回false
  if (chatRoomMessagesGetOneQuery.data.value == null) {
    return false
  }
  // author === authStore.record.id 即为当前用户，返回true
  if (chatRoomMessagesGetOneQuery.data.value.author === authStore.record.id) {
    return true
  }
  // 否则返回false
  return false
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
        <div class="ml-[15px] flex items-center justify-between">
          <!-- 头像 名称 用户名 -->
          <div class="flex-1 truncate">
            <div class="flex items-center">
              <!-- 头像 -->
              <div
                class="h-[40px] w-[40px] rounded-full border-[2px] border-color-background-soft bg-color-background-soft"
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
        <div class="mt-[10px]">
          <div class="flow-root rounded-[20px] bg-color-background-soft">
            <div class="wrap-long-text mx-[15px] my-[10px]">
              <!-- 消息 -->
              <div class="wrap-long-text">
                {{ chatRoomMessagesGetOneQuery.data.value.content }}
              </div>
              <!-- 时间 -->
              <div class="mt-[5px] flex items-center justify-end">
                <!-- 已修改图标 是否已修改 -->
                <div
                  v-if="
                    chatRoomMessagesGetOneQuery.data.value.created !==
                    chatRoomMessagesGetOneQuery.data.value.updated
                  "
                  class="mr-[6px] mt-[1px]"
                >
                  <ElTooltip
                    :content="
                      useDateFormatYYYYMMDDHHmmss(
                        chatRoomMessagesGetOneQuery.data.value.updated
                      ).value
                    "
                    placement="top"
                    effect="light"
                  >
                    <div>
                      <RiEditFill
                        size="12px"
                        class="text-color-text-soft"
                      ></RiEditFill>
                    </div>
                  </ElTooltip>
                </div>
                <!-- 时间 -->
                <div class="text-[12px] text-color-text-soft">
                  {{
                    useDateFormatYYYYMMDDHHmmss(
                      chatRoomMessagesGetOneQuery.data.value.created
                    ).value
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 操作按钮 TODO -->
        <div class="mr-[10px] mt-[5px]">
          <div class="flex items-center justify-end">
            <!-- 复制消息链接 -->
            <div
              class="flow-root cursor-pointer transition-colors hover:text-el-primary"
            >
              <div class="m-[5px]">
                <RiLink size="24px"></RiLink>
              </div>
            </div>
            <!-- 收藏 -->
            <div
              class="flow-root cursor-pointer transition-colors hover:text-el-warning"
            >
              <div class="m-[5px]">
                <RiBookmarkLine size="24px"></RiBookmarkLine>
              </div>
            </div>
            <!-- 回复 -->
            <div
              class="flow-root cursor-pointer transition-colors hover:text-el-success"
            >
              <div class="m-[5px]">
                <RiDiscussLine size="24px"></RiDiscussLine>
              </div>
            </div>
            <template v-if="isMessageSendByCurrentUser">
              <!-- 修改 -->
              <div
                class="flow-root cursor-pointer transition-colors hover:text-el-info"
              >
                <div class="m-[5px]">
                  <RiEditLine size="24px"></RiEditLine>
                </div>
              </div>
              <!-- 删除 -->
              <div
                class="flow-root cursor-pointer transition-colors hover:text-el-danger"
              >
                <div class="m-[5px]">
                  <RiDeleteBin7Line size="24px"></RiDeleteBin7Line>
                </div>
              </div>
            </template>
          </div>
        </div>
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
