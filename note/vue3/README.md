## 初始化
pnpm create vue@3.16.4
pnpm install
pnpm format
pnpm dev

## eslint配置

## pinia持久化

## tailwindcss

## element-plus

## RemixIcon
pnpm install @remixicon/vue

## 国际化

## vueuse unhead 
pnpm i @vueuse/core @unhead/vue

## 完善 index.html app.vue
嵌入样式，加载动画

## build尝试
```
vite v6.3.5 building for production...
✓ 1514 modules transformed.
dist/index.html                       5.42 kB │ gzip:   1.90 kB
dist/assets/AboutView-CSIvawM9.css    0.09 kB │ gzip:   0.10 kB
dist/assets/index-9fJjCsir.css       83.61 kB │ gzip:  14.04 kB
dist/assets/AboutView-W07_qu06.js     0.26 kB │ gzip:   0.22 kB
dist/assets/index-BoIN3V3K.js       315.30 kB │ gzip: 115.58 kB
✓ built in 25.95s
```
## naive-ui
> naive-ui Made by TuSimple 严重怀疑是在玩江泽民的梗（

pnpm i -D naive-ui

也配置了暗黑模式与国际化

## 路由与导航栏

## 导航栏响应式

## 登录页

## 项目层级架构 Layered Architecture
1. **分层设计**：系统被划分为多个水平层，每个层负责不同的功能，比如 UI 层、业务逻辑层、数据访问层等。
2. **层间依赖**：每一层只能依赖它下面的层，避免循环引用和耦合问题。
3. **关注点分离**：每个层只处理自己的职责，比如 UI 层只负责展示，业务层只负责逻辑处理。
```
app.vue
views
components
servers - 业务逻辑（项目简单时不需要）
stores - 业务逻辑也可以在store中进行
utils
api
lib - 配置并导出Axios、PocketBase实例
config
```

## Axios、PocketBase
虽然接下来的项目可能用不到Axios，不过还是配置了

Pocketbase Typegen 可以为自己的pocketbase生成类型
- https://www.npmjs.com/package/pocketbase-typegen
- pnpm i -D pocketbase-typegen
- pnpm pocketbase-typegen --json ./pb_schema.json
- pnpm pocketbase-typegen --db ./pb_data/data.db

## build尝试
```
vite v6.3.5 building for production...
✓ 3627 modules transformed.
dist/index.html                   5.42 kB │ gzip:   1.90 kB
dist/assets/logo-DYjrdBLf.png    34.60 kB
dist/assets/index-CX7lFOKr.css   59.34 kB │ gzip:  10.76 kB
dist/assets/index-D7fGMbKc.js   332.36 kB │ gzip: 105.39 kB
✓ built in 1m 1s
```

## PocketBase类型生成
https://github.com/patmood/pocketbase-typegen
```
pocketbase-typegen --json ../pocketbase/pb_schema.json
```

出现了sqlite3问题，pnpm approve-builds 并选中 sqlite3 之后就可以了

## 登录页

## tanstack query
```
pnpm add @tanstack/vue-query
pnpm add -D @tanstack/eslint-plugin-query
```
tanstack query 和 pocketbase 都没有超时时间的设置，需要自己来配置
```ts
// src\views\login\LoginPage.vue
await pb.collection(Collections.Users).listAuthMethods({
    // src\utils\fetch.ts
    fetch: fetchWithTimeoutPreferred,
})
```
