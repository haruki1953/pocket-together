import { Collections, pb, type RoomsResponse, type UsersResponse } from '@/lib'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { queryKeys } from './query-keys'
import { queryRetryPbNetworkError } from './query-retry'

export const useRoomsInfiniteQuery = () => {
  const query = useInfiniteQuery({
    // queryKey: 查询的唯一标识符，vue-query用它来缓存数据
    // 最终这个 key 会被命名为 ['rooms','list','infinite']
    // 以后可以扩展相关的 key（详情在 query-keys.ts），此处我们暂时只获取卡片列表（list）
    queryKey: queryKeys.rooms('list', 'infinite'),

    // 实际执行数据请求的函数。
    queryFn: async ({ pageParam }) => {
      const perPage = 8
      // 调用 getList 时，通过泛型传入 expand 的确切类型
      const result = await pb
        .collection(Collections.Rooms)
        // author 字段会展开为完整用户信息 UsersResponse（编译类型安全）
        .getList<RoomsResponse<{ author: UsersResponse }>>(pageParam, perPage, {
          // 关联用户的字段 author
          expand: 'author',
          sort: '-created',
        })
      return result
    },

    // initialPageParam: 初始页码。
    initialPageParam: 1,

    // lastPage.page 是当前页码，lastPage.totalPages 是总页数
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
