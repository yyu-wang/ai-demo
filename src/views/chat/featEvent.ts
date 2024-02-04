import { fetchEventSource } from '@microsoft/fetch-event-source'
import { Base64 } from 'js-base64'
// see通信模块
export function EventSource(data: any) {
  fetchEventSource(data.chat_url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token')
    },

    async onopen(response) {
      console.log('onopen-fetchEventSource', response)
    },

    onmessage(msg) {
      let obj = JSON.parse(msg.data)
      console.log('data', data)
      // 第一次创建一个新对象在聊天列表中
      data.isSubmit.value = false
      console.log(' data.isSubmit.value', data.isSubmit.value)

      const messageText = Base64.decode(obj.message) // 获取收到的消息文本
      console.log('messageText', messageText)
      console.log('msgList----------', data.msgList.value[data.msgList.value.length - 1])

      data.msgList.value[data.msgList.value.length - 1].result =
        data.msgList.value[data.msgList.value.length - 1].result + messageText
    },
    onclose() {
      console.log('onclose-fetchEventSource', onclose)
    },
    onerror(err) {
      data.msgList.value[data.msgList.value.length - 1].result = 'network error'
      console.log('onerror-fetchEventSource', err)
    }
  })
}
