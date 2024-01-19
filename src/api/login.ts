import request from './index'
// 注册
class loginApi {
  register(data: any) {
    return request({
      url: '/auth/user/register',
      data,
      method: 'POST'
    })
  }
  // 登录
  login(data: any) {
    return request({
      url: '/auth/user/login',
      method: 'POST',
      data
    })
  }
}
export default new loginApi()
