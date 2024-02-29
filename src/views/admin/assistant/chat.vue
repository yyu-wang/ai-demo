<template>
  <div class="content">
    <div class="table-list">
      <div class="title"></div>
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
          <div class="title">THREAD</div>
          <!-- 聊天模块 -->
          <div class="chat-box">
            <div class="play-box" ref="chatRef" v-loading="messageLoading">
              <div class="play-main" v-if="msgList.length">
                <div class="item-box" v-for="(item, index) in msgList" :key="index">
                  <div style="margin-top: 10px">
                    <div class="type-box">
                      <div class="type-icon icon1">
                        <el-icon size="30"><UserFilled /></el-icon>
                      </div>

                      <div class="type1">{{ user }}</div>
                    </div>

                    <div class="item-content">
                      <MarkDownIt v-model="item.message" />
                    </div>
                  </div>
                  <div style="margin-top: 10px">
                    <div class="type-box">
                      <div class="type-icon icon2">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="robot"
                          class="svg-inline--fa fa-robot fa-2x w-20 h-20 m-auto"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 512"
                        >
                          <path
                            fill="currentColor"
                            d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z"
                          ></path>
                        </svg>
                      </div>
                      <div class="type2">EduGPT</div>
                    </div>

                    <div class="item-content">
                      <div v-if="item.result">
                        <MarkDownIt v-model="item.result" />
                        <el-button
                          v-if="isSenMsg && index === msgList.length - 1"
                          type="primary"
                          size="small"
                          @click="Retry"
                          >{{ t('assistant.chat.retry') }}</el-button
                        >
                      </div>
                      <div v-else>
                        <el-button type="success" text loading></el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 输入框 -->
            <div class="play-input-box">
              <el-input
                :input-style="{
                  paddingRight: '130px'
                }"
                v-model="msg"
                :autosize="{ minRows: 4, maxRows: 10 }"
                :resize="'none'"
                type="textarea"
                :placeholder="t('assistant.chat.inputPlaceholder')"
                @keydown.enter.prevent
                @keyup.enter="submit"
              />
              <div class="play-btn">
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
          <el-button type="primary" @click="beforeCreateSession">{{
            t('assistant.chat.createText')
          }}</el-button>
        </div>

        <div class="session-box" v-loading="sessionLoading">
          <div
            v-show="sessionList.length > 0"
            class="session-item"
            :class="[item.id == currentSessionId ? 'session-item-1' : 'session-item-2']"
            v-for="item in sessionList"
            :key="item.id"
          >
            <div class="session-text" @click.prevent="getMessageSession(item)">
              {{ item.name }}
            </div>

            <div @click="deleteSession(item.id)">
              <el-icon class="session-icon-del"><Delete /></el-icon>
            </div>
          </div>
          <div style="margin-top: 20px" v-show="sessionList.length <= 0">
            {{ t('assistant.chat.noData') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import MarkDownIt from '@/components/MarkDownIt/index.vue'
import sessionApi from '@/api/modules/session'

import { ElMessage, ElMessageBox } from 'element-plus'
import { chat_url } from '@/config/index'
import { useRoute } from 'vue-router'

import { setScrollTopFn } from './index'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { Base64 } from 'js-base64'
import assistantApi from '@/api/modules/assistant'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

const chatRef = ref()

interface msgItem {
  result: string
  message: string
}

const user = ref<string | null>(localStorage.getItem('userName'))

// assistant ID
const assistantId = ref<Number | undefined>()
// 当前会话id
const currentSessionId = ref<string>('')
// 聊天id
const threadAppId = ref<string>('')
// 截取用户发第一个消息的一部分来当作当前会话名称
const currentName = ref<string>('')
// 是否是新建会话
const isNewSession = ref<boolean>(false)
// 发送按钮是否可用
const isSubmit = ref<boolean>(false)

// 获取消息loading
const messageLoading = ref(false)
// 消息队列
const msgList = ref<msgItem[]>([])
// 消息输入框
const msg = ref<string>('')
// 暂时存的会话消息
const stagingMsg = ref()
// 是否发送消息失败
const isSenMsg = ref<boolean>(false)

// 会话列表loading
const sessionLoading = ref(false)
// 会话列表
const sessionList = ref<sessionItem[]>([])
interface sessionItem {
  name: string
  id: string
}

// 提交发送消息
const submit = () => {
  if (assistantId.value) {
    //判断是否是当前助手id
    let trimMsg = msg.value.trim()
    if (trimMsg) {
      stagingMsg.value = trimMsg
      //判断当前消息框是否输入了消息
      let obj = {
        message: msg.value,
        result: ''
      }
      msgList.value.push(obj)
      msg.value = ''
      // 按钮不可用及loading生效
      isSubmit.value = true
      // 设置滚动条位置
      setScrollTopFn(chatRef, nextTick)

      if (!currentName.value && !currentSessionId.value) {
        currentName.value = stagingMsg.value.substring(0, 15)
        createSession()
      } else {
        sedMessage()
      }
    } else {
      ElMessage({
        message: t('assistant.chat.inputPlaceholder'),
        type: 'error'
      })
    }
  } else {
    ElMessage({
      message: 'Please create an assistant first!',
      type: 'error'
    })
  }
}

// 发送失败重连参数
const Retry = () => {
  isSenMsg.value = true
  isSubmit.value = true
  msgList.value[msgList.value.length - 1].result = ''
  sedMessage()
}

// 发送会话
const sedMessage = async () => {
  try {
    // 连接see
    console.log('threadAppId', threadAppId.value)
    fetchEventSource(chat_url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ threadAppId: threadAppId.value }),

      async onopen(response) {
        console.log('onopen-fetchEventSource', response)
      },

      onmessage(msg) {
        let obj = JSON.parse(msg.data)

        // 第一次创建一个新对象在聊天列表中
        isSubmit.value = false
        const messageText = Base64.decode(obj.message) // 获取收到的消息文本
        console.log('messageText', messageText)

        msgList.value[msgList.value.length - 1].result =
          msgList.value[msgList.value.length - 1].result + messageText
        isSenMsg.value = false
        setScrollTopFn(chatRef, nextTick)
      },
      onclose() {
        console.log('onclose-fetchEventSource', onclose)
      },
      onerror(err) {
        console.log('onerror-fetchEventSource', err)
        // if (!msgList.value[msgList.value.length - 1].result) {
        //   msgList.value[msgList.value.length - 1].result = 'network error'
        // }
      }
    })
  } catch (error) {
    console.log('fetchEventSource===>', error)
  }

  try {
    // 发送消息
    await sessionApi.sendSession({
      assistantId: assistantId.value, //当前助手的id
      threadId: currentSessionId.value, //当前会话的id
      text: stagingMsg.value
    })
  } catch (error) {
    // 发送会话失败后将输入框按钮释放，并在页面中展示错误信息
    isSubmit.value = false
    msgList.value[msgList.value.length - 1].result = 'network error'
    isSenMsg.value = true
    console.log('error===>', error)
  }
}
// 选择助手
const slectAssistant = (e: any) => {
  assistantId.value = Number(e.id)
  // 切换助手前将会话参数重置==等同于新建会话
  beforeCreateSession()
  sessionLoading.value = true
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
  } catch (error) {
    console.log('getList', error)
  }
}

