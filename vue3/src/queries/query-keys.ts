export const queryKeys = {
  /** useProfileQuery */
  profile: (id: string) => ['profile', id] as const,
  /** useListAuthMethodsQuery */
  listAuthMethods: () => ['listAuthMethods'] as const,
  /** usePbCollectionConfigQuery */
  pbCollectionConfig: () => ['pbCollectionConfig'] as const,
  /** useChatRoomMessagesInfiniteQuery */
  chatRoomMessagesInfinite: (roomId: string) => [
    'chatRoomMessagesInfinite',
    roomId,
  ],
}
