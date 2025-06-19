```ts
// 为解决 pocketbase-typegen 无法为 创建/更新 记录时提供类型，暂时的解决办法
// 工具类型在 src\lib\pocketbase\utility-types-for-create-update-operations\index.ts
// 使用方法在 src\lib\pocketbase\utility-types-for-create-update-operations\README.md
// 以下是关于此问题的讨论和pr，但好像还未正式使用，故自己先简单配置一下
// https://github.com/patmood/pocketbase-typegen/issues/110
// https://github.com/patmood/pocketbase-typegen/pull/111
// https://github.com/patmood/pocketbase-typegen/pull/111/files/3451e6a48a3f456eb2315a1f2b3befe6d1752c7f#diff-55756c0df17ea2440970093c9a1a39f3b0fc08b8d06fd704ad0e0a474bbe75ca
// https://github.com/patmood/pocketbase-typegen/blob/3451e6a48a3f456eb2315a1f2b3befe6d1752c7f/test/pocketbase-types-example.ts#L226
// https://github.com/patmood/pocketbase-typegen/blob/3451e6a48a3f456eb2315a1f2b3befe6d1752c7f/README.md#createupdate-types

```

## Create/Update types

You can also type the create/update operations in two ways.

1. Using collection model directly (you need to know if your collection is base/auth, but you can use your own custom models):

```typescript
import { CreateAuth, CreateBase, PostsRecord, UpdateAuth, UpdateBase, UsersRecord } from "./pocketbase-types"

// For base collections
const newPost: CreateBase<PostsRecord> = {
  title: 'Post title',
  description: 'Post description',
  creator: 'USER_ID',
  active: true
}
const updatedPost: UpdateBase<PostsRecord> = {
  title: 'New post title',
  description: 'Updated post description',
  active: false
}

// For auth collections
const newUser: CreateAuth<UsersRecord> = {
  name: 'Name',
  username: 'username',
  password: 'password',
  passwordConfirm: 'password',
  email: 'user@mail.com',
  emailVisibility: true,
  verified: false
}
const updatedUser: UpdateAuth<UsersRecord> = {
  name: 'Name',
  email: 'user@mail.com',
  verified: false
}
```

2. Using Collections enum (type auto-infer if collection is base/auth):

```typescript
import { Collections, Create, Update } from "./pocketbase-types"

// For base collections

// Create
const newPost: Create<Collections.Posts> = {
  title: 'Post title',
  description: 'Post description',
  creator: 'USER_ID',
  active: true
}
// Update
const updatedPost: Update<Collections.Posts> = {
  title: 'Updated post title',
  description: 'Updated post description',
  active: false
}

// For auth collections

// Create
const newUser: Create<Collections.Users> = {
  name: 'Name',
  username: 'username',
  password: 'password',
  passwordConfirm: 'password',
  email: 'user@mail.com',
  emailVisibility: true,
  verified: false
}
// Update
const updatedUser: Update<Collections.Users> = {
  name: 'Updated name',
  email: 'user@email.com',
  verified: false
}
```