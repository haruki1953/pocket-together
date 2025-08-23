import { Collections, onPbResErrorStatus401AuthClear, pb } from '@/lib'
import { fetchWithTimeoutPreferred } from '@/utils'

/** config集合 getFullList */
export const pbConfigGetFullListApi = async () => {
  const pbRes = await pb.collection(Collections.Config).getFullList({
    // timeout为5000
    fetch: fetchWithTimeoutPreferred,
  })
  return pbRes
}
