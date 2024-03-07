import { ApiResponse } from '../index'

// 登录模块
// 传参声明
export namespace Login {
  // 注册
  export interface ReqLoginForm {
    userName: string
    password: string
    rePassword: string
  }
  // 登录
  export interface LoginForm {
    userName: string
    password: string
  }
}

// 响应声明
export namespace loginRes {
  // 登录
  export interface loginType extends ApiResponse {
    token: string
    expire: number
  }
}
