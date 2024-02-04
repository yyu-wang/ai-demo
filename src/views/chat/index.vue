<template>
  <div class="content">
    <div class="table-list">
      <div class="title">Assistants</div>
      <div class="table-item-box">
        <div
          v-for="(item, index) in tableData"
          :key="index"
          :class="[assistantId == item.id ? 'table-item-b' : 'table-item-a', 'table-item']"
          @click="slectAssistant(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="playground">
      <div class="playground-left">
        <div class="right-main">
          <div class="p-top">
            <div class="left">THREAD</div>
            <div class="right">
              <!-- <el-button type="danger" plain size="small" @click="clearFn">清除</el-button> -->
            </div>
          </div>
          <!-- 聊天模块 -->
          <div class="chat-box">
            <div class="play-main" ref="chatRef" v-if="msgList.length">
              <div class="item-box" v-for="(item, index) in msgList" :key="index">
                <div>
                  <div class="type1">User</div>
                  <div class="item-content1">
                    {{ item.message }}
                  </div>
                </div>
                <div style="margin-top: 10px">
                  <div class="type2">GPT</div>

                  <div class="item-content">
                    <div v-if="item.result"><MarkDownIt v-model="item.result" /></div>
                    <div v-else><el-button type="success" text loading></el-button></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="play-tip" v-if="!msgList.length">How can I help you ？</div>
            <div class="play-input-box">
              <el-input
                :input-style="{
                  paddingRight: '130px'
                }"
                v-model="msg"
                :autosize="{ minRows: 4, maxRows: 10 }"
                type="textarea"
                placeholder="Enter your message..."
                @keyup.enter="submit"
              />
              <div class="play-btn">
                <!-- <el-upload
                  class="upload-demo"
                  :action="file_url"
                  :headers="headers"
                  :show-file-list="false"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :limit="1"
                  :on-exceed="handleExceed"
                >
                  <el-icon size="20"><Paperclip /></el-icon>
                </el-upload> -->

                <el-button
                  type="primary"
                  @click="submit"
                  :disabled="isSubmit"
                  size="small"
                  :loading="isSubmit"
                  ><el-icon size="16"><Promotion /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 会话列表 -->
      <div class="playground-right">
        <div class="playground-right-btn">
          <el-button type="primary" @click="beforeCreateSession">Create a new session</el-button>
        </div>

        <div class="session-box">
          <div
            class="session-item"
            :class="[item.id === currentId ? 'session-item-1' : 'session-item-2']"
            v-for="item in sessionList"
            :key="item.id"
          >
            <div class="session-text" @click.prevent="getMessageSession(item.id)">
              {{ item.name }}
            </div>
            <el-popconfirm
              title="Are you sure you want to delete this session?"
              @click.stop
              @confirm="deleteSession(item.id)"
            >
              <template #reference>
                <el-icon><Delete /></el-icon>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import MarkDownIt from '@/components/MarkDownIt/index.vue'
import sessionApi from '@/api/session'

import { ElMessage } from 'element-plus'
import { chat_url } from '@/config/index'
import { useRoute } from 'vue-router'
// import { EventSource } from './featEvent'
import { setScrollTopFn } from './index'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { Base64 } from 'js-base64'
import assistantApi from '@/api/assistant'
const route = useRoute()

const chatRef = ref()

interface msgItem {
  result: string
  message: string
}
// assistant ID
const assistantId = ref<Number | undefined>()
// 当前会话id
const currentId = ref<string>('')
// 截取用户发第一个消息的一部分来当作当前会话名称
const currentName = ref<string>('')
// 是否是新建会话
const isNewSession = ref<boolean>(false)
// 发送按钮是否可用
const isSubmit = ref<boolean>(false)

// 消息队列
const msgList = ref<msgItem[]>([])
// 消息输入框
const msg = ref()

// 文件选择
// 校验
// const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
//   ElMessage.warning(
//     `The limit is 3, you selected ${files.length} files this time, add up to ${
//       files.length + uploadFiles.length
//     } totally`
//   )
// }
// // 上传成功
// const handleSuccess: UploadProps['onSuccess'] = (response: any) => {
//   let res = response.data[0]

//   console.log('fileList.value', res)
// }
// // 上传失败
// const handleError: UploadProps['onSuccess'] = (error: Error) => {
//   ElMessage({
//     message: 'error!',
//     type: 'error'
//   })
//   console.log('error', error)
// }

