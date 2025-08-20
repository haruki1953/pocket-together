<script setup lang="ts">
import { ref } from 'vue'
import { RiArrowLeftSLine, RiImageAddLine } from '@remixicon/vue'

const roomTitle = ref('')
const roomDescription = ref('')
const newTag = ref('')
const tags = ref(['TEST', 'TEST', 'TEST'])

function addTag() {
  if (newTag.value && !tags.value.includes(newTag.value)) {
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
      class="flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
    >
      <button
        class="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        @click="$router.back()"
      >
        <RiArrowLeftSLine class="h-6 w-6" />
      </button>
      <h1 class="text-lg font-semibold">创建房间</h1>
      <div class="w-8" />
      <!-- Placeholder for alignment -->
    </header>

    <!-- Main Content -->
    <main class="flex-grow overflow-y-auto p-4 md:p-6 lg:p-8">
      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Left Column: Edit Info -->
        <div class="space-y-6">
          <h2 class="text-2xl font-bold text-cyan-500">信息编辑</h2>

          <!-- Cover Image Upload -->
          <div
            class="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cyan-300 bg-cyan-50 p-8 text-center text-cyan-600 transition-colors hover:border-cyan-400 hover:bg-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-400 dark:hover:border-cyan-600 dark:hover:bg-cyan-900/30"
          >
            <RiImageAddLine class="h-12 w-12" />
            <p class="mt-2 text-lg font-semibold">请上传封面图片</p>
            <p class="text-sm">支持 JPG, PNG, WEBP, SVG等多种格式</p>
          </div>

          <!-- Title Input -->
          <input
            v-model="roomTitle"
            type="text"
            placeholder="单击此处输入标题"
            class="w-full rounded-lg border-gray-300 bg-white p-3 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700"
          />

          <!-- Description Input -->
          <textarea
            v-model="roomDescription"
            placeholder="单击此处输入简介"
            rows="5"
            class="w-full rounded-lg border-gray-300 bg-white p-3 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700"
          />

          <!-- Tags Input -->
          <div>
            <input
              v-model="newTag"
              type="text"
              placeholder="单击输入文本后按 Enter 创建标签"
              class="w-full rounded-lg border-gray-300 bg-white p-3 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700"
              @keydown.enter.prevent="addTag"
            />
            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="(tag, index) in tags"
                :key="index"
                class="flex items-center rounded-full bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
              >
                #{{ tag }}
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

        <!-- Right Column: Preview & Settings -->
        <div class="space-y-8">
          <!-- Preview Section -->
          <div>
            <h2 class="text-2xl font-bold text-cyan-500">预览</h2>
            <p class="text-gray-500 dark:text-gray-400">
              这是您的房间被其他人看到的样子
            </p>
            <div
              class="mt-4 grid grid-cols-2 gap-4 rounded-2xl bg-gray-100 p-4 dark:bg-gray-800/50"
            >
              <!-- Placeholder for preview cards -->
              <div
                v-for="i in 4"
                :key="i"
                class="h-32 rounded-lg bg-gray-300 dark:bg-gray-700"
                :class="{ 'col-span-2 h-48': i === 2 }"
              >
                <div
                  v-if="i === 2"
                  class="flex h-full items-center justify-center text-gray-500"
                >
                  房间卡片预览
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Section -->
          <div>
            <h2 class="text-2xl font-bold text-cyan-500">房间设置</h2>
            <div class="mt-4 space-y-3">
              <div
                class="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"
              >
                <span>自定义主题色</span>
                <div class="h-6 w-6 rounded-full bg-cyan-400" />
              </div>
              <div
                class="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"
              >
                <span>人数限制</span>
                <span class="text-gray-500 dark:text-gray-400"
                  >不限制 | 7人</span
                >
              </div>
              <div
                class="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"
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
            class="w-full rounded-lg bg-cyan-500 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105"
          >
            创建房间 &gt;
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
