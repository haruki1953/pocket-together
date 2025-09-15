<script setup lang="ts">
import ChatColOnewayNewest from './ChatColOnewayNewest.vue'
import type { PMLRCApiParameters0DataPageParamNonNullable } from '@/api'

const props = defineProps<{
  /** 滚动容器元素 */
  refScrollWarp?: HTMLDivElement
}>()

// /**
//  * One-way infinite query from newest
//  * 单向最新无限查询：从最新的消息开始，无限查询更旧的
//  * Two-way infinite query from a positioning cursor
//  * 双向定位无限查询：从指定的游标信息开始，双向无限查询，用于定位显示指定的消息
//  */

// /**
//  * 双向定位无限查询的定位游标数据，
//  * 同时将根据此数据判断该显示 单向最新无限查询消息列组件 还是 双向定位无限查询消息列组件
//  */
// const twowayPositioningCursorData =
//   ref<PMLRCApiParameters0DataPageParamNonNullable | null>(null)
// /**
//  * 此函数用于设置twowayPositioningCursorData的值，
//  * 将作为参数传入单向或双向组件，设置有效值即显示双向组件，设置为null即显示单向组件
//  */
// const twowayPositioningCursorDataSet = (
//   data: PMLRCApiParameters0DataPageParamNonNullable | null
// ) => {
//   twowayPositioningCursorData.value = data
// }

// // 测试 双向定位无限查询消息列组件
// twowayPositioningCursorDataSet({
//   id: 'q28e1f8rp24eo6n',
//   created: '2025-09-04 15:38:07.959Z',
// })
</script>

<template>
  <div>
    <!-- 双向 -->
    <!-- <template v-if="twowayPositioningCursorData != null"> -->
    <!-- 双向定位无限查询消息列组件 TODO -->
    <!-- </template> -->
    <!-- 单向 -->
    <!-- <template v-else> -->
    <!-- 单向最新无限查询消息列组件 -->
    <!-- <ChatColOnewayNewest :refScrollWarp="refScrollWarp"></ChatColOnewayNewest> -->
    <!-- </template> -->
  </div>
</template>

<style lang="scss" scoped></style>
