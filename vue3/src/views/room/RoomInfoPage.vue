<script setup lang="ts">
import { layoutRoomPageConfig, routerDict } from '@/config'
import { potoGoBack } from '@/utils'
import { useRouter } from 'vue-router'

const router = useRouter()
const roomInfoPageBack = () => {
  // router.back()
  potoGoBack({
    router,
    fallbackPath: routerDict.HomePage.path,
  })
}
</script>

<template>
  <div>
    <div class="mx-2 my-6">
      <div
        class="mx-auto"
        :style="{
          maxWidth: `${layoutRoomPageConfig.roomInfoPageContentMaxWidth}px`,
        }"
      >
        <div>
          <div>
            <ElButton @click="roomInfoPageBack"> 返回（待完善） </ElButton>
          </div>
          <div>房间详情</div>
          <div class="h-[2000px] bg-red-950"></div>
          <div>房间详情</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
