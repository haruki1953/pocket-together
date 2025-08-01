// 开发时使用的
const baseUrl = 'http://127.0.0.1:8090/' as const

// // 这是为了在手机上测试，需要的话要改为自己电脑的ip
// const baseUrl = 'http://192.168.2.110:8090/' as const

// // 部署时，将由后端来托管前端，设置为根路径
// const baseUrl = '/' as const

// // 远程测试
// const baseUrl = 'https://pototest.sakiko.top/' as const

const timeout = 5000 as const

export const axiosConfig = {
  baseUrl,
  timeout,
}

export const pocketbaseConfig = {
  baseUrl,
}

export const fetchConfig = {
  // baseUrl,
  timeoutPreferred: timeout,
  /**
   * 为了 pocketbase SDK 的 requestEmailChange 而设置的超时时间
   *
   * 30秒
   */
  timeoutForPbRequestEmailChange: 30000,
} as const

export const queryConfig = {
  /**
   * 30秒
   */
  staleTimeShort: 30000,
  /**
   * 5分钟 1000 * 60 * 5
   */
  staleTimeMedium: 300000,
  /**
   * 1小时 1000 * 60 * 60
   */
  staleTimeLong: 3600000,
  /**
   * 重试2次（共请求3次）
   */
  retry: 2,
}
