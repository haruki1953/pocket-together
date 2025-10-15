import { Collections, pb, type RoomsResponse, type UsersResponse } from '@/lib'
import { useInfiniteQuery, useQuery } from '@tanstack/vue-query'
import { queryKeys } from './query-keys'
import { queryRetryPbNetworkError } from './query-retry'
import { computed, type Ref } from 'vue'
import { fetchWithTimeoutPreferred } from '@/utils'
import { pbRoomsGetOneApi } from '@/api'
import { queryConfig } from '@/config'
// 状态说是
import { useAuthStore } from '@/stores/auth'

// 定义 useRoomsInfiniteQuery 的参数类型
interface UseRoomsInfiniteQueryOptions {
  // 接收一个响应式的搜索词
  searchTerm: Ref<string>
  onlyUserRooms: Ref<boolean>
  onlyFavoriteRooms: Ref<boolean>
}

export const useRoomsInfiniteQuery = ({
  searchTerm,
  onlyUserRooms,
  onlyFavoriteRooms,
}: UseRoomsInfiniteQueryOptions) => {
  // 状态说是
  const authStore = useAuthStore()
  const query = useInfiniteQuery({
    // 查询的唯一标识符
    // 使用专门为无限滚动列表创建的、类型安全的 key 生成函数
    // 使用 computed 包裹以确保对 authStore.record?.id 的响应性（实时响应）
    // 当 searchTerm、onlyUserRooms 或用户登录状态变化时，vue-query 会自动重新查询
    queryKey: computed(() =>
      // 设立 key 是为了利用 query key 变化时自动重新获取数据的特性
      queryKeys.roomsListInfinite({
        searchTerm,
        onlyUserRooms,
        onlyFavoriteRooms,
        // 如果用户 A 退出，用户 B 登录，用户 B 可能看到用户 A 的房间列表
        // 用户的登录状态发生变化，queryKey 立刻更新
        userId: authStore.record?.id,
      })
    ),
    // 实际执行数据请求的函数
    queryFn: async ({ pageParam }) => {
      const perPage = 7
      // 过滤条件
      const filters: string[] = []
      // 搜索词不为空
      if (searchTerm.value !== '') {
        filters.push(`title ~ '${searchTerm.value}'`)
      }
      // 用户自己的房间
      if (onlyUserRooms.value && authStore.record?.id != null) {
        filters.push(`author = '${authStore.record.id}'`)
      }
      if (onlyFavoriteRooms.value && authStore.record?.id != null) {
        filters.push(`favorites ~ '${authStore.record.id}'`)
      }
      // 链接所有条件
      const filter = filters.join(' && ')
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
            // timeout 为 5000
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

export const useRoomsGetOneQuery = (data: {
  roomId: ComputedRef<string | null>
}) => {
  const { roomId } = data

  const query = useQuery({
    // 查询依赖，需 roomId
    enabled: computed(() => roomId.value != null),
    // 查询键（响应式）
    queryKey: computed(() => queryKeys.roomsGetOne(roomId.value)),
    // 查询函数
    queryFn: async () => {
      // 无roomId，抛出错误
      if (roomId.value == null) {
        throw new Error('roomId.value == null')
      }
      // pb请求
      const pbRes = await pbRoomsGetOneApi(roomId.value)

      // TODO 持久化

      return pbRes
    },
    // TODO 占位数据
    // 缓存时间
    gcTime: queryConfig.gcTimeLong,
    staleTime: queryConfig.staleTimeLong,
    // ✅ 在网络错误时重试
    retry: queryRetryPbNetworkError,
  })

  return query
}
