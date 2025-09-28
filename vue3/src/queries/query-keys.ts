import type { PMLRCApiParameters0DataPageParamNonNullable } from '@/api'

export const queryKeys = {
  /** useProfileQuery */
  profile: (id: string) => ['profile', id] as const,
  /** useListAuthMethodsQuery */
  listAuthMethods: () => ['listAuthMethods'] as const,
  /** usePbCollectionConfigQuery */
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

  /** chatRoomMessagesGetOne */
  chatRoomMessagesGetOne: (messageId?: string | null) =>
    ['chatRoomMessagesGetOne', messageId] as const,
}
