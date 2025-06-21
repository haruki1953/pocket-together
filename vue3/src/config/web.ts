// 开发时使用的
const baseUrl = 'http://127.0.0.1:8090/'

// // 这是为了在手机上测试，需要的话要改为自己电脑的ip
// const baseUrl = 'http://192.168.2.110:8090/'

// // 部署时，将由后端来托管前端，设置为根路径
// const baseUrl = '/'

// // 远程测试
// const baseUrl = 'https://pototest.sakiko.top/'

export const axiosConfig = {
  baseUrl,
  timeout: 20000,
}

export const pocketbaseConfig = {
  baseUrl,
}
