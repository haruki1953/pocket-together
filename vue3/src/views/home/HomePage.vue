<script setup lang="ts">
// ---
// 位于: /Users/kippu/KIPPU-Code/GitHub/pocket-together/vue3/src/views/home/HomePage.vue

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

// 导入我们创建的查询钩子和 pocketbase 实例
import { useRoomsInfiniteQuery } from '@/queries/rooms'
import { pb } from '@/lib'
import { computed, ref, onMounted } from 'vue'

// 1. 调用无限查询钩子
const roomsQuery = useRoomsInfiniteQuery()

// 2. 使用 computed 属性来处理和转换数据
const DisplayCards = computed<HomeCardType[]>(() => {
  // 菜单卡片，我们手动将它放在列表的最前面
  const menuCard: HomeCardType = {
    id: 'menu-card',
    type: 'menu',
    title: '',
    coverUrl: '',
    creator: '',
    avatarUrl: '',
    tags: [],
    isFavorited: false,
  }

  // 如果 roomsQuery.data.value 不存在 (比如还在加载中)，则只返回菜单卡片
  if (!roomsQuery.data.value) {
    return [menuCard]
  }

  // 3. 扁平化和映射数据
  const roomCards = roomsQuery.data.value.pages.flatMap((page) =>
    // 遍历每一页中的 'items' (即房间记录)
    page.items.map((room) => {
      return {
        id: room.id,
        type: 'card',
        // 修正: 使用最严格、最显式的检查，避免任何lint错误
        coverUrl:
          room.cover != null && room.cover !== ''
            ? pb.files.getURL(room, room.cover)
            : '',
        title: room.title,
        // 修正: 对 any 类型使用 typeof 进行显式检查
        creator:
          typeof room.expand?.author?.name === 'string' &&
          room.expand.author.name !== ''
            ? room.expand.author.name
            : '未知用户',
        // 修正: 对 avatar 也使用最严格的检查
        avatarUrl:
          room.expand?.author?.avatar != null &&
          room.expand.author.avatar !== ''
            ? pb.files.getURL(room.expand.author, room.expand.author.avatar)
            : '',
        // 修正: rooms 集合中没有 tags 字段，因此直接提供一个空数组
        tags: [],
        isFavorited: false,
      } satisfies HomeCardType
    })
  )

  // 将菜单卡片和从服务器获取的房间卡片组合在一起返回
  return [menuCard, ...roomCards]
})

// 4. 实现无限滚动
// 保留你原有的变量名 loadMoreCards，并用它作为触发器
const loadMoreCards = ref<HTMLElement | null>(null)

// 使用 useIntersectionObserver 来观察这个 div 元素是否进入了视口。
useIntersectionObserver(loadMoreCards, ([{ isIntersecting }]) => {
  if (
    isIntersecting &&
    roomsQuery.hasNextPage.value &&
    !roomsQuery.isFetchingNextPage.value
  ) {
    roomsQuery.fetchNextPage()
  }
})

// 切换收藏状态的函数 (这个保持不变)
const toggleFavorite = (room: HomeCardType) => {
  room.isFavorited = !room.isFavorited
}

// --- 以下是原有的UI交互逻辑，保持不变 ---

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
