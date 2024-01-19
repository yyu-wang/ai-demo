import request from './index'

class appApi {
  // 创建应用
  createApp(data: any) {
    return request({
      url: '/api/v1/app/create',
      data,
      method: 'POST'
    })
  }
  // 创建应用
  listApp(data: any) {
    return request({
      url: '/api/v1/app/list',
      params: data,
      method: 'GET'
    })
  }
  // 编辑应用
  editApp(data: any) {
    return request({
      url: '/api/v1/app/edit',
      data,
      method: 'POST'
    })
  }
  // 删除应用
  deleteApp(data: any) {
    return request({
      url: '/api/v1/app/delete',
      data,
      method: 'POST'
    })
  }
}
export default new appApi()
