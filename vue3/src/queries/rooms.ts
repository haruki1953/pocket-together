import { Collections, pb, type RoomsResponse, type UsersResponse } from '@/lib'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { queryKeys } from './query-keys'
import { queryRetryPbNetworkError } from './query-retry'

export const useRoomsInfiniteQuery = () => {
  const query = useInfiniteQuery({
    // queryKey: 查询的唯一标识符。vue-query会用它来缓存数据。
    queryKey: queryKeys.rooms('list', 'infinite'),

    // queryFn: 这是实际执行数据请求的函数。
    queryFn: async ({ pageParam }) => {
      const perPage = 10
      // 修正: 在调用 getList 时，通过泛型传入 expand 的确切类型
      const result = await pb
        .collection(Collections.Rooms)
        .getList<RoomsResponse<{ author: UsersResponse }>>(pageParam, perPage, {
          // 根据数据结构，关联用户的字段 author，所以我们 expand 'author'
          expand: 'author',
          sort: '-created', // 按创建时间倒序排列，新的在前面
        })
      return result
    },

    // initialPageParam: 初始页码。
    initialPageParam: 1,

    // getNextPageParam: 告诉 vue-query 如何计算下一页的页码。
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1
      }
      return undefined // 返回 undefined 表示没有更多页面了
    },

    // retry: 继承自项目中的通用网络错误重试策略。
    retry: queryRetryPbNetworkError,
  })

  return query
}
