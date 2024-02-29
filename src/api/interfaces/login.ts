// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    userName: string
    password: string
    rePassword: string
  }
  export interface ResLogin {
    access_token: string
  }
}
