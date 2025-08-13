<script setup lang="ts">
import { ref } from 'vue'

// 导入本地图片
import cover1 from './img/cover1.jpg'
import cover2 from './img/cover2.jpg'
import cover3 from './img/cover3.jpg'
import cover4 from './img/cover4.jpg'
import cover5 from './img/cover5.jpg'

// 1. 更新数据结构，添加 tags 和 isFavorited 状态
interface RoomCard {
  id: number
  coverUrl: string
  title: string
  creator: string
  avatarUrl: string
  tags: string[]
  isFavorited: boolean
}

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

// 2. 补充测试数据
const sampleTags = [
  '电影',
  '游戏',
  '学习',
  '音乐',
  '旅行',
  '动漫',
  '助眠',
  '聊天',
]
const tagTypes = ['', 'success', 'info', 'warning', 'danger']

// 使用导入的本地图片
const imageUrls = [cover1, cover2, cover3, cover4, cover5]

for (let i = 0; i < 14; i++) {
  // 随机生成几个标签
  const tags = []
  const tagsCount = Math.floor(Math.random() * 4)
  const availableTags = [...sampleTags]
  for (let j = 0; j < tagsCount; j++) {
    const randomIndex = Math.floor(Math.random() * availableTags.length)
    tags.push(availableTags.splice(randomIndex, 1)[0])
  }

  roomList.value.push({
    id: i,
    coverUrl: imageUrls[i % 5],
    title: titles[i],
    creator: `用户-${i + 1}`,
    avatarUrl: `https://i.pravatar.cc/40?u=b${i + 1}`,
    tags: tags,
    isFavorited: false, // 初始化收藏状态
  })
}

// 切换收藏状态的函数
const toggleFavorite = (room: RoomCard) => {
  room.isFavorited = !room.isFavorited
}
</script>

<template>
  <div
    v-for="room in roomList"
    :key="room.id"
    class="group relative mb-4 flow-root transform-gpu break-inside-avoid overflow-hidden rounded-2xl bg-color-background-soft shadow-lg transition-all duration-300 ease-in-out hover:!opacity-100 hover:shadow-black/20 dark:hover:shadow-black/60"
  >
    <!-- 封面 -->
    <div class="overflow-hidden">
      <img
        :src="room.coverUrl"
        alt="Room cover"
        class="h-max w-full transition-all duration-300 ease-in-out group-hover:scale-105"
      />
    </div>
    <!-- 底部 -->
    <div
      class="relative h-max w-full bg-color-background-soft p-4 group-hover:bg-gray-100 dark:group-hover:bg-neutral-800"
    >
      <h3 class="font-bold text-gray-800 dark:text-gray-100">
        {{ room.title }}
      </h3>

      <!-- 标签 -->
      <div v-if="room.tags.length" class="mt-3">
        <ElTag
          v-for="(tag, index) in room.tags"
          :key="tag"
          class="mr-2"
          round
          :type="tagTypes[index % tagTypes.length]"
          size="small"
          effect="light"
        >
          {{ tag }}
        </ElTag>
      </div>
      <!-- 用户 -->
      <div class="mt-3 flex items-center">
        <img :src="room.avatarUrl" class="mr-2 h-6 w-6 rounded-full" />
        <span class="text-sm text-gray-500 dark:text-gray-400">{{
          room.creator
        }}</span>
      </div>
    </div>

    <!-- 收藏 -->
    <i
      class="absolute bottom-4 right-4 cursor-pointer text-2xl transition-all active:scale-90"
      :class="{
        'ri-star-fill text-blue-500': room.isFavorited,
        'ri-star-line text-gray-400 hover:text-blue-500 dark:text-gray-500':
          !room.isFavorited,
      }"
      @click.stop="toggleFavorite(room)"
    ></i>
  </div>
</template>
