import type { PMLRCApiParameters0DataPageParamNonNullable } from '@/api'

export const queryKeys = {
  profile: (id: string) => ['profile', id] as const,
  listAuthMethods: () => ['listAuthMethods'] as const,
  pbCollectionConfig: () => ['pbCollectionConfig'] as const,
  /** useChatRoomMessagesInfiniteQuery */
  chatRoomMessagesInfinite: (roomId: string | null) =>
    ['chatRoomMessagesInfinite', roomId] as const,
  /** useChatRoomMessagesInfiniteTwowayQuery */
  chatRoomMessagesInfiniteTwoway: (
    roomId: string | null,
    twowayPositioningCursorData: PMLRCApiParameters0DataPageParamNonNullable | null
  ) =>
    [
      'chatRoomMessagesInfiniteTwoway',
      roomId,
      twowayPositioningCursorData,
    ] as const,

  /** useChatRoomMessagesGetOneQuery */
  chatRoomMessagesGetOne: (messageId?: string | null) =>
    ['chatRoomMessagesGetOne', messageId] as const,
  /**  */
  rooms: (...args: string[]) => ['rooms', ...args] as const,
  /** useRoomsGetOneQuery */
  roomsGetOne: (roomId: string | null) => ['roomsGetOne', roomId],
}
