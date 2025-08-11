<script setup lang="ts">
import { ref } from 'vue'

// 导入本地图片
import cover1 from './img/cover1.jpg'
import cover2 from './img/cover2.jpg'
import cover3 from './img/cover3.jpg'
import cover4 from './img/cover4.jpg'
import cover5 from './img/cover5.jpg'

// Task 1.1: 定义数据接口
interface RoomCard {
  id: number
  coverUrl: string
  title: string
  creator: string
  avatarUrl: string
}

// Task 1.2: 模拟不同高度的内容
const roomList = ref<RoomCard[]>([])

const titles = [
  '和朋友们一起看电影',
  '深夜放毒，美食鉴赏大会，欢迎各路吃货前来交流，学习烹饪技巧，分享美食照片！',
  '游戏开黑，就差你了！',
  '学习打卡小组，互相监督，共同进步，今天你学习了吗？',
  '一起看最新发布的科幻大片预告片',
  '萌宠照片分享，看看谁家的小可爱最萌',
  '旅行vlog分享会，这里有诗和远方，还有路上的故事',
  '经典老歌音乐会，来这里寻找你的青春回忆',
  '一个简短的标题',
  '这个标题特别长，长到需要换好几行才能显示得下，就是为了测试瀑布流的错落效果而存在的。',
  '聊聊最近看的书',
  '健身运动交流，分享你的健身日常和饮食计划',
  '数码产品爱好者聚集地',
  '晚间助眠，ASMR白噪音',
]

// 使用导入的本地图片
const imageUrls = [cover1, cover2, cover3, cover4, cover5]

for (let i = 0; i < 14; i++) {
  roomList.value.push({
    id: i,
    coverUrl: imageUrls[i % 5],
    title: titles[i],
    creator: `用户_${i + 1}`,
    avatarUrl: `https://i.pravatar.cc/40?u=b${i + 1}`,
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 pt-6 dark:bg-gray-950 sm:p-6">
    <!-- Task 2.1: 创建瀑布流容器 -->
    <div class="columns-2 gap-4 sm:gap-6 md:columns-3 lg:columns-4">
      <!-- Task 2.2 & 2.3 / Step 3: 创建带样式的卡片 -->

      <!-- 菜单卡片 -->
      <div
        class="group mb-4 transform-gpu cursor-pointer break-inside-avoid rounded-2xl border-2 border-dashed border-gray-300 p-6 transition-all hover:border-blue-400 hover:bg-gray-100 hover:shadow-xl dark:border-gray-700 dark:hover:border-blue-500 dark:hover:bg-gray-800/50 sm:mb-6"
      >
        <div class="flex flex-col items-center justify-center">
          <div
            class="text-4xl text-gray-400 transition-colors group-hover:text-blue-500"
          >
            +
          </div>
          <div
            class="mt-2 text-sm font-medium text-gray-500 transition-colors group-hover:text-blue-500 dark:text-gray-400"
          >
            创建新房间
          </div>
        </div>
      </div>

      <!-- 房间卡片 -->
      <div
        v-for="room in roomList"
        :key="room.id"
        class="group mb-4 transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 ease-in-out hover:!opacity-100 dark:bg-gray-800"
      >
        <div
          class="transition-all duration-300 ease-in-out group-hover:scale-105"
        >
          <img :src="room.coverUrl" alt="Room cover" class="w-full" />
        </div>
        <div class="p-4">
          <h3 class="font-bold text-gray-800 dark:text-gray-100">
            {{ room.title }}
          </h3>
          <div class="mt-3 flex items-center">
            <img :src="room.avatarUrl" class="mr-2 h-6 w-6 rounded-full" />
            <span class="text-sm text-gray-500 dark:text-gray-400">{{
              room.creator
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// All styles are handled by Tailwind CSS based on the V4 plan.
</style>
