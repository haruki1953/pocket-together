<script setup lang="ts">
import HomeCard from './HomeCard.vue'
import HomeMenu from './HomeMenu.vue'
import LeftMenuTab from './LeftMenuTab.vue'
import LeftHomeMenu from './LeftHomeMenu.vue'
import { layoutSettingPageConfig } from '@/config'
import { useWindowSize } from '@vueuse/core'
import { useIntersectionObserver } from '@vueuse/core'
import type { HomeCardType } from './types'
// 瀑布流
import MasonryWall from '@yeger/vue-masonry-wall'

// 实现无限滚动的 hooks
import { useHomeScroll } from '@/composables/Home-CardScroll'

// 全部卡片
const AllCard = ref<HomeCardType[]>([])

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
  '测试标题：这是一个比大多数标题都要长一些的描述，我们期望它能有效测试出自适应能力',
  '测试标题：普普通通的标题长度而已',
  '测试标题：不是最短吧',
]

// 2. 补充测试数据
const sampleTags = [
  'tagMovie',
  'tagGame',
  'tagStudy',
  'tagMusic',
  'tagTravel',
  'tagAnime',
  'tagASMR',
  'tagChat',
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

// 把分配好的 AllCard 发给解析函数
const { DisplayCards, loadMoreCards } = useHomeScroll(AllCard)

// 切换收藏状态的函数
const toggleFavorite = (room: HomeCardType) => {
  room.isFavorited = !room.isFavorited
}

// 左侧菜单的开关
const isLeftMenuOpen = ref(false)
function onLeftMenuDisplay() {
  isLeftMenuOpen.value = !isLeftMenuOpen.value
}

// 检测进入页面
const isReady = ref(false)
// 检测 Menu 离开页面
const menuKieru = ref(false)
// 抽屉按钮
const isDrawerOpen = ref(false)
// 我现在看到你了！
const isHomeMenu = ref(null)
let menuKieruTimer: number | null = null

// 左侧按钮
useIntersectionObserver(isHomeMenu, ([{ isIntersecting }]) => {
  if (menuKieruTimer !== null) {
    clearTimeout(menuKieruTimer)
  }
  menuKieru.value = !isIntersecting
  // 2秒后隐藏它
  menuKieruTimer = setTimeout(() => {
    menuKieru.value = false
  }, 2000)
})

function inL() {
  menuKieru.value = true
}

function inR() {
  setTimeout(() => {
    menuKieru.value = false
  }, 2000)
}

onMounted(() => {
  setTimeout(() => {
    isReady.value = true
  }, 50)
})

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

// 为小屏幕过滤掉 menu-card
const smallScreenCards = computed(() => {
  return DisplayCards.value.filter((card) => card.type !== 'menu')
})
</script>

<template>
  <div v-if="showContentTrueCol2FalseCol1" class="min-h-screen p-4 pt-6 sm:p-6">
    <!-- 左侧 -->
    <div
      class="fixed left-0 top-0 z-50 flex h-screen w-6 items-center"
      @mouseover="inL"
      @mouseleave="inR"
    >
      <div
        class="absolute left-6 flex h-16 w-20 items-center justify-center rounded-r-full pl-4"
      >
        <Transition
          enterActiveClass="transition-all duration-500 ease-out"
          enterFromClass="-translate-x-full opacity-0"
          enterToClass="translate-x-0 opacity-100"
          leaveActiveClass="transition-all duration-200 ease-in"
          leaveFromClass="translate-x-0 opacity-100"
          leaveToClass="-translate-x-full opacity-0"
        >
          <LeftMenuTab
            v-show="menuKieru"
            :isDrawerOpen
            class="z-50 transition-all duration-500 ease-in-out"
            :class="{ 'translate-x-[320px]': isLeftMenuOpen }"
            :isMenuOpen="isLeftMenuOpen"
            @on-left-menu-display="onLeftMenuDisplay"
          ></LeftMenuTab>
        </Transition>
        <Transition
          enterActiveClass="transition-all duration-500 ease-out"
          enterFromClass="-translate-x-full opacity-0"
          enterToClass="translate-x-0 opacity-100"
          leaveActiveClass="transition-all duration-200 ease-in"
          leaveFromClass="translate-x-0 opacity-100"
          leaveToClass="-translate-x-full opacity-0"
        >
          <LeftHomeMenu v-if="isLeftMenuOpen"></LeftHomeMenu>
        </Transition>
      </div>
    </div>
    <!-- 瀑布流容器 -->
    <MasonryWall
      :items="DisplayCards"
      :columnWidth="300"
      :gap="16"
      :keyMapper="(item) => item.id"
    >
      <template #default="{ item }">
        <!-- 菜单卡片 -->
        <HomeMenu
          v-if="item.type === 'menu'"
          ref="isHomeMenu"
          :key="item.id"
          class="transition-all duration-700 ease-in-out"
          :class="isReady ? 'opacity-100' : 'opacity-0'"
        ></HomeMenu>
        <!-- 房间卡片 -->
        <HomeCard
          v-else
          class="transition-all duration-500 ease-in-out"
          :class="
            isReady ? 'translate-y-0 opacity-100' : 'translate-y-96 opacity-0'
          "
          :home="item"
          @toggleFavorite="toggleFavorite"
        />
      </template>
    </MasonryWall>
    <!-- 触发器 -->
    <div ref="loadMoreCards"></div>
  </div>

  <div v-else class="min-h-screen p-2">
    <div>
      <HomeMenu></HomeMenu>
    </div>
    <!-- 瀑布流容器 -->
    <MasonryWall
      class="mt-2"
      :items="smallScreenCards"
      :columnWidth="190"
      :gap="6"
      :keyMapper="(item) => item.id"
    >
      <template #default="{ item }">
        <!-- 房间卡片 -->
        <HomeCard
          :class="
            isReady ? 'translate-y-0 opacity-100' : 'translate-y-96 opacity-0'
          "
          :home="item"
          @toggleFavorite="toggleFavorite"
        />
      </template>
    </MasonryWall>
    <!-- 触发器 -->
    <div ref="loadMoreCards"></div>
  </div>
</template>

<style scoped lang="scss"></style>
