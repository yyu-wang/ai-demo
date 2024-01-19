<template>
  <div class="playground">
    <div class="playground-left">
      <el-button type="primary" @click="beforeCreateSession" plain size="small">新建会话</el-button>
      <div class="session-box">
        <div class="session-item" v-for="item in sessionList" :key="item.id">
          <div class="session-text" @click.prevent="getMessageSession(item.id)">
            {{ item.name }}
          </div>
          <el-popconfirm
            title="您确定要删除该会话吗?"
            confirm-button-text="确定"
            cancel-button-text="取消"
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
    <div class="playground-right">
      <div class="right-main">
        <div class="p-top">
          <div class="left">THREAD</div>
          <div class="right">
            <el-button type="primary" plain size="small" @click="editFn">编辑</el-button>
            <!-- <el-button type="danger" plain size="small" @click="clearFn">清除</el-button> -->
          </div>
        </div>
        <!-- 聊天模块 -->
        <div class="chat-box">
          <div class="play-main">
            <div class="item-box" v-for="(item, index) in msgList" :key="index">
              <div>
                <div class="user">User</div>
                <div class="item-content">
                  {{ item.message }}
                </div>
              </div>
              <div style="margin-top: 10px">
                <div class="user">GPT</div>
                <div class="item-content">
                  {{ item.result }}
                </div>
              </div>
            </div>
          </div>
          <div class="play-input-box">
            <el-input
              :input-style="{
                paddingRight: '130px'
              }"
              v-model="msg"
              :autosize="{ minRows: 4, maxRows: 10 }"
              type="textarea"
              placeholder="请输入您的消息..."
            />
            <div class="play-btn">
              <el-upload
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
              </el-upload>

              <el-button type="primary" @click="submit" :disabled="isSubmit">发送</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineProps, defineEmits } from 'vue'
import sessionApi from '@/api/session'
import { ElMessage } from 'element-plus'
import { chat_url } from '@/config/index'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { file_url } from '@/config/index'
import type { UploadProps } from 'element-plus'
// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits()

const headers = {
  Authorization: 'Bearer ' + sessionStorage.getItem('token')
}
const props = defineProps({
  formData: {
    type: Object,
    default: () => {}
  }
})
onMounted(() => {})

interface msgItem {
  result: string
  message: string
}
// 当前会话id
const currentId = ref<string>('')
// 截取用户发第一个消息的一部分来当作当前会话名称
const currentName = ref<string>('')
// 是否是新建会话
const isNewSession = ref<boolean>(false)
// 消息队列
const msgList = ref<msgItem[]>([])
// 消息输入框
const msg = ref()
// 发送按钮是否禁用
const isSubmit = ref<boolean>(false)

// 文件选择
// 校验
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  )
}
// 上次成功
const handleSuccess: UploadProps['onSuccess'] = (response: any) => {
  let res = response.data[0]

  console.log('fileList.value', res)
}
// 上传失败
const handleError: UploadProps['onSuccess'] = (error: Error) => {
  ElMessage({
    message: '上传失败!',
    type: 'error'
  })
  console.log('error', error)
}
// 发送消息
const submit = () => {
  let obj = {
    message: msg.value,
    result: ''
  }
  msgList.value.push(obj)
  if (!currentName.value && !currentId.value) {
    currentName.value = msg.value.substring(0, 15)
    createSession()
  } else {
    sedMessage()
  }
}

// 发送会话
const sedMessage = async () => {
  let appId = props.formData.id
  let conversationId = currentId.value
  let text = msg.value
  await sessionApi.sendSession({
    appId,
    conversationId,
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
    let id = props.formData.id
    let name = currentName.value
    if (id) {
      await sessionApi.createSession({ appId: id, name })
      isNewSession.value = true
      getSessionList()
    }
  } catch (error) {
    console.log(error)
  }
}
// 获取会话列表
const getSessionList = async () => {
  try {
    let id = props.formData.id
    if (id) {
      let res = await sessionApi.listSession({ appId: id, page: 1, pageSize: 1000 })
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
      message: '删除成功!',
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
    if (id) {
      let res = await sessionApi.messageSession({ conversationId: id, page: 1, pageSize: 1000 })
      msgList.value = res.data.list
      currentId.value = id
    }
  } catch (error) {
    console.log(error)
  }
}
// 编辑
const editFn = () => {
  console.log('formData', props.formData)

  emit('handleEdit', props.formData)
}

// 清除
// const clearFn = () => {}

onMounted(() => {
  currentName.value = ''
  currentId.value = ''
  getSessionList()
})

fetchEventSource(chat_url, {
  method: 'GET',
  headers: {
    Authorization: 'Bearer ' + sessionStorage.getItem('token')
  },

  async onopen(response) {
    console.log('onopen', response)
  },

  onmessage(msg) {
    let obj = JSON.parse(msg.data)
    console.log('onmessage', obj)
    // 第一次创建一个新对象在聊天列表中
    if (obj.status === 'start') {
      isSubmit.value = true
    } else if (obj.status === 'end') {
      isSubmit.value = false
    }
    const messageText = obj.message // 获取收到的消息文本
    msgList.value[msgList.value.length - 1].result =
      msgList.value[msgList.value.length - 1].result + messageText
  },
  onclose() {
    console.log('onclose', onclose)
  },
  onerror(err) {
    console.log('onerror', err)
  }
})
</script>

<style lang="scss" scoped>
.playground {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  .playground-left {
    width: 300px;
    height: 100%;
    border-right: 1px solid #d9d9e3;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    .session-box {
      width: 100%;
      height: calc(100vh - 200px);
      margin-top: 20px;
      display: flex;
      align-items: center;
      flex-direction: column;
      overflow: auto;

      .session-item {
        width: 80%;
        padding: 6px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 15px;
        color: #222222;
        cursor: pointer;
        .session-text {
          width: 200px;
          height: 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .session-item:hover {
      background-color: #f2f2f2;
      border-radius: 20px;
    }
  }

  .playground-right {
    width: calc(100% - 300px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .right-main {
      margin: 0 auto;
      width: 70%;
      height: 100%;
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
          width: calc(100% - 100px);
          height: 600px;
          overflow-y: auto;

          .item-box {
            display: flex;
            flex-direction: column;
            margin-top: 10px;

            .user {
              font-size: 14px;
              font-weight: bold;
            }

            .item-content {
              font-size: 13px;
              color: #333333;
            }
          }
        }

        .play-input-box {
          width: 100%;
          margin: 0 auto;
          position: relative;
          .play-btn {
            width: 100px;
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
}
/* 当视口宽度小于900px时，隐藏左边的内容 */
@media screen and (max-width: 900px) {
  .playground-right {
    width: 100% !important;
    height: calc(100vh - 120px) !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .playground-left {
    display: none !important; /* 隐藏左边的内容 */
  }
}
@media screen and (max-width: 500px) {
  .right-main {
    width: 100% !important;
    .play-main {
      width: calc(100% - 10px) !important;
    }
  }
  .p-top {
    display: none !important; /* 隐藏左边的内容 */
  }
}
</style>
