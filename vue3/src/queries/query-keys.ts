export const queryKeys = {
  profile: (id: string) => ['profile', id] as const,
  listAuthMethods: () => ['listAuthMethods'] as const,
  pbCollectionConfig: () => ['pbCollectionConfig'] as const,
  rooms: (...args: string[]) => ['rooms', ...args] as const,
}
