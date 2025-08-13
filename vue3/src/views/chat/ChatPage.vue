<script setup lang="ts">
import { useI18nStore } from '@/stores'
import { RiSendPlane2Fill, RiSendPlane2Line } from '@remixicon/vue'

const i18nStore = useI18nStore()
useSeoMeta({
  title: computed(() => i18nStore.t('pageChat')()),
})

const inputTest = ref('')
</script>

<template>
  <div class="chat-page">
    <div class="container-col2-box">
      <ContainerCol2
        col1Position="right"
        col1Twcss="flex-1"
        col2Twcss="w-[500px]"
      >
        <template #col1>
          <div class="my-6 ml-2">
            <div>用户列表</div>
            <div class="h-[2000px] bg-red-950"></div>
            <div>用户列表</div>
          </div>
        </template>
        <template #col2>
          <div>
            <ContainerBar>
              <template #default>
                <div class="mb-1 ml-6 mr-4 mt-6">
                  <div>聊天栏</div>
                  <div class="h-[2000px] bg-red-950"></div>
                  <div>聊天栏聊天栏聊天栏聊天栏聊天栏</div>
                </div>
              </template>
              <template #bar>
                <div>
                  <div class="chat-input-bar ml-6 mr-4 flow-root">
                    <div
                      class="chat-input-box mb-3 mt-5 flow-root rounded-3xl bg-color-background-soft"
                    >
                      <!-- <div class="m-3 h-16 bg-red-950">输入框</div> -->
                      <div class="my-2 flex items-center">
                        <!-- 输入框 -->
                        <div class="ml-2 mr-1 flex-1">
                          <ElInput
                            v-model="inputTest"
                            size="large"
                            type="textarea"
                            resize="none"
                            :rows="1"
                            :autosize="{ minRows: 1, maxRows: 10 }"
                          />
                        </div>
                        <!-- 按钮 -->
                        <div class="mr-2">
                          <ElButton circle type="primary">
                            <template #icon>
                              <RiSendPlane2Fill></RiSendPlane2Fill>
                            </template>
                          </ElButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </ContainerBar>
          </div>
        </template>
      </ContainerCol2>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container-col2-box {
  :deep() {
    .slot-col2-with-el-scrollbar {
      .el-scrollbar__wrap {
        // 防止目标区域中的滚动触发父元素中的滚动
        overscroll-behavior: contain;
      }
    }
  }
}
.chat-input-bar {
  // 背景色 --color-background
  // 渐变，透明
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--color-background) 30px
  );
}
.chat-input-box {
  :deep() {
    .el-textarea__inner {
      // color: var(--color-text);
      // font-weight: bold;
      border: none;
      box-shadow: none;
      background-color: transparent;
      // transition:
      //   background-color 0.5s,
      //   color 0.2s;
      color: var(--color-text);
      // font-weight: bold;
      // font-size: 16px;
      // 防止目标区域中的滚动触发父元素中的滚动
      overscroll-behavior: contain;
    }
    // .el-input__wrapper {
    //   background-color: var(--color-background-soft);
    //   transition: all 0.5s;
    //   box-shadow: none;
    //   &:hover {
    //     box-shadow: none;
    //   }
    //   .el-input__inner {
    //     color: var(--color-text);
    //     transition: all 0.2s;
    //     font-weight: bold;
    //     // text-align: center;
    //   }
    // }
  }
}
</style>
