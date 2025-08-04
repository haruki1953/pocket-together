
### 🧩 背景：queryFn 的工作流程回顾

你的代码逻辑如下：

```ts
const queryFn: async () => {
  // 从 PocketBase 查询配置集合
  const pbRes = await pb.collection(Collections.Config).getFullList()

  // 初始化 queryData 为默认配置
  const queryData = pbCollectionConfigDefaultGetFn()

  // 遍历 queryData 的每一个键名
  const queryDataKeys = Object.keys(queryData) as (keyof typeof queryData)[]
  queryDataKeys.forEach((key) => {
    // 在 pbRes 中寻找对应 key 的数据项
    const findKeyItem = pbRes.find((i) => i.key === key)
    if (findKeyItem == null) return

    // 使用 Zod 做类型校验
    const findKeyItemParseResult = pbCollectionConfigSchema[key].safeParse(findKeyItem.value)
    if (findKeyItemParseResult.success === false) return

    // 👉 原始尝试：直接赋值
    queryData[key] = findKeyItemParseResult.data // ❌ 类型错误

    // ✅ 解决方案：使用 queryDataKeyValueUpdate
    const queryDataKeyValueUpdate = <K extends keyof typeof queryData>(
      key: K,
      value: (typeof queryData)[K]
    ) => {
      queryData[key] = value
    }
    queryDataKeyValueUpdate(key, findKeyItemParseResult.data)
  })

  return queryData
}
```

---

### 🚨 问题本质分析：`queryData[key] = ...` 为何类型报错？

在你写下：

```ts
queryData[key] = findKeyItemParseResult.data
```

TypeScript 报错 `Type '...' is not assignable to type 'never'`，这其实是**类型推断精度不足 + 安全性限制的叠加结果**。

问题来自这几层：

#### ① Object.keys(queryData) 返回的是 string[]

即使你断言为 `(keyof typeof queryData)[]`，TypeScript 在遍历中仍然认为 `key` 类型是广义字符串，不是某个精确的字段。

#### ② queryData 是由泛型构建的对象（通过 Zod 推导）

类型是：

```ts
export type PbCollectionConfigType = {
  [K in keyof typeof pbCollectionConfigSchema]: z.infer<(typeof pbCollectionConfigSchema)[K]>
}
```

TypeScript 会推断 `queryData[key]` 为 `PbCollectionConfigType[keyof PbCollectionConfigType]`，这仍然过于泛泛，**不等同于你当前访问的具体字段类型**，比如 `boolean` 或 `number`。

#### ③ TypeScript 在不确定具体字段类型时，为了安全，默认将目标赋值类型标记为 `never`

这是为了防止你在动态访问结构时不小心赋值错类型，比如把 `boolean` 写成了字符串。

### 【另一种说明】⚠️ 原因剖析：TypeScript 审查不严苛，而是过于谨慎

你用了：
```ts
const queryDataKeys = Object.keys(queryData) as (keyof typeof queryData)[]
```

但在 `.forEach` 中：

- TypeScript 虽然知道 `key` 是 `queryData` 的键名之一，但它**无法进一步推断**该键在某一时刻到底是哪一个具体的键。
- 所以它把 `queryData[key]` 的类型变成了 `never`，表示：“我无法确定你是不是在访问一个合法且类型匹配的字段，所以我宁可不给你赋值权限。”

这是一种**类型保护机制**，防止你在运行时发生类型错配。

---

### ✅ 解决方案：泛型函数精准绑定键值类型

你用：

```ts
const queryDataKeyValueUpdate = <K extends keyof typeof queryData>(
  key: K,
  value: (typeof queryData)[K]
) => {
  queryData[key] = value
}
```

这个函数有两个强大之处：

|特性|作用|
|---|---|
|`<K extends keyof typeof queryData>`|限制传入的 key 一定是 queryData 的合法键|
|`value: (typeof queryData)[K]`|精准锁定该键对应的类型（如 boolean、number 等），不会丢失类型推断|

当你调用：

```ts
queryDataKeyValueUpdate(key, findKeyItemParseResult.data)
```

TypeScript 此时能准确推断出：

- `key` 是 `'allow-basic-users-upload'`
- `value` 是 `boolean`

因此赋值 `queryData[key] = value` **是完全合法、安全、没有歧义的**，类型系统不再阻止你。

---

### 🌟 附加优化建议

如果你未来要操作更多类似 config 对象，可以将此泛型函数抽成 util 工具：

```ts
export const setSafeKeyValue = <
  T extends Record<string, unknown>,
  K extends keyof T
>(
  obj: T,
  key: K,
  value: T[K]
) => {
  obj[key] = value
}
```

使用起来一样简洁：

```ts
setSafeKeyValue(queryData, key, findKeyItemParseResult.data)
```

这样可以复用于任意结构化对象，不限于 config。

---

### 📝 总结

|项目|内容|
|---|---|
|问题|TypeScript 无法在动态遍历中确认 key 对应的具体类型，导致默认为 `never`|
|影响|直接赋值失败，无法安全更新 queryData|
|解决方案|使用泛型函数 `queryDataKeyValueUpdate`，将 key 与 value 的类型绑定起来|
|优点|安全赋值、无类型报错、结构清晰、可拓展性强|
|推荐做法|将此函数抽离为 util 工具，提升复用性|

---

如果你还想深入分析 Zod 推导的类型如何和 PocketBase 数据结构更优结合，我也可以帮你从 schema 构建到 API 请求链路做进一步梳理。我们继续拆一层？ 😄