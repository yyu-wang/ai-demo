<template>
  <div class="main">
    <div class="main-content">
      <el-form
        v-if="!isFunction"
        ref="createForm"
        :rules="fromRules"
        :model="formData"
        label-width="auto"
        label-position="top"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="formData.name" placeholder="Enter a user friendly name" />
        </el-form-item>
        <el-form-item label="introductions" prop="introductions">
          <el-input
            v-model="formData.introductions"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 10 }"
            placeholder="You are a helpful assistant"
          />
        </el-form-item>

        <el-form-item label="Model" prop="model">
          <el-select v-model="formData.model" placeholder="Select">
            <el-option
              v-for="item in modelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <div class="formTools">
          <div class="tools">Tools</div>
          <div class="tool-item">
            <div>Functions</div>
            <div>
              <el-button class="tool-add" size="small" @click="funAdd" text>Add</el-button>
            </div>
          </div>
          <div class="tool-item">
            <div>Code interpreter</div>
            <div>
              <el-switch
                v-model="formData.codeInterpreter"
                :active-value="1"
                :inactive-value="0"
                style="--el-switch-on-color: #10a37f"
              />
            </div>
          </div>
          <div class="tool-item">
            <div>Retrieval</div>
            <div>
              <el-switch
                v-model="formData.retrieval"
                :active-value="1"
                :inactive-value="0"
                style="--el-switch-on-color: #10a37f"
              />
            </div>
          </div>
          <div class="tool-item">
            <div>FILES</div>
            <div>
              <el-upload
                class="upload-demo"
                :action="file_url"
                :headers="headers"
                multiple
                :show-file-list="false"
                :on-success="handleSuccess"
                :on-error="handleError"
                :limit="3"
                :on-exceed="handleExceed"
              >
                <el-button class="tool-add" size="small" text>Add</el-button>
              </el-upload>
            </div>
          </div>
          <div class="files">
            <div class="file-item" v-for="(item, index) in fileList" :key="index">
              <div class="file">
                {{ item.fileName }}
              </div>
              <el-icon @click="delFile(index)">
                <Delete />
              </el-icon>
            </div>
          </div>
        </div>
      </el-form>

      <div v-else>
        <div class="flx-center mr-b">
          <el-button size="small" icon="Back" @click="funAdd">Add Function</el-button>
        </div>
        <el-input
          v-model="formData.functions"
          placeholder="Please enter JSON"
          :rows="30"
          type="textarea"
        />
      </div>
      <div class="main-btn">
        <el-button class="btn" @click="revert">重置</el-button>
        <el-button class="btn" type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, toRefs, reactive, defineEmits, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadProps, ElForm } from 'element-plus'
import { file_url } from '@/config/index'
import appApi from '@/api/app'
const headers = {
  Authorization: 'Bearer ' + sessionStorage.getItem('token')
}
type FormInstance = InstanceType<typeof ElForm>
const createForm = ref<FormInstance>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits()

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  type: {
    type: String,
    default: 'create'
  }
})
interface formDataType {
  name?: string
  introductions?: string
  model?: number
  functions?: string
  codeInterpreter?: number
  retrieval?: number
}

// 表单信息
const formData = ref<formDataType>({})
// 文件列表
const fileList = ref<fileType[]>([])

// 重置
const revert = async () => {
  await nextTick()
  if (!createForm.value) return
  createForm.value.resetFields()
  formData.value = {
    name: '',
    introductions: '',
    model: undefined,
    functions: '',
    codeInterpreter: 0,
    retrieval: 0
  }
  fileList.value = []
}

// 编辑数据处理
const editDataFn = (data: any) => {
  let { name, introductions, model, tools } = data

  formData.value = {
    name,
    introductions,
    model,
    functions: tools.functions,
    codeInterpreter: tools.code_interpreter,
    retrieval: tools.retrieval
  }
  fileList.value = tools.files ? tools.files : []
}
watchEffect(() => {
  // 使用 toRefs 转换为 ref 对象
  const { data, type } = toRefs(props)

  if (type.value === 'create') {
    revert()
  } else {
    editDataFn(data.value)
  }
})

