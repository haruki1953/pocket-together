export const queryKeys = {
  /** useProfileQuery */
  profile: (id: string) => ['profile', id] as const,
  /** useListAuthMethodsQuery */
  listAuthMethods: () => ['listAuthMethods'] as const,
  /** usePbCollectionConfigQuery */
  pbCollectionConfig: () => ['pbCollectionConfig'] as const,
  /** useChatRoomMessagesInfiniteQuery */
  chatRoomMessagesInfinite: (roomId: string | null) => [
    'chatRoomMessagesInfinite',
    roomId,
  ],
  /** chatRoomMessagesGetOne */
  chatRoomMessagesGetOne: (messageId?: string | null) => [
    'chatRoomMessagesGetOne',
    messageId,
  ],
}
