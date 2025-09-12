<script setup lang="ts">
import type { MessagesResponseWidthExpand } from '@/api'
import { ChatInputBar, ChatMessage } from './dependencies'
import { useI18nStore } from '@/stores'
import MessageInfoDialog from './components/MessageInfoDialog.vue'

const i18nStore = useI18nStore()

/**
 * ChatCol的主要渲染内容，达到将逻辑和内容分离的效果
 * 将 ChatCol.vue\index.vue 拆分封装为 ChatCol.vue\ChatColTemplateBase.vue，以便之后将单向最新无限查询与双向定位无限查询分为两个组件
 */
const props = defineProps<{
  isChatTopHasMore: boolean
  isShowMoreRunning: boolean
  chatShowMoreOnTop: () => Promise<void>
  chatRoomMessagesForShow: MessagesResponseWidthExpand[] | null
  isChatBottomHasMore: boolean
  chatShowMoreOnBottom: () => Promise<void>
}>()

// 消息详情对话框
const refMessageInfoDialog = ref<InstanceType<typeof MessageInfoDialog> | null>(
  null
)

// 打开消息详情对话框，类型和refMessageInfoDialog导出的一致
const openMessageInfoDialog: NonNullable<
  typeof refMessageInfoDialog.value
>['openMessageInfoDialog'] = (messageId, messageQueryData) => {
  refMessageInfoDialog.value?.openMessageInfoDialog(messageId, messageQueryData)
}
// eslint-disable-next-line prettier/prettier
export type OpenMessageInfoDialogType = typeof openMessageInfoDialog;
</script>

<template>
  <div>
    <!-- 消息详情对话框 -->
    <MessageInfoDialog ref="refMessageInfoDialog"></MessageInfoDialog>
    <!-- bottomHeight测量的高度会有延时，如果需要立即测量滚动高度就会导致问题，此时可以通过此参数指定默认高度 -->
    <!-- 聊天页的滚动控制，初始需要在底部，需要指定默认高度（输入框为空时的高度） -->
    <ContainerBar :defaultBarHeight="72">
      <template #default>
        <div class="mb-1 mt-6">
          <!-- <ElButton @click="testPbPage">pb分页测试</ElButton> -->
          <!-- <ElButton @click="testPbSend">pb批量消息</ElButton> -->
          <div
            v-if="isChatTopHasMore"
            class="mt-[-24px] flex items-center justify-center"
          >
            <ElButton
              class="chat-show-more-button top"
              round
              size="small"
              text
              type="primary"
              :loading="isShowMoreRunning"
              @click="chatShowMoreOnTop"
            >
              <template v-if="isShowMoreRunning">
                {{ i18nStore.t('chatOnTopOrBottomShowMoreRunningText')() }}
              </template>
              <template v-else>
                {{ i18nStore.t('chatOnTopOrBottomShowMoreText')() }}
              </template>
            </ElButton>
          </div>
          <!-- 聊天栏 -->
          <div v-if="chatRoomMessagesForShow != null">
            <!-- 消息 -->
            <ChatMessage
              v-for="(item, index) in chatRoomMessagesForShow"
              :key="item.id"
              :openMessageInfoDialog="openMessageInfoDialog"
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
          <!-- <ElButton @click="testPbPageBottom">pb分页测试</ElButton> -->
          <div
            v-if="isChatBottomHasMore"
            class="flex items-center justify-center"
          >
            <ElButton
              class="chat-show-more-button bottom"
              round
              size="small"
              text
              type="primary"
              :loading="isShowMoreRunning"
              @click="chatShowMoreOnBottom"
            >
              <template v-if="isShowMoreRunning">
                {{ i18nStore.t('chatOnTopOrBottomShowMoreRunningText')() }}
              </template>
              <template v-else>
                {{ i18nStore.t('chatOnTopOrBottomShowMoreText')() }}
              </template>
            </ElButton>
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

<style lang="scss" scoped>
.chat-show-more-button {
  min-width: 50%;
  &.is-loading:before {
    // background-color: transparent;
    background-color: var(--color-background-a30);
  }
  // &.top {
  //   border-radius: 0 0 20px 20px;
  // }
}
</style>
