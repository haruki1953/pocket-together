import { ref, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { imagePreloadFromUrlsService } from '@/utils/image'
import type { HomeCardType } from '@/views/home/types'

export function useHomeScroll(AllCard: Ref<HomeCardType[]>) {
  const DisplayCards = ref<HomeCardType[]>([])
  // 每次显示数量
  const PAGE_SIZE = 9
  // 绑定哨兵
  const loadMoreCards = ref<HTMLElement | null>(null)
  // 加载锁，为了在 DOM 出现前加载出图片
  const cardImgLoading = ref(false)

  // 必须先定义 stop，才能在 loadMore 中使用
  // eslint-disable-next-line prefer-const
  let stop: () => void

  // 加载更多卡片，异步
  const loadMore = async () => {
    // 在加载图片，就不执行 DOM 加载操作
    if (cardImgLoading.value) return
    // 检查是否还有更多卡片可以加载
    if (DisplayCards.value.length >= AllCard.value.length) {
      stop()
      return
    }
    // 满足以上条件，加载中，上锁
    cardImgLoading.value = true
    // 头索引
    const statCards = DisplayCards.value.length
    // 尾索引
    const endCards = statCards + PAGE_SIZE
    // 添加新卡片(根据头尾索引)
    const nextCards = AllCard.value.slice(statCards, endCards)
    if (nextCards.length > 0) {
      const imageUrlsLoad = nextCards
        .map((carddesu: HomeCardType) => carddesu.coverUrl)
        .filter(Boolean)
      await imagePreloadFromUrlsService(imageUrlsLoad)
    }
    // DisplayCards.value.push(...nextCards)
    // 数组覆盖
    DisplayCards.value = [...DisplayCards.value, ...nextCards]
    cardImgLoading.value = false
  }

  // 调用 useIntersectionObserver
  const observerResult = useIntersectionObserver(
    loadMoreCards,
    // 监视 DOM 进入屏幕回调
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        loadMore()
      }
    }
  )
  // 将 useIntersectionObserver 返回的 stop 函数赋值给之前声明的变量
  stop = observerResult.stop

  onMounted(() => {
    // 首组卡片也用 loadMore 来加载，以应用 Image Preloading
    loadMore()
  })

  return {
    DisplayCards,
    loadMoreCards,
    cardImgLoading,
  }
}