// 发送消息
const submit = () => {
  if (assistantId.value) {
    //判断是否是当前助手id
    if (msg.value) {
      //判断当前消息框是否输入了消息
      let obj = {
        message: msg.value,
        result: ''
      }

      msgList.value.push(obj)
      console.log('msgList', msgList.value)
      msg.value = ''
      // 按钮不可用及loading生效
      isSubmit.value = true
      // 设置滚动条位置
      setScrollTopFn(chatRef, nextTick)
      if (!currentName.value && !currentId.value) {
        currentName.value = msg.value.substring(0, 15)
        createSession()
      } else {
        sedMessage()
      }
    }
  } else {
    ElMessage({
      message: 'Please create an assistant first!',
      type: 'error'
    })
  }
}

// 发送会话
const sedMessage = async () => {
  let text = msg.value
  await sessionApi.sendSession({
    assistantId: assistantId.value, //当前助手的id
    threadId: currentId.value, //当前会话的id
    text
  })
  msg.value = ''
}

// 会话列表
const sessionList = ref<sessionItem[]>([])

interface sessionItem {
  name: string
  id: string
}

// 按钮新建会话前
const beforeCreateSession = () => {
  currentName.value = ''
  currentId.value = ''
  isNewSession.value = false
  msgList.value = []
}

