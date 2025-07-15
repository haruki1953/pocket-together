import { queryConfig } from '@/config'
import { Collections, pb } from '@/lib'
import { queryKeys, queryRetryPbNetworkError } from '@/queries'
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
    // ✅ 在网络错误时重试
    retry: queryRetryPbNetworkError,
  })

  return {
    ...query,
  }
}
