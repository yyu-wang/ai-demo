import request, { ApiResponse } from '../index'
import { Login, loginRes } from '../interfaces/login'

// 注册
class loginApi {
  register(data: Login.ReqLoginForm): Promise<ApiResponse> {
    return request({
      url: '/auth/user/register',
      data,
      method: 'POST'
    })
  }
  // 登录
  login(data: Login.LoginForm): Promise<loginRes.loginType> {
    return request({
      url: '/auth/user/login',
      method: 'POST',
      data
    })
  }
}
export default new loginApi()
