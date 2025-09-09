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

// TODO: 接入 PocketBase 获取房间数据
// const rooms = await pb.collection('rooms').getFullList();
// AllCard.value.push(...rooms.map(room => ({
//   id: room.id,
//   type: 'card',
//   coverUrl: room.coverUrl,
//   title: room.title,
//   creator: room.creator,
//   avatarUrl: room.avatarUrl,
//   tags: room.tags,
//   isFavorited: room.isFavorited,
// })));

// 把分配好的 AllCard 发给解析函数
const { DisplayCards, loadMoreCards } = useHomeScroll(AllCard)

// 切换收藏状态的函数
const toggleFavorite = (room: HomeCardType) => {
  room.isFavorited = !room.isFavorited
}

// 左侧菜单的开关
const isLeftMenuOpen = ref<boolean>(false)
function onLeftMenuDisplay() {
  isLeftMenuOpen.value = !isLeftMenuOpen.value
}

// 检测进入页面
const isReady = ref<boolean>(false)
// 检测 Menu 离开页面
const menuKieru = ref<boolean>(false)
// 抽屉按钮
const isDrawerOpen = ref<boolean>(false)
// 我现在看到你了！
const isHomeMenu = ref<HTMLElement | null>(null)
let menuKieruTimer: number | null = null
let inRTimer: number | null = null

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
  // 如果 inR 的计时器正在运行，则清除它
  if (inRTimer !== null) {
    clearTimeout(inRTimer)
    inRTimer = null
  }

  menuKieru.value = true
}

function inR() {
  inRTimer = setTimeout(() => {
    menuKieru.value = false
    inRTimer = null // 计时器执行完毕后，将 ID 设为 null
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
            v-show="menuKieru || isLeftMenuOpen"
            :isDrawerOpen
            class="z-50 transition-all duration-500 ease-in-out"
            :class="{ 'translate-x-[340px]': isLeftMenuOpen }"
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
