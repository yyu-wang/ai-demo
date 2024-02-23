export type LanguageType = 'zh' | 'en' | 'zh-hk' | null

/* GlobalState */
export interface GlobalState {
  language: LanguageType
}

// LoginState
export interface LoginState {
  token: string
}
export interface ReqLoginForm {
  userName: string
  password: string
  //   rePassword: ''
}

// SystemStore
export interface systemState {
  title: string
  menuActive: string
}
