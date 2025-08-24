<script setup lang="ts">
import HomeCard from './HomeCard.vue'
import HomeMenu from './HomeMenu.vue'
import { layoutSettingPageConfig } from '@/config'
// 监视 DOM，检测尺寸
import { useWindowSize, useIntersectionObserver } from '@vueuse/core'
import type { HomeCardType } from './types'
// 瀑布流
import MasonryWall from '@yeger/vue-masonry-wall'

// 全部卡片
const AllCard = ref<HomeCardType[]>([])
const DisplayCards = ref<HomeCardType[]>([])
// 每次显示数量
const PAGE_SIZE = 8
// 绑定哨兵
const loadMoreCards = ref(null)
const loadMore = () => {
  // 检查是否还有更多卡片可以加载
  if (DisplayCards.value.length >= AllCard.value.length) {
    stop()
    return
  }
  // 头索引
  const statCards = DisplayCards.value.length
  // 尾索引
  const endCards = statCards + PAGE_SIZE
  // 添加新卡片(根据头尾索引)
  const nextCards = AllCard.value.slice(statCards, endCards)
  // DisplayCards.value.push(...nextCards)
  // 数组覆盖
  DisplayCards.value = [...DisplayCards.value, ...nextCards]
}

// 调用 useIntersectionObserver
const { stop } = useIntersectionObserver(
  loadMoreCards,
  // 监视 DOM 进入屏幕回调
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      loadMore()
    }
  }
)

onMounted(() => {
  // DisplayCards.value = AllCard.value.slice(0, PAGE_SIZE)
  loadMore()
})

// 导入本地图片
import cover1 from './img/cover1.jpg'
import cover2 from './img/cover2.jpg'
import cover3 from './img/cover3.jpg'
import cover4 from './img/cover4.jpg'
import cover5 from './img/cover5.jpg'
import cover6 from './img/blood.png'

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

// 使用导入的本地图片
const imageUrls = [cover1, cover2, cover3, cover4, cover5, cover6]

// 先添加菜单卡片
AllCard.value.push({
  id: 'menu-card',
  type: 'menu',
  title: '',
  coverUrl: '',
  creator: '',
  avatarUrl: '',
  tags: [],
  isFavorited: false,
})

for (let i = 0; i < 40; i++) {
  // 随机生成几个标签
  const tags = []
  const tagsCount = Math.floor(Math.random() * 4)
  const availableTags = [...sampleTags]
  for (let j = 0; j < tagsCount; j++) {
    const randomIndex = Math.floor(Math.random() * availableTags.length)
    tags.push(availableTags.splice(randomIndex, 1)[0])
  }

  // 随机选择一个标题
  const randomTitleIndex = Math.floor(Math.random() * titles.length)

  AllCard.value.push({
    id: i,
    type: 'card',
    coverUrl: imageUrls[i % 6],
    title: titles[randomTitleIndex],
    creator: `用户-${i + 1}`,
    avatarUrl: `https://i.pravatar.cc/40?u=b${i + 1}`,
    tags: tags,
    isFavorited: false, // 初始化收藏状态
  })
}

// 切换收藏状态的函数
const toggleFavorite = (room: HomeCardType) => {
  room.isFavorited = !room.isFavorited
}

// 以下是响应式布局相关
const { width: windowWidth } = useWindowSize()

const showContentTrueCol2FalseCol1 = computed(() => {
  if (
    windowWidth.value >= layoutSettingPageConfig.breakpointContentCol2ToCol1
  ) {
    return true
  }
  return false
})
</script>

<template>
  <div v-if="showContentTrueCol2FalseCol1" class="min-h-screen p-4 pt-6 sm:p-6">
    <!-- 瀑布流容器 -->
    <MasonryWall
      :items="DisplayCards"
      :columnWidth="300"
      :gap="16"
      :keyMapper="(item) => item.id"
    >
      <template #default="{ item }">
        <!-- 菜单卡片 -->
        <HomeMenu v-if="item.type === 'menu'"></HomeMenu>
        <!-- 房间卡片 -->
        <HomeCard v-else :home="item" @toggleFavorite="toggleFavorite" />
      </template>
    </MasonryWall>
    <!-- 触发器 -->
    <div ref="loadMoreCards"></div>
  </div>

  <div v-else class="min-h-screen p-4 pt-6 sm:p-6">
    <div>
      <HomeMenu></HomeMenu>
    </div>
    <!-- 瀑布流容器 -->
    <div class="columns-2 gap-4 sm:gap-6 md:columns-3 lg:columns-4">
      <!-- 房间卡片 -->
      <HomeCard
        v-for="card in DisplayCards"
        :key="card.id"
        :home="card"
        @toggleFavorite="toggleFavorite"
      />
      <div ref="loadMoreCards"></div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
