# 悬浮抽屉菜单功能 TODO List

## 阶段一：状态与滚动监听 (HomePage.vue)

- [ ] **HomePage.vue**: 在 `script` 中，为 `HomeMenu` 组件的 DOM 元素创建一个模板引用 `ref` (例如 `homeMenuRef`)。
- [ ] **HomePage.vue**: 引入 `@vueuse/core` 的 `useIntersectionObserver`。
- [ ] **HomePage.vue**: 创建一个 `ref` 变量 `isMenuVisible`，初始值为 `true`。
- [ ] **HomePage.vue**: 使用 `useIntersectionObserver` 监听 `homeMenuRef`。当 `HomeMenu` 元素离开或进入视口时，更新 `isMenuVisible` 的值。
- [ ] **HomePage.vue**: 创建另一个 `ref` 变量 `isDrawerOpen`，初始值为 `false`，用于控制抽屉的打开和关闭状态。

## 阶段二：悬浮触发器 (Floating Tab)

- [ ] **创建新组件**: 创建一个 `FloatingMenuTab.vue` 组件，用于作为悬浮在页面左侧的触发器。
- [ ] **HomePage.vue**: 在模板中，使用 `v-if="!isMenuVisible"` 来控制 `FloatingMenuTab` 的显示与隐藏。
- [ ] **FloatingMenuTab.vue**: 组件内部应有一个按钮，绑定 `@click` 事件，该事件会 `emit` 一个自定义事件 (例如 `open-drawer`)。
- [ ] **HomePage.vue**: 监听 `FloatingMenuTab` 的 `open-drawer` 事件，并在此事件触发时将 `isDrawerOpen` 设置为 `true`。

## 阶段三：抽屉面板 (Drawer Panel)

- [ ] **创建新组件**: 创建一个 `DrawerMenu.vue` 组件，它将作为从左侧滑出的抽屉。
- [ ] **内容复用**: 将 `HomeMenu.vue` 的核心菜单项和功能逻辑提取到一个或多个组合式函数 (Composables) 中，以便在 `HomeMenu.vue` 和 `DrawerMenu.vue` 中共享。
- [ ] **DrawerMenu.vue**: 在组件内部实现菜单的布局。它应该包含一个明确的“关闭”按钮。
- [ ] **HomePage.vue**: 在模板中，使用 `v-show="isDrawerOpen"` 来控制 `DrawerMenu` 的显示。这可以获得更流畅的切换体验。
- [ ] **事件处理**: 监听 `DrawerMenu` 内部发出的 `close` 事件，在触发时将 `isDrawerOpen` 设置为 `false`。

## 阶段四：样式与动画 (CSS)

- [ ] **FloatingMenuTab.vue**: 为其编写 CSS，使用 `position: fixed` 将其固定在浏览器视口的左侧中间位置，并添加入场/出场的过渡动画 (`transition`)。
- [ ] **DrawerMenu.vue**:
    - 使用 `position: fixed`，设置 `top: 0`, `left: 0`, `height: 100vh`，并给一个合适的 `z-index` 使其能覆盖在页面之上。
    - 默认状态下，使用 `transform: translateX(-100%)` 将其隐藏在屏幕左侧。
    - 创建一个激活状态的 CSS 类 (例如 `.is-open`)，在此类下设置 `transform: translateX(0)`。
    - 为 `transform` 属性添加 `transition`，以实现平滑的滑入/滑出动画。
- [ ] **背景遮罩 (Backdrop)**: 在 `DrawerMenu.vue` 中可以额外添加一个半透明的背景遮罩层，当抽屉打开时显示，增加模态效果。

## 阶段五：交互优化

- [ ] **点击外部关闭**: 在 `HomePage.vue` 中，为 `DrawerMenu` 组件应用 `@vueuse/core` 的 `onClickOutside` 功能。当用户点击抽屉外部区域时，自动将 `isDrawerOpen` 设置为 `false`。
- [ ] **ESC 键关闭**: 使用 `@vueuse/core` 的 `onKeyStroke` 监听 `Escape` 键，按下时也将 `isDrawerOpen` 设置为 `false`。
- [ ] **滚动锁定**: 当抽屉打开时 (`isDrawerOpen` 为 `true`)，禁止背景页面滚动，以提升模态体验。可以使用 `@vueuse/core` 的 `useScrollLock`。
