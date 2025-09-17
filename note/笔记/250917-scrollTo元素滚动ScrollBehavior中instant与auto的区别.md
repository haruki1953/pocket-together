当然，Haruki！下面是一篇围绕 `ScrollBehavior` 中 `"instant"` 与 `"auto"` 的区别的技术笔记，适合团队内部分享或作为 markdown 文档收录进你的滚动工具库中：

---

## 📚 ScrollBehavior 中 `"instant"` 与 `"auto"` 的区别笔记

### 🧭 背景

在封装滚动工具函数时，我们常使用 `scrollTo` 或 `scrollIntoView` 控制元素滚动行为。它们都支持一个 `behavior` 参数，用于指定滚动方式。常见值包括：

```ts
type ScrollBehavior = "auto" | "smooth" | "instant";
```

虽然 `"auto"` 和 `"smooth"` 是最常见的，但 `"instant"` 也有其明确语义，且在某些场景下更适合用于精确控制。

---

### 🔍 三种滚动行为的语义对比

|值|含义说明|是否动画|浏览器是否可自由决定|
|---|---|---|---|
|`"auto"`|默认行为，由浏览器决定是否平滑滚动。可能立即跳转，也可能带动画。|可能有动画|✅ 是|
|`"smooth"`|强制平滑滚动，带动画效果。|✅ 有动画|❌ 否|
|`"instant"`|明确表示立即跳转，无动画。不会被浏览器解释为平滑滚动。|❌ 无动画|❌ 否|

> ✅ 推荐：当你希望滚动行为**绝对立即执行**时，应使用 `"instant"` 而不是 `"auto"`。

---

### 📌 官方文档支持

- [MDN: ScrollIntoViewOptions.behavior](https://developer.mozilla.org/en-US/docs/Web/API/ScrollIntoViewOptions)
- [W3C: CSSOM View Module](https://drafts.csswg.org/cssom-view/#enumdef-scrollbehavior)

MDN 对 `"instant"` 的定义：

> `"instant"`: The scrolling happens immediately with no animation.

而 `"auto"`：

> `"auto"`: The scrolling behavior is determined by the user agent.

---

### 🧠 实战建议

#### ✅ 使用 `"instant"` 的场景：

- 聊天窗口首次加载定位到底部
- 虚拟列表跳转到某个 anchor 元素
- 页面状态恢复时快速定位，不希望动画干扰用户感知

#### ❗️注意事项：

- `"instant"` 是 JS API 的合法值，但 **不能用于 CSS 的 `scroll-behavior` 属性**。
- 如果你在工具函数中使用 `"instant"`，建议加类型注释或 fallback 逻辑，确保兼容性。

---

### 🧩 示例封装（带 `"instant"` 支持）

```ts
/**
 * 滚动容器至指定子元素位置，支持立即或平滑滚动。
 *
 * @param container - 滚动容器
 * @param target - 目标元素
 * @param behavior - 滚动行为，默认 'auto'，可设置为 'instant' 或 'smooth'
 */
export const scrollToElementInContainer = (
  container: HTMLDivElement,
  target: HTMLElement,
  behavior: ScrollBehavior = 'auto'
): void => {
  const containerRect = container.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const offset = targetRect.top - containerRect.top + container.scrollTop;

  container.scrollTo({
    top: offset,
    behavior,
  });
};
```

---

### 🧪 补充建议

如果你希望进一步封装滚动行为为 DSL 或组合式函数（如 `useScrollToElement()`），建议将 `"instant"` 作为默认值用于状态恢复场景，并在文档中明确其语义。

---

需要我帮你把这篇笔记转成 markdown 模板、加上目录或团队级注释规范吗？我可以继续帮你整理成更适合收录的格式。