import { queryConfig } from '@/config'
import { Collections, pb } from '@/lib'
import { queryKeys, queryRetryPbFetchTimeout } from '@/queries'
import { useAuthStore } from '@/stores'
import { fetchWithTimeoutPreferred } from '@/utils'
import { useQuery } from '@tanstack/vue-query'

// 个人信息查询
export const useProfileQuery = () => {
  const authStore = useAuthStore()

  const query = useQuery({
    // 查询依赖，需登录（响应式）
    enabled: computed(() => authStore.isValid && authStore.record?.id != null),
    // 查询键（响应式）
    queryKey: computed(() =>
      queryKeys.users.getOne(authStore.record?.id ?? '')
    ),
    // 查询函数
    queryFn: async () => {
      // 未登录，抛出错误
      if (!pb.authStore.isValid || pb.authStore.record?.id == null) {
        throw new Error(
          '!pb.authStore.isValid || pb.authStore.record?.id == null'
        )
      }
      // pb请求
      const pbRes = await pb
        .collection(Collections.Users)
        .getOne(pb.authStore.record.id, {
          // timeout为5000
          fetch: fetchWithTimeoutPreferred,
        })
      console.log(pbRes)
      return pbRes
    },
    // 缓存时间
    staleTime: queryConfig.staleTimeLong,
    // ✅ 仅在 fetch 被 AbortController 中断（超时）时进行重试（最多重试 2 次）(请求三次)
    retry: queryRetryPbFetchTimeout,
  })

  return {
    ...query,
  }
}
