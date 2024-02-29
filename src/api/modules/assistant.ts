import request from '../index'

class appApi {
  // 创建助手
  createAssistant(data: any) {
    return request({
      url: '/api/v1/chat/assistant/create',
      data,
      method: 'POST'
    })
  }
  // 助手列表
  listAssistant(data: any) {
    return request({
      url: '/api/v1/chat/assistant/list',
      params: data,
      method: 'GET'
    })
  }
  // 编辑助手
  editAssistant(data: any) {
    return request({
      url: '/api/v1/chat/assistant/edit',
      data,
      method: 'POST'
    })
  }
  // 删除助手
  deleteAssistant(data: any) {
    return request({
      url: '/api/v1/chat/assistant/delete',
      data,
      method: 'POST'
    })
  }
  // 获取助手详情
  getAssistant(id: any) {
    return request({
      url: '/api/v1/chat/assistant/' + id,
      method: 'GET'
    })
  }
  // 删除助手文件
  deleteAssistantFile(data: any) {
    return request({
      url: '/api/v1/chat/assistant/file/delete',
      data,
      method: 'post'
    })
  }
}
export default new appApi()
