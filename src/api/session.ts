import request from './index'

class sessionApi {
  // 创建会话
  createSession(data: any) {
    return request({
      url: '/api/v1/conversation/create',
      data,
      method: 'POST'
    })
  }
  // 会话列表
  listSession(data: any) {
    return request({
      url: '/api/v1/conversation/list',
      params: data,
      method: 'GET'
    })
  }
  // 删除会话
  deleteSession(data: any) {
    return request({
      url: '/api/v1/conversation/delete',
      data,
      method: 'POST'
    })
  }
  // 当前会话的聊天记录
  messageSession(data: any) {
    return request({
      url: '/api/v1/message/history',
      params: data,
      method: 'GET'
    })
  }
  // 发送会话
  sendSession(data: any) {
    return request({
      url: '/api/v1/send',
      data,
      method: 'POST'
    })
  }
}
export default new sessionApi()
