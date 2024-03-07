// api.ts

import axios, { AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios'
import router from '@/router/index'

export interface ApiResponse {
  code: number
  message: string
}

// 创建 Axios 实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string, // 替换成你的 API 地址
  timeout: 30000 // 请求超时时间
})

// 请求拦截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token: any = localStorage.getItem('token')
    // 在发送请求之前可以做一些处理
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }

    return config
  },
  (error: AxiosError) => {
    // 对请求错误进行处理
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log('响应拦截器response', response)
    // 对响应数据进行处理
    return new Promise((resolve, reject) => {
      const data = response.data
      // 异常
      if (data.code === 200) {
        resolve(data)
      } else if (data.code === 401) {
        // token过期
        router.replace('/login')
        localStorage.setItem('token', '')

        reject({
          message: data.message
        })
      } else {
        reject({
          message: data.message
        })
      }
    })
  },
  (error: AxiosError) => {
    // 对响应错误进行处理
    return Promise.reject(error)
  }
)

export default api
