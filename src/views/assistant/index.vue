<template>
  <!-- 弹窗 -->
  <el-drawer
    v-model="drawer"
    direction="ltr"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <CreateForm
      ref="childRef"
      :data="formData"
      :type="createType"
      @handleClose="handleCloseCreateForm"
    />
  </el-drawer>
  <!-- 内容 -->
  <div>
    <div class="top">
      <div class="top-title">
        <!-- {{ isPlayground ? 'Playground' : 'Assistant' }} -->
      </div>
      <div class="top-right">
        <div class="top-btn" v-if="tableData.length">
          <el-button type="primary" v-show="!isPlayground" @click="createFn">create</el-button>
          <el-button type="info" v-show="isPlayground" @click="backFn">back</el-button>
        </div>
      </div>
    </div>
    <!-- 应用列表 -->
    <div v-show="!isPlayground && tableData.length">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column align="center" prop="name" label="Name" width="180" />
        <el-table-column align="center" prop="introductions" label="Instructions" />
        <el-table-column align="center" prop="id" label="ID" />
        <el-table-column align="center" prop="createdTime" label="Date Created">
          <template #default="scope">{{ formatTimestamp(scope.row.created_at) }}</template>
        </el-table-column>
        <el-table-column align="center" label="Operate" width="100">
          <template #default="scope">
            <div style="display: flex; justify-content: space-between">
              <el-tooltip effect="dark" content="删除" placement="top-start">
                <el-popconfirm
                  title="您确定要删除该应用吗?"
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  @confirm="deleteFn(scope.row)"
                >
                  <template #reference>
                    <el-icon><Delete /></el-icon>
                  </template>
                </el-popconfirm>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top-start">
                <el-icon @click="editFn(scope.row)"><Edit /></el-icon>
              </el-tooltip>
              <el-tooltip effect="dark" content="前去体验" placement="top-start">
                <el-icon @click="toPlayground(scope.row)"><Promotion /></el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="create-box" v-show="!tableData.length">
      <div style="margin-bottom: 20px">Create an assistant</div>
      <el-button type="primary" size="small" v-if="!isPlayground" @click="createFn">创建</el-button>
    </div>
    <div v-if="isPlayground">
      <ChatView :formData="formData" @handleEdit="handleChatEdit" ref="chatViewRef" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import CreateForm from './components/createForm.vue'
import ChatView from './components/chatView.vue'
import appApi from '@/api/app'
import { formatTimestamp } from '@/utils'
import { ElMessage } from 'element-plus'

// import { toggleDark } from '@/composables'
const drawer = ref(false)
const childRef = ref()

const handleClose = (done: () => void) => {
  done()
}
const isPlayground = ref(false)

// isPlayground.value = sessionStorage.getItem('isPlayground') === '0' ? false : true
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
  drawer.value = true
  await nextTick()
  console.log(' childRef.value.formEl', childRef.value.formEl)
}
// 删除
const deleteFn = async (row: any) => {
  try {
    await appApi.deleteApp({ id: row.id })
    ElMessage({
      message: '删除成功!',
      type: 'success'
    })
    getList()
  } catch (error) {
    console.log(error)
  }
}
const formData = ref({})
// 编辑
const editFn = (row: any) => {
  formData.value = { ...row }
  createType.value = 'edit'
  drawer.value = true
}

// 进入测试页面
const toPlayground = (row: any) => {
  formData.value = { ...row }
  isPlayground.value = true
  // sessionStorage.setItem('isPlayground', '1')
}
// 返回
const backFn = () => {
  isPlayground.value = false
  // sessionStorage.setItem('isPlayground', '0')
}
// 获取应用列表
const getList = async () => {
  try {
    let res = await appApi.listApp({
      page: 1,
      pageSize: 100
    })
    tableData.value = res.data.list
    // 聊天模块显示并且聊天模块有传回编辑id的时候将列表更新的数据重新赋值到传入聊天模块中
    if (isPlayground.value && chatEditFromId.value) {
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
  drawer.value = false
  getList()
}

// 聊天模块出发表单编辑
const handleChatEdit = async (formData: any) => {
  chatEditFromId.value = formData.id
  editFn(formData)
  console.log(' chatEditFromId.value ', chatEditFromId.value)
}

onMounted(() => {
  getList()
})
</script>
<style scoped lang="scss">
.top {
  width: 100%;
  height: 70px;
  border-bottom: 2px solid #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 30px;
  font-weight: bold;

  .top-title {
    margin-left: 50px;
  }
  .top-right {
    display: flex;
    align-items: center;
    padding-right: 20px;
  }
  .top-btn {
    margin-right: 50px;
  }
}
.create-box {
  width: 100%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
