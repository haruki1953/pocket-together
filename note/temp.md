请你就以下内容帮我写一篇笔记，因为我之后将会尝试自建路由信息栈，所以要了解这些东西

## 讲解 history.state

## Vue Router 会设置 history.state，可以通过router.afterEach时看到
```
router.afterEach((to, from) => {
  console.log('🔍 [afterEach] history.state', history.state)
})
看到的history.state是这样的
{
    "back": "/",
    "current": "/chat",
    "forward": null,
    "replaced": false,
    "position": 25,
    "scroll": null
}
官方源码（请简单解释）
https://github.com/vuejs/router/blob/main/packages/router/src/history/html5.ts

所以自己在replaceState时，要保留原本State里的信息，避免影响vue
```

## 组件的setup会在afterEach之后才执行

## 自建路由栈的思路
```
src\stores 新增一个 pinia store，用于储存路由信息如：
所有路由信息的数组
当前路由的索引

stores还返回一个方法，这个方法将在router.afterEach中被调用，这个方法其中会查看并判断history.state.一个表示历史项唯一id字段，如果没有此值则replaceState设置
根据此值结合store中储存的信息，就可以知道路由当前历史位置之类的，并维护储存的信息
```
