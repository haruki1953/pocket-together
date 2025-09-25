<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RiArrowLeftSLine } from '@remixicon/vue'
import { useI18nStore } from '@/stores'
import { useRouter } from 'vue-router'
import { pb } from '@/lib'
// 封装的状态管理
import { useAuthStore } from '@/stores'
// 文件上传限制
import { fileRoomImageConfig } from '@/config'
import { hideLoadingMask, showLoadingMask } from '@/utils'

const i18nStore = useI18nStore()

// 路由和状态
const router = useRouter()
const authStore = useAuthStore()

// 用户输入数据的存储位置
const roomImageUrl = ref<string | null>(null)
const roomImage = ref<File | null>(null)
const roomTitle = ref('')
const roomDescription = ref('')
const roomTag = ref('')
const tags = ref(['TEST', 'TEST', 'TEST'])
const tagNotNew = ref<boolean>(false)

// 检测进入页面
const isReady = ref(false)

onMounted(() => {
  setTimeout(() => {
    isReady.value = true
  }, 50)
})

// tag
function addTag() {
  const newTag = roomTag.value.trim()
  if (newTag === '' || tags.value.includes(newTag)) return
  if (!tagNotNew.value) {
    tagNotNew.value = true
    tags.value = [newTag]
    roomTag.value = ''
  } else {
    tags.value.push(newTag)
    roomTag.value = ''
  }
}

function removeTag(index: number) {
  tags.value.splice(index, 1)
}

const imgInput = ref<HTMLInputElement | null>(null)

// 处理图片上传
async function onImgFile(event: Event) {
  const imgInputDesu = event.target as HTMLInputElement
  // 没文件就出来
  if (imgInputDesu.files == null || imgInputDesu.files.length === 0) return
  // 拿到第一个文件
  const file = imgInputDesu.files[0]
  // 验证大小
  if (file.size > fileRoomImageConfig.roomImageBlobFileMaxSize) {
    ElMessage.error(i18nStore.t('createRoomError_fileTooLarge')())
    imgInputDesu.value = ''
    return
  }
  // 送给 pocketbase 的
  roomImage.value = file
  // 害怕内存泄露
  if (roomImageUrl.value != null) {
    URL.revokeObjectURL(roomImageUrl.value)
  }
  // 拿来预览的
  roomImageUrl.value = URL.createObjectURL(file)
}

