/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MessageHandler } from 'element-plus'
import type { AppContext } from 'vue'

export const potoMessage = ((
  options?: any,
  appContext?: null | AppContext
): MessageHandler => {
  return ElMessage(
    {
      ...options,
      // offset: 66,
      grouping: true,
    },
    appContext
  )
}) as typeof ElMessage

export const potoNotification = ((options?: any) => {
  return ElNotification({
    ...options,
    // offset: 60
  })
}) as typeof ElNotification
