export const queryKeys = {
  //
  users: {
    listAuthMethods: () => ['users', 'listAuthMethods'] as const,
    getOne: (id: string) => ['users', 'getOne', id] as const,
  },
}
