<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RiArrowLeftSLine } from '@remixicon/vue'

const roomTitle = ref('')
const roomDescription = ref('')
const newTag = ref('')
const tags = ref(['TEST', 'TEST', 'TEST'])

// 检测进入页面
const isReady = ref(false)

onMounted(() => {
  setTimeout(() => {
    isReady.value = true
  }, 50)
})

function addTag() {
  if (newTag.value !== '' && !tags.value.includes(newTag.value)) {
    tags.value.push(newTag.value)
    newTag.value = ''
  }
}

function removeTag(index: number) {
  tags.value.splice(index, 1)
}
</script>

<template>
  <div class="flex h-full flex-col bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header
      class="flex h-14 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
    >
      <button
        class="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        @click="$router.back()"
      >
        <RiArrowLeftSLine class="h-6 w-6" />
      </button>
      <h1 class="text-lg font-semibold">创建房间</h1>
      <div class="w-8" />
    </header>

    <!-- 主要内容 -->
    <main class="flex-grow overflow-y-auto p-4 md:p-6 lg:p-4">
      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
        <div class="space-y-6">
          <h2 class="text-2xl font-bold text-cyan-500">信息编辑</h2>

          <!-- 上传封面 -->
          <div
            class="flex h-[240px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cyan-300 bg-cyan-50 p-8 text-center text-cyan-600 transition-all duration-700 ease-in-out hover:border-cyan-400 hover:bg-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-400 dark:hover:border-cyan-600 dark:hover:bg-cyan-900/30"
            :class="isReady ? 'opacity-100' : 'opacity-0'"
          >
            <!-- 动画 svg -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-12"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              >
                <path
                  stroke-dasharray="72"
                  stroke-dashoffset="72"
                  d="M3 14v-9h18v14h-18v-5"
                >
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    dur="0.6s"
                    values="72;0"
                  />
                </path>
                <path
                  stroke-dasharray="24"
                  stroke-dashoffset="24"
                  stroke-width="1"
                  d="M3 16l4 -3l3 2l6 -5l5 4"
                >
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    begin="0.6s"
                    dur="0.4s"
                    values="24;0"
                  />
                </path>
              </g>
              <circle
                cx="7.5"
                cy="9.5"
                r="1.5"
                fill="currentColor"
                fill-opacity="0"
              >
                <animate
                  fill="freeze"
                  attributeName="fill-opacity"
                  begin="1s"
                  dur="0.2s"
                  values="0;1"
                />
              </circle>
            </svg>
            <p class="mt-2 text-lg font-semibold">请上传封面图片</p>
            <p class="text-sm">支持 JPG, PNG, WEBP 等多种格式</p>
          </div>

          <!-- 编辑标题 -->
          <input
            v-model="roomTitle"
            type="text"
            placeholder="单击此处输入标题"
            class="w-full rounded-lg border-gray-300 bg-white p-3 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700"
          />

          <!-- 编辑简介 -->
          <textarea
            v-model="roomDescription"
            placeholder="单击此处输入简介"
            rows="5"
            class="w-full resize-none rounded-lg border-gray-300 bg-white p-3 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700"
          />

          <!-- 编辑 Tag -->
          <div>
            <input
              v-model="newTag"
              type="text"
              placeholder="单击输入文本后按 Enter 创建标签"
              class="w-full rounded-lg border-gray-300 bg-white p-3 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700"
              @keydown.enter.prevent="addTag"
            />
            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="(tag, index) in tags"
                :key="index"
                class="flex items-center rounded-full bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
              >
                # {{ tag }}
                <button
                  class="ml-2 text-cyan-500 hover:text-cyan-700"
                  @click="removeTag(index)"
                >
                  &times;
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- 房间属性 -->
        <div class="">
          <!-- 房间预览文本 -->
          <div>
            <h2 class="text-2xl font-bold text-cyan-500">预览</h2>
            <p class="text-gray-500 dark:text-gray-400">
              这是您的房间被其他人看到的样子
            </p>
            <!-- 视觉上的区域限制容器 -->
            <div
              class="relative mt-4 h-[280px] w-full overflow-hidden lg:h-[314px]"
            >
              <!-- 上阴影遮罩 -->
              <div
                class="absolute top-0 z-50 h-6 w-full bg-gradient-to-b from-gray-50 via-gray-50/30 to-gray-50/0 dark:from-gray-900 dark:via-gray-900/30 dark:to-gray-900/0"
              ></div>
              <!-- 下阴影遮罩 -->
              <div
                class="absolute bottom-0 z-50 h-6 w-full bg-gradient-to-t from-gray-50 via-gray-50/30 to-gray-50/0 dark:from-gray-900 dark:via-gray-900/30 dark:to-gray-900/0"
              ></div>
              <!-- 实际上的预览卡片 rendering 区域 -->
              <div
                class="absolute -top-[60px] left-0 z-40 h-[400px] w-full columns-3 p-4 transition-all duration-700 ease-in-out lg:-top-[105px] lg:h-[588px]"
                :class="isReady ? 'pt-4 opacity-100' : 'pt-20 opacity-0'"
              >
                <div
                  class="group relative mb-3 flow-root h-44 transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60 lg:h-60"
                ></div>
                <div
                  class="group relative mb-3 flow-root h-44 transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60 lg:h-60"
                ></div>
                <div
                  class="group relative mb-3 flow-root h-20 transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60 lg:h-28"
                ></div>
                <div
                  class="group relative mb-3 flow-root h-44 transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60 lg:h-60"
                ></div>
                <div
                  class="group relative mb-3 flow-root h-20 transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60 lg:h-28"
                ></div>
                <div
                  class="group relative mb-3 flow-root h-44 transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60 lg:h-60"
                ></div>
                <div
                  class="group relative mb-3 flow-root h-44 transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60 lg:h-60"
                ></div>
              </div>
            </div>
          </div>

          <!-- 属性设置 -->
          <div>
            <h2 class="mt-4 text-2xl font-bold text-cyan-500">房间设置</h2>
            <div class="mt-4">
              <div
                class="mt-4 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"
              >
                <span>人数限制</span>
                <span class="text-gray-500 dark:text-gray-400"
                  >不限制 | 7人</span
                >
              </div>
              <div
                class="mt-4 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"
              >
                <span>密码限制</span>
                <span class="text-gray-500 dark:text-gray-400"
                  >已设置四位密码</span
                >
              </div>
            </div>
          </div>

          <!-- Create Room Button -->
          <button
            class="mt-4 w-full rounded-lg bg-cyan-500 py-4 text-lg font-bold text-white shadow-lg hover:bg-cyan-600"
          >
            创建房间 &gt;
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
