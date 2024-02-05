<template>
  <!-- 弹窗 -->

  <el-dialog
    v-model="isDialog"
    :title="createType"
    width="500"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <CreateForm
      ref="childRef"
      :data="formData"
      :type="createType"
      :who-is-type="'assistant'"
      @handleClose="handleCloseCreateForm"
    />
  </el-dialog>
  <!-- 内容 -->
  <div v-loading="!token">
    <div class="top" v-if="tableData.length">
      <div class="top-title">
        <img class="title-img" src="../../assets//images/edugpt_logo.png" alt="" />
      </div>
      <div class="top-right">
        <div class="top-btn">
          <el-button class="btn" type="primary" @click="createFn">create</el-button>
        </div>
      </div>
    </div>
    <!-- 应用列表 -->
    <div v-show="tableData.length" class="tableData-box">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column align="center" prop="name" label="Name" width="180" />
        <el-table-column align="center" prop="instructions" label="Instructions" />
        <el-table-column align="center" prop="id" label="ID" />
        <el-table-column align="center" prop="createdTime" label="Date Created">
          <template #default="scope">{{ formatTimestamp(scope.row.created_at) }}</template>
        </el-table-column>
        <el-table-column align="center" label="Operate" width="100">
          <template #default="scope">
            <div style="display: flex; justify-content: space-between">
              <el-tooltip effect="dark" content="Delete" placement="top-start">
                <el-icon size="20" @click="deleteFn(scope.row)"><Delete /></el-icon>
              </el-tooltip>
              <el-tooltip effect="dark" content="Edit" placement="top-start">
                <el-icon size="20" @click="editFn(scope.row)"><Edit /></el-icon>
              </el-tooltip>
              <el-tooltip effect="dark" content="To Playground" placement="top-start">
                <el-icon size="20" @click="toPlayground(scope.row)"><Promotion /></el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="create-box" v-show="!tableData.length">
      <div class="create-item" @click="createFn">
        <el-icon size="50" color="#1b9f0a"><OfficeBuilding /></el-icon>
        <div class="item-text">
          <span>Assistant</span>
          <span class="sp">Create an assistant</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import CreateForm from '@/components/CreateFrom/index.vue'
import assistantApi from '@/api/assistant'
import { formatTimestamp } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useSystemStore } from '@/stores/system'
import { loginSystemStore } from '@/stores/login'

const loginStore = loginSystemStore()
const userStore = useSystemStore()

const router = useRouter()
const route = useRoute()

// import { toggleDark } from '@/composables'
const isDialog = ref(false)
const childRef = ref()

const handleClose = (done: () => void) => {
  done()
}

// 应用列表
const tableData = ref([])
// 编辑类型
const createType = ref('create')
// 聊天模块打开编辑的聊天记录id
const chatEditFromId = ref(null)

// 创建
const createFn = async () => {
  formData.value = {}
  createType.value = 'create'
  isDialog.value = true
  await nextTick()
}
// 删除
const deleteFn = async (row: any) => {
  ElMessageBox.confirm('Are you sure you want to delete this session?', 'Warning', {
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  })
    .then(async () => {
      try {
        await assistantApi.deleteAssistant({ id: row.id })
        ElMessage({
          message: 'success!',
          type: 'success'
        })
        getList()
      } catch (error) {
        console.log(error)
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Cancel'
      })
    })
}
const formData = ref({})
// 编辑
const editFn = (row: any) => {
  formData.value = { ...row }
  createType.value = 'edit'
  isDialog.value = true
}

// 进入测试页面
const toPlayground = (row: any) => {
  formData.value = { ...row }
  let { id } = row
  // userStore.setMenuActive('/chat')
  router.push({
    name: 'Playground',
    query: {
      id
    }
  })
}

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

    // 聊天模块显示并且聊天模块有传回编辑id的时候将列表更新的数据重新赋值到传入聊天模块中
    if (chatEditFromId.value) {
      tableData.value.forEach((item: any) => {
        if (item.id === chatEditFromId.value) {
          formData.value = { ...item }
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}
// 创建编辑表单后关闭
const handleCloseCreateForm = () => {
  isDialog.value = false
  getList()
}
const token = ref()
// 获取地址中的信息实现默认登录
//http://localhost:5173/assistant?name=wangyu&password=123456
;(async () => {
  try {
    let { name, password } = route.query as any as { name: string; password: string }
    console.log('name', name)
    console.log('password', password)
    if (name && password) {
      let res = await loginStore.login({ userName: name, password })
      token.value = res.token
      getList()
    }
  } catch (error) {
    console.log('error-->', error)
  }
})()
// onMounted(() => {})
</script>
<style scoped lang="scss">
.top {
  width: 100%;
  height: 70px;
  // border-bottom: 2px solid #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 30px;
  font-weight: bold;

  .top-title {
    margin-left: 50px;
    .title-img {
      height: 55px;
      width: auto;
      background-size: auto;
    }
  }
  .top-right {
    display: flex;
    align-items: center;
    padding-right: 20px;
  }
  .top-btn {
    margin-right: 50px;
    .btn {
      background: linear-gradient(180deg, #4460dc, #6f89fe);
      border: none;
    }
  }
}
.tableData-box {
  width: 90%;
  height: 89vh;
  overflow: auto;
  margin: 0 auto;
  border-radius: 10px;
  // padding: 10px;
  :deep(.el-table th.el-table__cell) {
    background-color: #fafafa !important;
  }
  :deep(.el-table tr) {
    background-color: #fafafa !important;
  }
}
.create-box {
  width: 100%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .create-item {
    width: 300px;
    height: 270px;
    background-color: #ffffff80;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 0 0 0;
    .item-text {
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 20px;
      font-weight: bold;
      .sp {
        font-size: 16px;
        font-weight: 500;
        margin-top: 20px;
      }
    }
  }
}
</style>
