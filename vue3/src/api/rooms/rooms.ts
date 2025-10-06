import { Collections, pb } from '@/lib'
import { fetchWithTimeoutPreferred } from '@/utils'
import { roomsExpand, type RoomsResponseWithExpandType } from './base'

/** rooms集合 getOne */
export const pbRoomsGetOneApi = async (roomId: string) => {
  // expand 字符串
  const expand = roomsExpand

  const pbRes = await pb
    .collection(Collections.Rooms)
    .getOne<RoomsResponseWithExpandType>(roomId, {
      expand,
      // timeout为5000
      fetch: fetchWithTimeoutPreferred,
    })
  console.log(pbRes)

  return pbRes
}
