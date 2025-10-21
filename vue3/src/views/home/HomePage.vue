<script setup lang="ts">
import HomeCard from './HomeCard.vue'
import HomeMenu from './HomeMenu.vue'
import LeftMenuTab from './LeftMenuTab.vue'
import LeftHomeMenu from './LeftHomeMenu.vue'
import { layoutSettingPageConfig } from '@/config'
import { useWindowSize } from '@vueuse/core'
import { useIntersectionObserver } from '@vueuse/core'
import type { HomeCardType } from './types'
// 瀑布流库
import MasonryWall from '@yeger/vue-masonry-wall'

// 导入钩子和 pocketbase 实例
import { useRoomsInfiniteQuery } from '@/queries/rooms'
import { computed, ref, onMounted, watch } from 'vue'
import type { RoomsResponse, UsersResponse } from '@/lib'
import { pb } from '@/lib'
// 导入图片预加载组合式函数
import { useCardImagePreloader } from '@/composables/Home-CardScroll'
// 导入房间查询 store
import { useRoomQueryStore } from '@/stores/room-query'
import { storeToRefs } from 'pinia'

// 初始化房间查询 store
const roomQueryStore = useRoomQueryStore()
// 从 store 中解构出定义的全局变量，并保持其响应性
const { searchTerm, onlyUserRooms, onlyFavoriteRooms } =
  storeToRefs(roomQueryStore)
// 调用勾子命名为 roomsQuery，并传入 searchTerm
const roomsQuery = useRoomsInfiniteQuery({
  searchTerm,
  onlyUserRooms,
  onlyFavoriteRooms,
})

// 预加载函数
const { preloadImagesForCards } = useCardImagePreloader()
// 已预加载图片的卡片数据
const preloadedRoomCards = ref<HomeCardType[]>([])

// 用来存储当前用户的 ID
const userId = pb.authStore.record?.id

// 监听从服务器获取的数据变化
watch(
  () => roomsQuery.data.value,
  async (newData) => {
    // 如果没有数据，则清空卡片列表
    if (!newData) {
      preloadedRoomCards.value = []
      return
    }

    // 扁平化和映射数据
    const roomCards = newData.pages.flatMap((page) =>
      // 遍历每一页中的 'items' ，为 room 加上类型判断
      page.items.map(
        // (room: RoomsResponse & { expand: { author: UsersResponse } }) => {
        // 舍弃手动拼接，使用范型传参（规避类型报错）
        (room: RoomsResponse<unknown, { author: UsersResponse }>) => {
          // 把复杂的前缀封装进 author
          const author = room.expand?.author
          return {
            id: room.id,
            type: 'card',
            // 使用最严格、最显式的检查，避免 lint 错误
            coverUrl:
              room.cover != null && room.cover !== ''
                ? pb.files.getURL(room, room.cover)
                : '',
            title: room.title,
            // 在 HomePage 的 map 回调中，room参数的类型可能被推断为没有 expand 的通用信息的类型
            // 需要重新显式提供类型
            creator:
              typeof author?.name === 'string' && author.name !== ''
                ? author.name
                : '未知用户',
            creatorId: author?.id ?? '',
            // 对 avatar 也使用最严格的检查
            avatarUrl:
              author != null && author.avatar != null && author.avatar !== ''
                ? pb.files.getURL(author, author.avatar)
                : '',
            // tags 字段，直接提供一个空数组
            tags: Array.isArray(room.tags) ? room.tags : [],
            // 我的 userId 存在吗
            join:
              // Boolean(userId) && room.favorites?.includes(userId ?? ''),
              Boolean(
                userId !== null &&
                  room.join !== null &&
                  room.join.includes(userId ?? '')
              ),
          } satisfies HomeCardType
          // isFavorited: false,
        }
      )
    )

    // 异步预加载卡片封面图片
    await preloadImagesForCards(roomCards)

    // 视图更新
    preloadedRoomCards.value = roomCards
  },
  { deep: true, immediate: true }
)

