export interface HomeCardType {
  id: number | string
  type: 'card' | 'menu'
  coverUrl: string
  title: string
  creator: string
  avatarUrl: string
  tags: string[]
  isFavorited: boolean
}
