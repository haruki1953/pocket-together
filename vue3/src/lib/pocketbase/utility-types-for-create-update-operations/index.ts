import type {
  AuthSystemFields,
  BaseSystemFields,
  CollectionRecords,
  CollectionResponses,
  RecordIdString,
} from './dependencies'
type IsoAutoDateString = string & { readonly auto: unique symbol }

// 为解决 pocketbase-typegen 无法为 创建/更新 记录时提供类型，暂时的解决办法
// 工具类型在 src\lib\pocketbase\utility-types-for-create-update-operations\index.ts
// 使用方法在 src\lib\pocketbase\utility-types-for-create-update-operations\README.md
// 以下是关于此问题的讨论和pr，但好像还未正式使用，故自己先简单配置一下
// https://github.com/patmood/pocketbase-typegen/issues/110
// https://github.com/patmood/pocketbase-typegen/pull/111
// https://github.com/patmood/pocketbase-typegen/pull/111/files/3451e6a48a3f456eb2315a1f2b3befe6d1752c7f#diff-55756c0df17ea2440970093c9a1a39f3b0fc08b8d06fd704ad0e0a474bbe75ca
// https://github.com/patmood/pocketbase-typegen/blob/3451e6a48a3f456eb2315a1f2b3befe6d1752c7f/test/pocketbase-types-example.ts#L226
// https://github.com/patmood/pocketbase-typegen/blob/3451e6a48a3f456eb2315a1f2b3befe6d1752c7f/README.md#createupdate-types

// Utility types for create/update operations

// Create type for Auth collections
export type CreateAuth<T> = {
  id?: RecordIdString
  email: string
  emailVisibility?: boolean
  password: string
  passwordConfirm: string
  verified?: boolean
} & Omit<
  {
    [K in keyof T as T[K] extends IsoAutoDateString ? never : K]: T[K]
  },
  // 这里自己做了修改，github上的pr有一点疏漏
  // 除了应忽略 id 外，创建时还应忽略 tokenKey
  'id' | 'tokenKey'
>

// Create type for Base collections
export type CreateBase<T> = {
  id?: RecordIdString
} & Omit<
  {
    [K in keyof T as T[K] extends
      | IsoAutoDateString
      | (IsoAutoDateString | undefined)
      ? never
      : K]: T[K]
  },
  'id'
>

// Update type for Auth collections
export type UpdateAuth<T> = Partial<Omit<T, keyof AuthSystemFields>> & {
  email?: string
  emailVisibility?: boolean
  oldPassword?: string
  password?: string
  passwordConfirm?: string
  verified?: boolean
  // 这里自己做了修改
  // 加上 username 这样才能符合自己的 Update (users) Body Parameters
  username: string
}

// Update type for Base collections
export type UpdateBase<T> = Partial<Omit<T, keyof BaseSystemFields>>

// Get the correct create type for any collection
export type Create<T extends keyof CollectionResponses> =
  CollectionResponses[T] extends AuthSystemFields
    ? CreateAuth<CollectionRecords[T]>
    : CreateBase<CollectionRecords[T]>

// Get the correct update type for any collection
export type Update<T extends keyof CollectionResponses> =
  CollectionResponses[T] extends AuthSystemFields
    ? UpdateAuth<CollectionRecords[T]>
    : UpdateBase<CollectionRecords[T]>
