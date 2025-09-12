<script setup lang="ts">
import {
  appLogo,
  appUserDefaultAvatar,
  chatRoomMessagesDispalyTogetherMaxSecondsConfig,
  fileUserAvatarConfig,
} from '@/config'
import type {
  ChatRoomMessagesItem,
  OpenMessageInfoDialogType,
} from './ChatCol.vue'
import { useAuthStore, useI18nStore } from '@/stores'
import { compareDatesSafeGetSecondsBetween } from '@/utils'
import { pb } from '@/lib'
import { onLongPress, useTimeAgo } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  /** 消息数据 */
  chatRoomMessagesItem: ChatRoomMessagesItem
  /**
   * 上一条消息、下一条消息，用于控制本条消息的样式，上下是指从旧到新（在列表中显示的上下）
   */
  /** 上一条消息 */
  chatRoomMessagesItemPrevious: ChatRoomMessagesItem | null
  /** 下一条消息 */
  chatRoomMessagesItemNext: ChatRoomMessagesItem | null
  /** 打开消息详情对话框 */
  openMessageInfoDialog: OpenMessageInfoDialogType
}>()

// 响应式的 pb.authStore
const authStore = useAuthStore()

/** 消息是否为当前用户发送判断函数 */
const determineMessageCurrentUserFn = (
  messagesItem: ChatRoomMessagesItem | null
) => {
  // 消息为null，即为false
  if (messagesItem == null) {
    return false
  }
  // 未登录，即为false
  if (!authStore.isValid || authStore.record == null) {
    return false
  }
  // 消息为当前用户发送
  if (messagesItem.author === authStore.record.id) {
    return true
  }
  return false
}

/** 当前消息是否为当前用户发送 */
const isMessageCurrentUser = computed(() =>
  determineMessageCurrentUserFn(props.chatRoomMessagesItem)
)

/**
 * 判断两条消息是否一起显示
 * ```
 * 两条为同一用户，且相差时间不超过配置值，即一起显示
 * ```
 */
const determineMessagesDispalyTogetherFn = (
  messagesItem1: ChatRoomMessagesItem | null,
  messagesItem2: ChatRoomMessagesItem | null
) => {
  // 无消息，即为false
  if (messagesItem1 == null || messagesItem2 == null) {
    return false
  }
  // 不是同一用户，即为false
  if (messagesItem1.author !== messagesItem2.author) {
    return false
  }
  // 相差时间超过配置值（或日期问题null），即为false
  const messageBetweenSeconds = compareDatesSafeGetSecondsBetween(
    messagesItem1.created,
    messagesItem2.created
  )
  if (messageBetweenSeconds == null) {
    return false
  }
  if (
    // 绝对值 Math.abs 保证结果为正数
    Math.abs(messageBetweenSeconds) >
    chatRoomMessagesDispalyTogetherMaxSecondsConfig
  ) {
    return false
  }
  // 通过以上检查，即为true
  return true
}

/**
 * 是否和上消息一起显示
 * ```
 * 不显示消息气泡框上方头像侧圆角
 * ```
 */
const isMessagesDispalyTogetherPrevious = computed(() => {
  return determineMessagesDispalyTogetherFn(
    props.chatRoomMessagesItem,
    props.chatRoomMessagesItemPrevious
  )
})

/**
 * 是否和下一条消息一起显示
 * ```
 * 不显示头像和名称
 * 不显示消息气泡框下方头像侧圆角
 * ```
 */
const isMessagesDispalyTogetherNext = computed(() => {
  return determineMessagesDispalyTogetherFn(
    props.chatRoomMessagesItem,
    props.chatRoomMessagesItemNext
  )
})

// 控制圆角显示
const isMessageBoxroundedTL = computed(() => {
  if (isMessageCurrentUser.value) {
    return true
  } else {
    if (isMessagesDispalyTogetherPrevious.value) {
      return false
    } else {
      return true
    }
  }
})
const isMessageBoxroundedTR = computed(() => {
  if (isMessageCurrentUser.value) {
    if (isMessagesDispalyTogetherPrevious.value) {
      return false
    } else {
      return true
    }
  } else {
    return true
  }
})
const isMessageBoxroundedBL = computed(() => {
  if (isMessageCurrentUser.value) {
    return true
  } else {
    if (isMessagesDispalyTogetherNext.value) {
      return false
    } else {
      return true
    }
  }
})
const isMessageBoxroundedBR = computed(() => {
  if (isMessageCurrentUser.value) {
    if (isMessagesDispalyTogetherNext.value) {
      return false
    } else {
      return true
    }
  } else {
    return true
  }
})

// 头像
const messageUserAvatarUrl = computed(() => {
  // expand.author == null 这是异常（可能pb配置或前端api调用有误），但不抛错了，返回默认头像算了
  if (props.chatRoomMessagesItem.expand.author == null) {
    console.error('props.chatRoomMessagesItem.expand.author == null')
    return appUserDefaultAvatar
  }
  // 无头像，返回默认头像
  if (props.chatRoomMessagesItem.expand.author.avatar === '') {
    return appUserDefaultAvatar
  }
  // 有头像，返回头像url
  return pb.files.getURL(
    props.chatRoomMessagesItem.expand.author,
    props.chatRoomMessagesItem.expand.author.avatar,
    { thumb: fileUserAvatarConfig.thumb200x200f }
  )
})

// 用户名
const messageUserName = computed(() => {
  // expand.author == null 这是异常（可能pb配置或前端api调用有误），但不抛错了，返回空字符串算了
  if (props.chatRoomMessagesItem.expand.author == null) {
    console.error('props.chatRoomMessagesItem.expand.author == null')
    return ''
  }
  // 无名称，返回用户名
  if (props.chatRoomMessagesItem.expand.author.name === '') {
    return props.chatRoomMessagesItem.expand.author.username
  }
  // 有名称，返回名称
  return props.chatRoomMessagesItem.expand.author.name
})

