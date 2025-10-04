<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ElButton } from 'element-plus'
import { useI18nStore } from '@/stores'
import { onMounted } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from '@/queries/query-keys'
import { routerDict } from '@/config'

const router = useRouter()
const route = useRoute()
const i18nStore = useI18nStore()
const queryClient = useQueryClient()

const roomId = computed(() => {
  return route.params.id
})

onMounted(() => {
  setTimeout(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.rooms() })
  }, 1000)
})

function goToRoom() {
  if (roomId.value !== '') {
    router.push({
      name: routerDict.RoomPage.name,
      params: {
        [routerDict.RoomPage.paramsKey.title]: '_',
        [routerDict.RoomPage.paramsKey.id]: roomId.value,
      },
    })
  }
}

function goToHome() {
  router.push({ name: 'HomePage' })
}
</script>

<template>
  <div
    class="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900"
  >
    <Transition name="fade-up" appear>
      <div class="text-center">
        <!-- 动画 SVG -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mx-auto mb-4 h-20 w-20 text-green-500"
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
              stroke-dasharray="60"
              stroke-dashoffset="60"
              d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="0.5s"
                values="60;0"
              />
            </path>
            <path
              stroke-dasharray="14"
              stroke-dashoffset="14"
              d="M8 12L11 15L16 10"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="0.6s"
                dur="0.2s"
                values="14;0"
              />
            </path>
          </g>
        </svg>
        <h1 class="mb-8 text-3xl font-bold text-gray-800 dark:text-gray-200">
          {{ i18nStore.t('createRoomOKTitle')() }}
        </h1>
        <div class="flex justify-center space-x-4">
          <ElButton size="large" @click="goToHome">
            {{ i18nStore.t('createRoomOKGoToHome')() }}
          </ElButton>
          <ElButton type="primary" size="large" @click="goToRoom">
            {{ i18nStore.t('createRoomOKGoToRoom')() }}
          </ElButton>
        </div>
      </div>
    </Transition>
  </div>
</template>