// 新建会话
const createSession = async () => {
  try {
    let id = assistantId.value
    let name = currentName.value
    if (id) {
      await sessionApi.createSession({ assistantId: id, name })
      isNewSession.value = true
      getSessionList()
    }
  } catch (error) {
    ElMessage({
      message: 'Create session failed!',
      type: 'error'
    })
    console.log(error)
  }
}
// 获取会话列表
const getSessionList = async () => {
  try {
    let id = assistantId.value
    if (id) {
      let res = await sessionApi.listSession({ assistantId: id, page: 1, pageSize: 1000 })
      sessionList.value = res.data.list
      // 如果是新创建的会话的话当前的列表的最新会话id就是当前会话的id
      if (isNewSession.value) {
        currentId.value = sessionList.value[0].id
        // 开始创建的时候就将第一条消息和搭配拿到的会话id一起发送回去
        sedMessage()
      }
    }
  } catch (error) {
    console.log(error)
  }
}
// 删除会话
const deleteSession = async (id: string) => {
  try {
    await sessionApi.deleteSession({ id })
    ElMessage({
      message: 'success!',
      type: 'success'
    })
    getSessionList()
    beforeCreateSession()
  } catch (error) {
    console.log(error)
  }
}
// 获取会话聊天记录信息
const getMessageSession = async (id: string) => {
  try {
    msgList.value = []
    if (id) {
      let res = await sessionApi.messageList({ threadId: id, page: 1, pageSize: 1000 })
      msgList.value = res.data.list
      currentId.value = id
      nextTick(() => {
        if (chatRef.value) {
          chatRef.value.scrollTop = chatRef.value.scrollHeight
        }
      })
      setScrollTopFn(chatRef, nextTick)
      // console.log('chatRef', chatRef)
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * see推送会话
 * chat_url 推流地址
 * msgList 会话列表
 * isSubmit 发送按钮状态
 */
// EventSource({ chat_url, msgList, isSubmit })
fetchEventSource(chat_url, {
  method: 'GET',
  headers: {
    Authorization: 'Bearer ' + sessionStorage.getItem('token')
  },

  async onopen(response) {
    console.log('onopen-fetchEventSource', response)
  },

  onmessage(msg) {
    let obj = JSON.parse(msg.data)

    // 第一次创建一个新对象在聊天列表中
    isSubmit.value = false
    console.log(' data.isSubmit.value', isSubmit.value)

    const messageText = Base64.decode(obj.message) // 获取收到的消息文本
    console.log('messageText', messageText)
    console.log('msgList----------', msgList.value[msgList.value.length - 1])

    msgList.value[msgList.value.length - 1].result =
      msgList.value[msgList.value.length - 1].result + messageText
  },
  onclose() {
    console.log('onclose-fetchEventSource', onclose)
  },
  onerror(err) {
    if (msgList.value[msgList.value.length - 1].result) {
      msgList.value[msgList.value.length - 1].result = 'network error'
    }

    console.log('onerror-fetchEventSource', err)
  }
})

// 选择助手
const slectAssistant = (e: any) => {
  assistantId.value = Number(e.id)
  msgList.value = []
  getSessionList()
}

// 助手列表
const tableData = ref()
// 获取助手列表
const getList = async () => {
  try {
    let res = await assistantApi.listAssistant({
      page: 1,
      pageSize: 100
    })
    tableData.value = res.data.list

    // for (let index = 0; index < 20; index++) {
    //   tableData.value.push({ id: 0 })
    // }
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  currentName.value = ''
  currentId.value = ''
  isSubmit.value = false
  msgList.value = []
  let { id } = route.query as any as { id: string }
  getList()
  if (id) {
    assistantId.value = Number(id)
    getSessionList()
  } else {
    assistantId.value = undefined
  }
})
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: row;
  height: 100%;

  .table-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 400px;
    height: 100%;

    .title {
      height: 100px;
      text-align: center;
      display: flex;
      align-items: center;
      font-size: 30px;
      font-weight: bold;
    }
    .table-item-box {
      background: #ffffff;
      width: 360px;
      height: calc(100% - 150px);
      border-radius: 10px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;

      .table-item {
        background: $bg-color;
        width: 90%;
        padding: 10px 0;
        text-align: center;
        margin-top: 10px;
        font-size: 14px;
        border-radius: 10px;
        cursor: pointer;
      }
      .table-item-a {
        background: $bg-color;
        color: #000;
      }
      .table-item-b {
        background: $basic-color;
        color: #ffffff;
      }
      .table-item:hover {
        background: $basic-color;
        color: #ffffff;
      }
    }
  }
  .playground {
    width: calc(100% - 400px);
    height: 100%;
    display: flex;
    flex-direction: row;

    .playground-left {
      width: calc(100% - 300px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .right-main {
        margin: 0 auto;
        width: 70%;
        height: calc(100% - 50px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .p-top {
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 20px 0;
          font-weight: bold;

          .left {
            margin-left: 50px;
            font-size: 16px;
          }
        }
        .chat-box {
          flex: 1;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .play-main {
            margin: 0 auto;
            padding-bottom: 20px;
            width: 100%;
            flex-wrap: wrap;
            height: 720px;
            overflow-y: auto;
            background: #ffffff;
            border-radius: 10px;
            padding: 10px;

            .item-box {
              display: flex;
              flex-direction: column;
              margin: 0 10px;

              .type1 {
                font-size: 16px;
                font-weight: bold;
                color: green;
              }
              .type2 {
                font-size: 16px;
                font-weight: bold;
                color: $font-color;
              }
              .item-content1 {
                font-size: 14px;
                color: #333333;
                line-height: 30px;
                background: $bg-color;
                border-radius: 6px;
                padding: 0 10px;
                margin-top: 10px;
              }
              .item-content {
                font-size: 14px;
                color: #333333;
                background: $bg-color;
                border-radius: 6px;
                .chat-content-text {
                  font-size: 14px;
                  color: #676767;
                }
              }
            }
          }
          .play-tip {
            margin: 0 auto;
            padding-bottom: 20px;
            width: calc(100% - 100px);
            height: 600px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
          }
          .play-input-box {
            width: calc(100% + 20px);
            margin: 0 auto;
            position: relative;
            // padding: 10px;
            .play-btn {
              width: 50px;
              position: absolute;
              right: 20px;
              top: calc(50% - 20px);
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
          }
        }
      }
    }

    .playground-right {
      width: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 20px;
      .playground-right-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
      }
      .session-box {
        width: 360px;
        height: calc(100vh - 150px);
        display: flex;
        align-items: center;
        flex-direction: column;
        overflow: auto;
        background: #ffffff;
        border-radius: 10px;

        .session-item {
          width: calc(90% - 20px);
          padding: 10px;
          display: flex;
          justify-content: space-between;
          font-size: 15px;
          cursor: pointer;
          border-radius: 10px;
          margin-top: 10px;
          .session-text {
            width: 200px;
            height: 20px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .session-item-1 {
          background-color: $basic-color;
          color: #ffffff;
        }
        .session-item-2 {
          background: $bg-color;
          color: #222222;
        }
      }

      .session-item:hover {
        background-color: $basic-color;
        color: #ffffff;
      }
    }
  }
}

/* 当视口宽度小于1200px时，隐藏左边的内容表单 */
@media screen and (max-width: 1200px) {
  .table-list {
    display: none !important;
  }
  .playground {
    width: 100% !important;
  }
}
@media screen and (max-width: 800px) {
  .playground-left {
    width: 100% !important;
  }
  .playground-right {
    display: none !important;
  }
}
</style>
