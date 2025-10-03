import { imagePreloadFromUrlsService } from '@/utils/image'
import type { HomeCardType } from '@/views/home/types'

export function useCardImagePreloader() {
  const preloadImagesForCards = async (cards: HomeCardType[]) => {
    if (cards.length > 0) {
      const imageUrlsLoad = cards
        .map((card: HomeCardType) => card.coverUrl)
        .filter(Boolean) as string[]
      await imagePreloadFromUrlsService(imageUrlsLoad)
    }
  }
  return { preloadImagesForCards }
}
