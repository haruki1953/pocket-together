import { Collections, pb, type RoomsResponse, type UsersResponse } from '@/lib'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { queryKeys } from './query-keys'
import { queryRetryPbNetworkError } from './query-retry'
import type { Ref } from 'vue'
import { fetchWithTimeoutPreferred } from '@/utils'

// 定义 useRoomsInfiniteQuery 的参数类型
interface UseRoomsInfiniteQueryOptions {
  searchTerm: Ref<string> // 接收一个响应式的搜索词
}

export const useRoomsInfiniteQuery = ({
  searchTerm,
}: UseRoomsInfiniteQueryOptions) => {
  const query = useInfiniteQuery({
    // queryKey: 查询的唯一标识符，vue-query用它来缓存数据
    // 将 searchTerm 的值加入 queryKey，当 searchTerm 变化时，vue-query 会自动重新查询
    // 因为searchTerm是响应式的，要用computed，避免其丢失响应式
    queryKey: computed(() =>
      queryKeys.rooms('list', 'infinite', searchTerm.value)
    ),
    // 实际执行数据请求的函数。
    queryFn: async ({ pageParam }) => {
      const perPage = 7
      // 根据 searchTerm 的值决定是否添加过滤条件
      const filter =
        searchTerm.value !== '' ? `title ~ '${searchTerm.value}'` : ''

      // 调用 getList 时，通过泛型传入 expand 的确切类型
      const result = await pb
        .collection(Collections.Rooms)
        // author 字段会展开为完整用户信息 UsersResponse（编译类型安全）
        .getList<RoomsResponse<unknown, { author: UsersResponse }>>(
          pageParam,
          perPage,
          {
            // 关联用户的字段 author
            expand: 'author',
            sort: '-created',
            filter, // 应用过滤器
            // timeout为5000
            fetch: fetchWithTimeoutPreferred,
          }
        )
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