// 检查必要信息生成 newroom
async function createRoom() {
  if (authStore.record == null) {
    ElMessage.error(i18nStore.t('createRoomError_notLoggedIn')())
    return
  }
  if (roomImageUrl.value == null) {
    ElMessage.error(i18nStore.t('createRoomError_noCover')())
    return
  }
  if (roomTitle.value.trim() == null) {
    ElMessage.error(i18nStore.t('createRoomError_noTitle')())
    return
  }

  try {
    const roomData = {
      cover: roomImage.value,
      title: roomTitle.value,
      description: roomDescription.value,
      tags: tags.value,
      author: authStore.record.id,
    }
    // 加载
    showLoadingMask()
    const newRoom = await pb.collection('rooms').create(roomData)
    // 结束
    hideLoadingMask()
    router.push({ name: 'CreateRoomOK', params: { id: newRoom.id } })
  } catch {
    // 失败也结束动画
    hideLoadingMask()
    ElMessage.error(i18nStore.t('createRoomError_creationFailed')())
  }
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Header -->
    <header
      class="flex h-14 flex-shrink-0 items-center justify-between bg-blue-100 px-4 py-3 dark:bg-[#222222]"
    >
      <!-- back 键 -->
      <button
        class="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        @click="$router.back()"
      >
        <RiArrowLeftSLine class="h-6 w-6" />
      </button>
      <h1 class="text-lg font-semibold">
        {{ i18nStore.t('createRoomTitle')() }}
      </h1>
      <div class="w-8" />
    </header>

    <!-- 主要内容 -->
    <main class="flex-grow overflow-y-auto p-4 md:p-6 lg:p-4">
      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
        <div class="space-y-5">
          <div>
            <h2 class="text-2xl font-bold text-cyan-600 dark:text-gray-300">
              {{ i18nStore.t('createRoomEditInfo')() }}
            </h2>
            <p class="text-gray-500 dark:text-gray-400">
              {{ i18nStore.t('createRoomEditInfoDesc')() }}
            </p>
          </div>

          <!-- 上传封面 -->
          <input
            ref="imgInput"
            type="file"
            hidden
            accept="image/*"
            @change="onImgFile"
          />
          <!-- 装饰框 -->
          <div
            class="h-[240px] cursor-pointer rounded-2xl border-2 border-dashed border-cyan-300 bg-cyan-50 p-1 text-center text-cyan-600 transition-all duration-700 ease-in-out hover:border-cyan-800 hover:bg-cyan-100 dark:bg-gray-800/20 dark:text-cyan-400 dark:hover:border-cyan-600 dark:hover:bg-cyan-900/30"
            :class="isReady ? 'opacity-100' : 'opacity-0'"
            @click="imgInput?.click()"
          >
            <!-- 图片上传提示 -->
            <div
              v-if="roomImageUrl == null"
              class="flex h-full w-full flex-col items-center justify-center rounded-xl"
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
              <p class="mt-2 text-lg font-semibold">
                {{ i18nStore.t('createRoomUploadCover')() }}
              </p>
              <p class="text-sm">
                {{ i18nStore.t('createRoomUploadCoverDesc')() }}
              </p>
            </div>
            <!-- 预览图 -->
            <div
              v-else
              class="h-full w-full items-center justify-center overflow-hidden rounded-xl bg-gray-200"
            >
              <img
                :src="roomImageUrl"
                alt="封面预览"
                class="h-full w-full object-cover"
              />
            </div>
          </div>

          <!-- 编辑标题 -->
          <input
            v-model="roomTitle"
            maxlength="60"
            type="text"
            :placeholder="i18nStore.t('createRoomPlaceholderTitle')()"
            class="w-full rounded-lg border-gray-300 bg-gray-100 p-3 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700"
          />

          <!-- 编辑简介 -->
          <textarea
            v-model="roomDescription"
            :placeholder="i18nStore.t('createRoomPlaceholderDesc')()"
            rows="5"
            class="w-full resize-none rounded-lg border-gray-300 bg-gray-100 p-3 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700"
          />

          <!-- 编辑 Tag -->
          <div>
            <input
              v-model="roomTag"
              type="text"
              :placeholder="i18nStore.t('createRoomPlaceholderTags')()"
              class="w-full rounded-lg border-gray-300 bg-gray-100 p-3 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700"
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
            <h2 class="text-2xl font-bold text-cyan-600 dark:text-gray-300">
              {{ i18nStore.t('createRoomPreview')() }}
            </h2>
            <p class="text-gray-500 dark:text-gray-400">
              {{ i18nStore.t('createRoomEditInfoDesc')() }}
            </p>
            <!-- 视觉上的区域限制容器 -->
            <div
              class="relative mt-4 h-[280px] w-full overflow-hidden lg:h-[314px]"
            >
              <!-- 上阴影遮罩 -->
              <div
                class="absolute top-0 z-50 h-6 w-full bg-gradient-to-b from-white via-white/30 to-white/0 dark:from-[#181818] dark:via-[#181818]/30 dark:to-[#181818]/0"
              ></div>
              <!-- 下阴影遮罩 -->
              <div
                class="absolute bottom-0 z-50 h-6 w-full bg-gradient-to-t from-white via-white/30 to-white/0 dark:from-[#181818] dark:via-[#181818]/30 dark:to-[#181818]/0"
              ></div>
              <!-- 实际上的预览卡片 rendering 区域 -->
              <div
                class="absolute -top-[60px] left-0 z-40 h-[460px] w-full columns-3 px-0 transition-all duration-700 ease-in-out lg:-top-[105px] lg:h-[588px] lg:px-4"
                :class="isReady ? 'pt-4 opacity-100' : 'pt-20 opacity-0'"
              >
                <div
                  class="group relative mb-3 flow-root h-44 break-inside-avoid rounded-2xl bg-color-background-soft shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60 lg:h-60"
                ></div>
                <div
                  class="group relative mb-3 flow-root h-44 break-inside-avoid rounded-2xl bg-color-background-soft shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60 lg:h-60"
                ></div>
                <div
                  class="group relative mb-3 flow-root h-20 w-full break-inside-avoid rounded-2xl bg-color-background-soft shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60 lg:h-28"
                ></div>
                <!-- 预览卡片 -->
                <div
                  class="group/card relative mb-3 flow-root break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60"
                >
                  <div class="max-h-[160px] min-h-[50px] overflow-hidden">
                    <img
                      :src="roomImageUrl"
                      alt="Room cover"
                      class="h-full w-full object-cover transition-all duration-300 ease-in-out group-hover/card:scale-105"
                    />
                  </div>
                  <!-- 底部 -->
                  <div
                    class="relative h-max w-full bg-color-background-soft p-2 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] group-hover/card:bg-gray-100 dark:group-hover/card:bg-neutral-800"
                  >
                    <h3
                      class="line-clamp-3 font-bold text-gray-800 dark:text-gray-100"
                    >
                      {{ roomTitle }}
                    </h3>

                    <!-- 用户 -->
                    <div class="mt-2 flex items-center">
                      <span class="text-sm text-gray-500 dark:text-gray-400">
                        用户
                      </span>
                    </div>
                    <!-- 标签 -->
                    <div v-if="tags.length" class="mt-1">
                      <ElTag
                        v-for="(tag, index) in tags"
                        :key="tag"
                        class="mr-2"
                        round
                        size="small"
                        effect="light"
                      >
                        {{ tags[index] }}
                      </ElTag>
                    </div>
                  </div>
                </div>
                <div
                  class="group relative mb-3 flow-root h-20 break-inside-avoid rounded-2xl bg-color-background-soft shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60 lg:h-28"
                ></div>
                <div
                  class="group relative mb-3 flow-root h-44 break-inside-avoid rounded-2xl bg-color-background-soft shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60 lg:h-60"
                ></div>
                <div
                  class="group relative mb-3 flow-root h-44 break-inside-avoid rounded-2xl bg-color-background-soft shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60 lg:h-60"
                ></div>
              </div>
            </div>
          </div>

          <!-- 属性设置 -->
          <div>
            <h2
              class="mt-4 text-2xl font-bold text-cyan-600 dark:text-gray-300"
            >
              {{ i18nStore.t('createRoomRoomSettings')() }}
            </h2>
            <div class="mt-4">
              <div
                class="mt-4 flex items-center justify-between rounded-lg bg-blue-100 p-4 shadow-sm dark:bg-gray-800"
              >
                <span>{{ i18nStore.t('createRoomLimitUsers')() }}</span>
                <span class="text-gray-500 dark:text-gray-400">{{
                  i18nStore.t('createRoomUserLimitStatus')(7)
                }}</span>
              </div>
              <div
                class="mt-4 flex items-center justify-between rounded-lg bg-blue-100 p-4 shadow-sm dark:bg-gray-800"
              >
                <span>{{ i18nStore.t('createRoomLimitPassword')() }}</span>
                <span class="text-gray-500 dark:text-gray-400">{{
                  i18nStore.t('createRoomPasswordStatus')(
                    i18nStore.t('passwordStatusSet')()
                  )
                }}</span>
              </div>
            </div>
          </div>

          <!-- Button -->
          <ElButton
            type="primary"
            round
            style="
              height: 60px;
              width: 100%;
              border-radius: 12px;
              font-size: 18px;
            "
            class="mt-6 py-4 text-white shadow-lg"
            @click="createRoom"
          >
            {{ i18nStore.t('createRoomSubmitButton')() }}
          </ElButton>
        </div>
      </div>
    </main>
  </div>
</template>
