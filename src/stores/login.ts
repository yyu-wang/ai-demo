import { defineStore } from 'pinia'
import loginApi from '@/api/login' // 导入封装的 PostApi

interface LoginState {
  token: string
}
interface ReqLoginForm {
  userName: string
  password: string
  //   rePassword: ''
}

export const loginSystemStore = defineStore({
  id: 'system',
  state: (): LoginState => ({
    token: ''
  }),
  getters: {},
  actions: {
    login: async (loginForm: ReqLoginForm) => {
      let { userName, password } = loginForm
      let res = await loginApi.login({
        userName,
        password
      })
      sessionStorage.setItem('token', res.token)
      return res
    }
  }
})
