import { ApiResponse } from '../index'

// 响应声明
export namespace assistantRes {
  // 创建
  export interface createType extends ApiResponse {
    data: object
  }
}

// 传参声明
export namespace assistantReq {
  // 删除
  export interface deleteType {
    id: string
  }
}
