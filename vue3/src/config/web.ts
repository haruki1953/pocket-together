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
}

export const queryConfig = {
  /**
   * 30 秒
   */
  staleTimeShort: 1000 * 30,
  /**
   * 5 分钟
   */
  staleTimeMedium: 1000 * 60 * 5,
  /**
   * 1 小时
   */
  // staleTimeLong: 1000 * 60 * 60,
  staleTimeLong: 1000,
  /**
   * 重试2次（共请求3次）
   */
  retry: 2,
}
