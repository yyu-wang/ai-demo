import { defineStore } from 'pinia'
import loginApi from '@/api/login' // 导入封装的 PostApi
import { LoginState, ReqLoginForm } from '@/stores/interface'

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
      console.log('111', res)

      sessionStorage.setItem('token', res.token)
      return res
    }
  }
})