const i18nStore = useI18nStore()

// 时间
const timeAgo = useTimeAgo(
  computed(() => props.chatRoomMessagesItem.created),
  {
    // i18n
    messages: i18nStore.t('useTimeAgoMessages')(),
  }
)

// 打开消息详情对话框函数
const openMessageInfoDialogFn = () => {
  props.openMessageInfoDialog(
    props.chatRoomMessagesItem.id,
    props.chatRoomMessagesItem
  )
}

// 处理消息行的长按
const onLongPressTargetRef = ref<HTMLElement | null>(null)
onLongPress(
  onLongPressTargetRef,
  () => {
    openMessageInfoDialogFn()
  },
  {
    delay: 500, // 默认是 1000ms，可自定义
    modifiers: {
      prevent: false, // 阻止默认行为，取消，避免影响文字赋值
      stop: true, // 阻止事件冒泡
    },
  }
)
</script>

<template>
  <!--
   chat-message-${chatRoomMessagesItem.id}，data-message-id，用于聊天页处理滚动的收集元素数据
  -->
  <div
    class="chat-message flow-root"
    :class="`chat-message-${chatRoomMessagesItem.id}`"
    :data-message-id="chatRoomMessagesItem.id"
  >
    <div class="mt-1">
      <!-- 头像与消息 -->
      <div
        ref="onLongPressTargetRef"
        class="avatar-message-box"
        :class="{
          // 消息为当前用户发送，flex-row-reverse使其靠右显示
          'flex-row-reverse': isMessageCurrentUser,
        }"
      >
        <!-- 头像列 -->
        <div class="col-avatar">
          <div class="flex h-full flex-col-reverse items-center">
            <!-- 头像 -->
            <div
              v-if="
                // 不与下一条消息一起显示时，才显示头像和名称
                isMessagesDispalyTogetherNext === false
              "
              class="h-[40px] w-full rounded-full bg-color-background-soft"
              :style="{
                backgroundImage: `url('${messageUserAvatarUrl}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }"
            ></div>
          </div>
        </div>
        <!-- 消息列 -->
        <div class="col-message">
          <div
            class="flex"
            :class="{
              // 消息为当前用户发送，flex-row-reverse使其靠右显示
              'flex-row-reverse': isMessageCurrentUser,
            }"
          >
            <div
              class="flex min-h-[40px] items-center"
              :class="{
                // 消息为当前用户发送，显示不同的消息背景色
                'bg-el-primary-light-4': isMessageCurrentUser,
                'bg-color-background-soft': !isMessageCurrentUser,
                // 圆角控制
                'rounded-tl-[20px]': isMessageBoxroundedTL,
                'rounded-tr-[20px]': isMessageBoxroundedTR,
                'rounded-bl-[20px]': isMessageBoxroundedBL,
                'rounded-br-[20px]': isMessageBoxroundedBR,
                'rounded-tl-[4px]': !isMessageBoxroundedTL,
                'rounded-tr-[4px]': !isMessageBoxroundedTR,
                'rounded-bl-[4px]': !isMessageBoxroundedBL,
                'rounded-br-[4px]': !isMessageBoxroundedBR,
              }"
            >
              <div class="flex-1">
                <div class="wrap-long-text mx-3 my-2 text-[15px]">
                  {{ chatRoomMessagesItem.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 图标列（详情按钮） -->
        <div class="col-icon">
          <div class="flex h-full flex-col-reverse items-center justify-center">
            <div
              class="more-button cursor-pointer"
              @click="openMessageInfoDialogFn"
            >
              <RiMoreFill></RiMoreFill>
            </div>
          </div>
        </div>
      </div>
      <!-- 用户名与时间 -->
      <div
        v-if="
          // 不与下一条消息一起显示时，才显示头像和名称
          isMessagesDispalyTogetherNext === false
        "
        class="mb-3 flex items-center"
        :class="{
          // 消息为当前用户发送，flex-row-reverse使其靠右显示
          'flex-row-reverse': isMessageCurrentUser,
        }"
      >
        <!-- 用户名 -->
        <div class="max-w-[50%] truncate text-[12px] font-bold text-color-text">
          {{ messageUserName }}
        </div>
        <!-- 分隔 -->
        <div class="mx-[8px]">
          <RiCircleFill size="4px" class="text-color-text-soft"></RiCircleFill>
        </div>
        <!-- 时间 -->
        <div class="truncate text-[12px] text-color-text-soft">
          {{ timeAgo }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.avatar-message-box {
  --avatar-width: 40px;
  --icon-width: 40px;
  --gap: 4px;

  display: flex;
  align-items: stretch;
  gap: var(--gap);

  .col-avatar {
    width: var(--avatar-width);
    min-height: var(--avatar-width);
  }

  .col-icon {
    width: var(--icon-width);
    min-height: var(--icon-width);
  }

  .col-message {
    // 限制消息列最大宽度， 40px 为头像列和图标列的宽度， 4px 为间隔宽度
    max-width: calc(
      100% - var(--avatar-width) - var(--icon-width) - var(--gap) - var(--gap)
    );
  }

  // more-button 默认不显示
  // 鼠标悬停在整个头像消息行时，会显示 more-button
  .more-button {
    // display: none;
    opacity: 0;
    transition:
      opacity 150ms,
      color 150ms;
    color: var(--color-text);
    // 这个是消息按钮的悬停
    &:hover {
      color: var(--color-text-soft);
    }
  }
  // 这个是整个头像消息行的悬停
  &:hover {
    .more-button {
      // display: block;
      opacity: 1;
    }
  }
}
</style>
