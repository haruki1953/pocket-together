export interface HomeCardType {
  id: number | string
  type: 'card' | 'menu'
  coverUrl: string
  title: string
  creator: string
  creatorId: string
  avatarUrl: string
  tags: string[]
  isFavorited: boolean
}