const fromRules = reactive({
  name: [{ required: true, message: '请输入', trigger: 'blur' }],
  introductions: [{ required: true, message: '请输', trigger: 'blur' }],
  model: [{ required: true, message: '请输', trigger: 'change' }]
})
// const isSave = ref(false)

// watch(
//   () => ({
//     name: formData.value.name,
//     introductions: formData.value.introductions,
//     model: formData.value.model
//   }),
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   (newValue, oldValue) => {
//     if (newValue.name && newValue.introductions && newValue.model) {
//       isSave.value = true
//     } else {
//       isSave.value = false
//     }
//   }
// )

const modelList = ref([
  {
    label: 'gpt-3.5-turbo-16k-0613',
    value: 1
  },
  {
    label: 'gpt-3.5-turbo-16k',
    value: 2
  },
  {
    label: 'gpt-3.5-turbo-1106',
    value: 3
  },
  {
    label: 'gpt-3.5-turbo-0613',
    value: 4
  },
  {
    label: 'gpt-3.5-turbo',
    value: 5
  }
])

// 函数选择
const isFunction = ref(false)
const funAdd = () => {
  isFunction.value = !isFunction.value
}
// 创建
const create = async () => {
  try {
    let { name, introductions, model, functions, codeInterpreter, retrieval } = formData.value
    let tools = {
      functions,
      code_interpreter: codeInterpreter,
      retrieval,
      files: fileList.value
    }

    let obj = {
      name,
      introductions,
      model,
      tools
    }
    await appApi.createApp(obj)
    ElMessage({
      message: '创建成功!',
      type: 'success'
    })
    emit('handleClose')
  } catch (error) {
    console.log(error)
  }
}
// 编辑
const edit = async () => {
  try {
    let { name, introductions, model, functions, codeInterpreter, retrieval } = formData.value
    let tools = {
      functions,
      code_interpreter: codeInterpreter,
      retrieval,
      files: fileList.value
    }
    let id = props.data.id
    let obj = {
      id,
      name,
      introductions,
      model,
      tools
    }
    await appApi.editApp(obj)
    ElMessage({
      message: '编辑成功!',
      type: 'success'
    })
    emit('handleClose')
  } catch (error) {
    console.log(error)
  }
}

//保存
const save = () => {
  if (!createForm.value) return
  createForm.value.validate(async (valid) => {
    if (!valid) return
    if (props.type === 'create') {
      create()
    } else {
      edit()
    }
  })
}
interface fileType {
  fileName: string
  path: string
}

//删除选中的文件
const delFile = (e: any) => {
  fileList.value.splice(e, 1)
}
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
  fileList.value.push(res)
  console.log('fileList.value', fileList.value)
}
// 上传失败
const handleError: UploadProps['onSuccess'] = (error: Error) => {
  ElMessage({
    message: '上传失败!',
    type: 'error'
  })
  console.log('error', error)
}
defineExpose({
  formEl: createForm
})
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;

  .main-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .formTools {
      display: flex;
      flex-direction: column;
      padding: 10px;

      .tools {
        color: #141414;
        border-bottom: 1px solid #ececf1;
        padding-bottom: 20px;
      }

      .tool-item {
        height: 50px;
        display: flex;
        align-items: center;
        color: #606266;
        justify-content: space-between;
        border-bottom: 1px solid #ececf1;
        font-size: 15px;
        .tool-add {
          color: #10a37f;
          font-weight: bold;
        }
      }

      .files {
        display: flex;
        flex-direction: column;
        margin-top: 10px;

        .file-item {
          font-size: 14px;
          color: #666666;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          border-radius: 10px;
          .file {
            width: 80%;
            height: 20px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .file-item:hover {
          background-color: #f2f2f2;
        }
      }
    }

    .main-btn {
      display: flex;
      margin-bottom: 60px;

      // padding: 0 20px;
      .btn {
        width: 46%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }
    }
    .mr-b {
      margin-bottom: 20px;
    }
  }
}
</style>
