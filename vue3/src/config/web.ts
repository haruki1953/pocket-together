// 开发时使用的
const apiBaseUrl = 'http://localhost:8090/'
const staticBaseUrl = 'http://localhost:8090/'

// // 这是为了在手机上测试，需要的话要改为自己电脑的ip
// const apiBaseUrl = 'http://192.168.2.110:8090/'
// const staticBaseUrl = 'http://192.168.2.110:8090/'

// // 部署时，将由后端来托管前端，设置为根路径
// const apiBaseUrl = '/'
// const staticBaseUrl = '/'

export const axiosConfig = {
  baseUrl: apiBaseUrl,
  timeout: 20000,
}

export const pocketbaseConfig = {
  baseUrl: apiBaseUrl,
}
