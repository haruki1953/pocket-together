# 搜索按钮动画效果 TODO List

## 阶段一：结构重构与状态准备 (HomeMenu.vue)

- [ ] **HomeMenu.vue**: 从 `vue` 中额外导入 `ref`。
- [ ] **HomeMenu.vue**: 在 `script` 中创建一个名为 `isSearching` 的 `ref`，初始值为 `false`。
- [ ] **HomeMenu.vue**: 修改 `<template>` 中的 `v-for` 循环，使用 `v-if="item.id === 'search'"` 来区分“搜索房间”按钮和其他普通按钮。

## 阶段二：组件舞台搭建 (HTML 结构)

- [ ] **HomeMenu.vue**: 为 `v-if="item.id === 'search'"` 的情况创建一个作为总容器的 `<div>`，并绑定 `:class` 以根据 `isSearching` 的值切换 CSS 类。
- [ ] **容器 `<div>`**: 在其内部，添加一个用于显示放大镜图标的 `<i>` 元素 (使用 Remix Icon, e.g., `<i class="ri-search-line"></i>`)。
- [ ] **容器 `<div>`**: 添加一个 `<span>` 元素用于显示“搜索房间”的文字。
- [ ] **容器 `<div>`**: 添加一个 `<input type="text">` 元素作为实际的输入框。
- [ ] **容器 `<div>`**: 添加 `@click` 事件监听器，当点击时将 `isSearching` 设置为 `true`。

## 阶段三：动画剧本编写 (CSS 样式)

- [ ] **HomeMenu.vue**: 在 `<style>` 标签内，为新的搜索组件容器编写默认样式，使其看起来像一个按钮（包括 `position: relative`, `overflow: hidden`）。
- [ ] **CSS**: 编写图标 `<i>`、文字 `<span>` 和输入框 `<input>` 的初始样式（例如，图标和输入框初始时 `opacity: 0` 并在屏幕外）。
- [ ] **CSS**: 编写激活状态的样式（例如 `.is-searching` 类下），定义容器、图标、文字和输入框的目标样式。
    - [ ] **容器**: 宽度 `width` 变化。
    - [ ] **文字**: `transform` 向右平移并 `opacity` 变为 0。
    - [ ] **图标**: `transform` 移动到原位并 `opacity` 变为 1。
    - [ ] **输入框**: `opacity` 变为 1 并设置 `pointer-events: auto`。
- [ ] **CSS**: 为所有参与动画的元素添加 `transition` 属性，以确保动画平滑。

## 阶段四：交互优化 (可选)

- [ ] **JS**: 编写一个函数，当搜索框失去焦点 (blur) 时，将 `isSearching` 设置回 `false`，使搜索框恢复为按钮形态。
- [ ] **JS**: 监听 `Escape` 按键，按下时也将 `isSearching` 设置回 `false`。
- [ ] **JS**: 当 `isSearching` 变为 `true` 后，自动聚焦 (focus) 到输入框上，提升用户体验。
