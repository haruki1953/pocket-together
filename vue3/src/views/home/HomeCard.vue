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
  '测试标题：极短',
  '测试标题：这是一个中等长度的描述，我就想看看换行表现',
  '测试标题：那很短了',
  '测试标题：这是一个为了测试而存在的三行长度的标题，目的是观察其在瀑布流布局更好的错落表现',
  '测试标题：这是一个稍微长一点的，就长了那么一点点而已',
  '测试标题：我还没那么短但还是稍微短点',
  '测试标题：这是一个精心设计的、用来占据更多垂直空间的、长度适中的测试专用描述性文字。',
  '测试标题：我很短很短很短',
  '测试标题：短',
  '测试标题：这个标题特别长，长到需要换好几行才能显示得下，就是为了测试瀑布流的错落效果而存在的，它存在的唯一目的就是尽可能地拉长这个卡片的高度',
  '测试标题：这是一个比大多数标题都要长一些的描述，我们期望它能有效测试出自适应能力',
  '测试标题：这是一个非常非常非常非常长的、专门用来撑开卡片高度的、毫无实际意义的、特别特别无聊的、不建议你读下去的、纯粹为了前端布局测试而存在的字符串，它应该会占据大量的空间。',
  '测试标题：普普通通的标题长度而已',
  '测试标题：不是最短吧',
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
  <div
    v-for="room in roomList"
    :key="room.id"
    class="group mb-4 flow-root transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft shadow-xl transition-all duration-300 ease-in-out hover:!opacity-100"
  >
    <div class="transition-all duration-300 ease-in-out group-hover:scale-105">
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
</template>

<script setup lang="ts"></script>
