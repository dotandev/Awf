import { useAuthStore } from '@/stores/auth'

// 从环境变量中获取 API 的基础URL
export const baseURL = process.env.API_URL

// 创建axios实例, 并设置基础 URL 和超时时间
const http = axios.create({
  baseURL,
  timeout: 10000,
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在发送请求前设置授权头
    return {
      ...setAuthHeader(config),
    }
  },
  (error) => {
    // 请求错误时的处理
    return Promise.reject(error)
  },
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 如果响应成功, 直接返回响应数据
    return response
  },
  (error) => {
    // 响应错误时的处理
    return Promise.reject(error)
  },
)

// 封装设置授权头的函数
function setAuthHeader(config: InternalAxiosRequestConfig) {
  // 获取用于存储身份认证凭据的 store 对象
  const authStore = useAuthStore()
  // 获取 access_token
  const access_token = authStore.access_token
  // 如果 access_token 存在
  if (access_token) {
    // 将其添加到请求头中
    config.headers['Authorization'] = `Bearer ${access_token}`
  }
  // 返回配置使其生效
  return config
}

// 从环境变量中判断是否启用请求失败的重试机制
const enableRetry = process.env.ENABLE_RETRY === 'true'

// 如果启用了请求失败的重试机制
if (enableRetry) {
  // 开发环境, 不稳定，服务可能频繁重启或更新，在这种环境下启用重试可能会掩盖问题，如服务不稳定或配置错误。
  // 生产环境, 稳定性和可用性是关键，重试机制可以帮助处理临时的网络波动或服务短暂不可用的情况，提高系统的鲁棒性。
  axiosRetry(http, {
    // 设置重试次数为3次
    retries: 3,
    // 设置重试延迟为2秒乘以重试次数
    retryDelay: (retryCount) => retryCount * 2000,
    // 设置重试的条件，例如只有在网络请求失败时才重试
    retryCondition: (error) => error.isAxiosError,
  })
}

// 导出 axios 实例
export default http
