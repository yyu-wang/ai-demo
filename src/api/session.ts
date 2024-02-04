import request from './index'

class sessionApi {
  // 创建会话
  createSession(data: any) {
    return request({
      url: '/api/v1/chat/thread/create',
      data,
      method: 'POST'
    })
  }
  // 会话列表
  listSession(data: any) {
    return request({
      url: '/api/v1/chat/thread/list',
      params: data,
      method: 'GET'
    })
  }
  // 删除会话
  deleteSession(data: any) {
    return request({
      url: '/api/v1/chat/thread/delete',
      data,
      method: 'POST'
    })
  }
  // 当前会话的聊天记录
  messageList(data: any) {
    return request({
      url: '/api/v1/chat/thread/message/list',
      params: data,
      method: 'GET'
    })
  }
  // 发送会话
  sendSession(data: any) {
    return request({
      url: '/api/v1/chat/thread/message',
      data,
      method: 'POST'
    })
  }
}
export default new sessionApi()
