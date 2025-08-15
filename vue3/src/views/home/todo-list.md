# 滚动加载与动画 TODO List

## 阶段一：滚动加载逻辑 (Script)

- [ ] **HomePage.vue**: 从 `@vueuse/core` 额外导入 `useIntersectionObserver`。
- [ ] **HomePage.vue**: 在 `script` 中创建一个名为 `loadMoreTrigger` 的 `ref`，初始值为 `null`。
- [ ] **HomePage.vue**: 创建一个名为 `loadMore` 的新函数。
- [ ] **`loadMore` 函数**: 检查 `DisplayCards` 的长度是否已等于 `AllCard`，如果是则直接 `return`。
- [ ] **`loadMore` 函数**: 计算当前 `DisplayCards` 的长度作为下一批数据的起始索引。
- [ ] **`loadMore` 函数**: 计算结束索引（起始索引 + `PAGE_SIZE`）。
- [ ] **`loadMore` 函数**: 使用 `.slice()` 从 `AllCard.value` 中获取新数据。
- [ ] **`loadMore` 函数**: 使用扩展运算符 (`...`) 将新数据追加到 `DisplayCards.value`。
- [ ] **HomePage.vue**: 在 `script` 末尾调用 `useIntersectionObserver` 来监听 `loadMoreTrigger`。
- [ ] **Observer**: 在回调函数中，当 `isIntersecting` 为 `true` 时调用 `loadMore()`。
- [ ] **Observer**: 从 `useIntersectionObserver` 的返回值中解构出 `stop` 函数。
- [ ] **`loadMore` 函数**: 在检查到所有卡片已加载完毕的 `if` 语句中，调用 `stop()` 函数。

## 阶段二：放置触发器 (Template)

- [ ] **HomePage.vue**: 在第一个 `columns-2` 容器的 `<HomeCard.../>` 之后，添加 `<div ref="loadMoreTrigger" />`。
- [ ] **HomePage.vue**: 在第二个 `columns-2` 容器的 `<HomeCard.../>` 之后，也添加一个相同的 `<div ref="loadMoreTrigger" />`。

## 阶段三：添加自动动画

- [ ] **终端**: 在 `vue3` 目录下运行 `pnpm add @formkit/auto-animate`。
- [ ] **HomePage.vue**: 在 `script` 顶部从 `@formkit/auto-animate/vue` 导入 `vAutoAnimate`。
- [ ] **HomePage.vue**: 在第一个 `columns-2` 容器 `div` 上，添加 `v-auto-animate` 指令。
- [ ] **HomePage.vue**: 在第二个 `columns-2` 容器 `div` 上，也添加 `v-auto-animate` 指令。