// 处理和转换数据
const DisplayCards = computed<HomeCardType[]>(() => {
  // 列表的最前面
  const menuCard: HomeCardType = {
    id: 'menu-card',
    type: 'menu',
    title: '',
    coverUrl: '',
    creator: '',
    creatorId: '',
    avatarUrl: '',
    tags: [],
    join: false,
  }

  // 如果 roomsQuery.data.value 不存在
  if (!roomsQuery.data.value) {
    return [menuCard]
  }

  // 将菜单卡片和已预加载图片的房间卡片组合在一起
  return [menuCard, ...preloadedRoomCards.value]
})

// 滚动触发器
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

// 删除函数
const handleDeleteRoom = async (room: HomeCardType) => {
  // if (!confirm('确定要删除这个房间吗？此操作不可撤销。')) {
  //   return
  // }
  try {
    await ElMessageBox.confirm('确定要删除吗？', '要删除吗', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    pb.collection('rooms').delete(String(room.id))
    // 视觉上直接移除就好
    preloadedRoomCards.value = preloadedRoomCards.value.filter(
      // 把 id 不等于被删除房间的卡片放进数组里
      (card) => card.id !== room.id
    )
  } catch {
    // alert('删除房间时出错，请稍后再试。')
  }
}

// 切换收藏状态的函数
const toggleJoin = async (room: HomeCardType) => {
  // 这个定义 回归上层了 去前面找
  // const userId = pb.authStore.record?.id
  if (userId == null) {
    // console.error('您还没有登陆喵')
    return
  }
  try {
    // room.isFavorited = !room.isFavorited
    //  使用中间值来存储 room.isFavorited 的当前值，为了更方便的读取世纪值（可读性这一块）
    const newJoinDesu = !room.join
    room.join = newJoinDesu
    // 加入
    if (newJoinDesu) {
      await pb.collection('rooms').update(String(room.id), { 'join+': userId })
      ElMessage({
        message: '已加入群组',
        type: 'success',
        duration: 1500,
      })
    }
    // 退掉
    else {
      await pb.collection('rooms').update(String(room.id), { 'join-': userId })
      ElMessage({
        message: '已退出群组',
        type: 'success',
        duration: 1500,
      })
    }
  } catch {
    // 切换收藏状态时出错，回退收藏展示
    room.join = !room.join
  }
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
// 清除倒计时
let autoHideMenuTimer: number | null = null

// 左侧按钮
useIntersectionObserver(isHomeMenu, ([{ isIntersecting }]) => {
  if (autoHideMenuTimer !== null) {
    clearTimeout(autoHideMenuTimer)
    autoHideMenuTimer = null
  }
  menuKieru.value = !isIntersecting
  // 2秒后隐藏它
  autoHideMenuTimer = setTimeout(() => {
    menuKieru.value = false
    autoHideMenuTimer = null
  }, 2000)
})

// 鼠标移入，如果存在消失计时就清除 inretimer
function inL() {
  if (autoHideMenuTimer !== null) {
    clearTimeout(autoHideMenuTimer)
    autoHideMenuTimer = null
  }

  menuKieru.value = true
}

// 鼠标离开，开始计时，把清除 timeout 命名为 inretimer
function inR() {
  autoHideMenuTimer = setTimeout(() => {
    menuKieru.value = false
    autoHideMenuTimer = null
  }, 2000)
}

// 入场
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
      <template #default="{ item, index }">
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
          :style="{ transitionDelay: `${index * 50}ms` }"
          :home="item"
          @toggleJoin="toggleJoin"
          @deleteRoom="handleDeleteRoom"
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
      <template #default="{ item, index }">
        <!-- 房间卡片 -->
        <HomeCard
          class="transition-all duration-500 ease-in-out"
          :class="
            isReady ? 'translate-y-0 opacity-100' : 'translate-y-96 opacity-0'
          "
          :style="{ transitionDelay: `${index * 50}ms` }"
          :home="item"
          @toggleJoin="toggleJoin"
        />
      </template>
    </MasonryWall>
    <!-- 触发器 -->
    <div ref="loadMoreCards"></div>
  </div>
</template>

<!-- <style scoped lang="scss"></style> -->