// 按钮新建会话前
const beforeCreateSession = () => {
  currentName.value = ''
  currentSessionId.value = ''
  isNewSession.value = false
  isSubmit.value = false
  stagingMsg.value = ''
  msgList.value = []
}

// 新建会话
const createSession = async () => {
  try {
    let id = assistantId.value
    let name = currentName.value
    if (id) {
      interface SessionResponse {
        code: number
        message: string
      }
      let res: SessionResponse = await sessionApi.createSession({
        assistantId: id,
        name
      })

      if (res.code !== 200) {
        ElMessage({
          message: res.message,
          type: 'error'
        })
      } else {
        isNewSession.value = true

        getSessionList()
      }
    }
  } catch (error) {
    ElMessage({
      message: 'Create session failed!',
      type: 'error'
    })
    console.log('createSession', error)
  }
}
// 获取会话列表
const getSessionList = async () => {
  try {
    let id = assistantId.value
    if (id) {
      let res = await sessionApi.listSession({ assistantId: id, page: 1, pageSize: 1000 })
      sessionList.value = res.data.list
      sessionLoading.value = false

      // 如果是新创建的会话的话当前的列表的最新会话id就是当前会话的id
      if (isNewSession.value) {
        currentSessionId.value = sessionList.value[0].id
        threadAppId.value = sessionList.value[0].threadAppId

        // 开始创建的时候就将第一条消息和搭配拿到的会话id一起发送回去
        sedMessage()
      }
    }
  } catch (error) {
    console.log('getSessionList', error)
  }
}
// 删除会话
const deleteSession = (id: string) => {
  ElMessageBox.confirm(t('tip.deleteText'), t('tip.tip'), {
    confirmButtonText: t('tip.confirmButtonText'),
    cancelButtonText: t('tip.cancelButtonText')
  })
    .then(async () => {
      try {
        await sessionApi.deleteSession({ id })
        ElMessage({
          message: 'success!',
          type: 'success'
        })
        getSessionList()
        beforeCreateSession()
      } catch (error) {
        console.log('deleteSession', error)
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Cancel'
      })
    })
}
// 获取会话聊天记录信息
const getMessageSession = async (item: any) => {
  try {
    msgList.value = []
    currentSessionId.value = item.id
    threadAppId.value = item.threadAppId
    messageLoading.value = true
    if (item.id) {
      let res = await sessionApi.messageList({ threadId: item.id, page: 1, pageSize: 1000 })
      msgList.value = res.data.list

      nextTick(() => {
        if (chatRef.value) {
          chatRef.value.scrollTop = chatRef.value.scrollHeight
        }
      })
      setScrollTopFn(chatRef, nextTick)
      messageLoading.value = false

      // console.log('chatRef', chatRef)
    }
  } catch (error) {
    console.log('getMessageSession', error)
  }
}

onMounted(() => {
  beforeCreateSession()

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
@import './chat.scss';
</style>
