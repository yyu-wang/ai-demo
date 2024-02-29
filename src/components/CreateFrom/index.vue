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
        <el-form-item :label="t('assistant.form.name')" prop="name">
          <el-input v-model="formData.name" :placeholder="t('assistant.form.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('assistant.form.instructions')" prop="instructions">
          <el-input
            v-model="formData.instructions"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 10 }"
            :placeholder="t('assistant.form.instructionsPlaceholder')"
          />
        </el-form-item>

        <el-form-item :label="t('assistant.form.model')" prop="model">
          <el-select v-model="formData.model" :placeholder="t('assistant.form.modelPlaceholder')">
            <el-option
              v-for="(item, index) in modelList"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <div class="formTools">
          <div class="tools">{{ t('assistant.form.tools') }}</div>
          <!-- <div class="tool-item">
            <div>Functions</div>
            <div>
              <el-button class="tool-add" size="small" @click="funAdd" text>Add</el-button>
            </div>
          </div> -->
          <div class="tool-item">
            <div>{{ t('assistant.form.codeInterpreter') }}</div>
            <div>
              <el-switch v-model="formData.codeInterpreter" style="--el-switch-on-color: #4460dc" />
            </div>
          </div>
          <div class="tool-item">
            <div>{{ t('assistant.form.retrieval') }}</div>
            <div>
              <el-switch
                :disabled="isSwitchDisabled"
                v-model="formData.retrieval"
                style="--el-switch-on-color: #4460dc"
              />
            </div>
          </div>
          <div class="tool-item">
            <div>{{ t('assistant.form.file') }}</div>
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
                <el-button class="tool-add" size="small" text>{{
                  t('assistant.form.add')
                }}</el-button>
              </el-upload>
            </div>
          </div>
          <div class="files">
            <div class="file-item" v-for="(item, index) in fileList" :key="index">
              <div class="file">
                {{ item.fileName }}
              </div>
              <el-icon @click="delFile(index, item.id)">
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
        <!-- <el-button class="btn" @click="revert">Revert</el-button> -->
        <el-button class="btn" type="primary" :loading="saveLoading" @click="save">{{
          $t('assistant.form.saveText')
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, watch, toRefs, defineEmits, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadProps, ElForm } from 'element-plus'
import { file_url } from '@/config/index'
import appApi from '@/api/modules/assistant'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const headers = {
  Authorization: 'Bearer ' + localStorage.getItem('token')
}
type FormInstance = InstanceType<typeof ElForm>
const createForm = ref<FormInstance>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits()

const props = defineProps({
  data: {
    type: Object,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    default: () => {}
  },
  type: {
    type: String,
    default: 'create'
  },
  whoIsType: {
    type: String,
    default: 'assistant'
  }
})
interface formDataType {
  name?: string
  instructions?: string
  model?: string
  functions?: string
  codeInterpreter?: boolean
  retrieval?: boolean
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
    instructions: '',
    model: '',
    functions: '',
    codeInterpreter: false,
    retrieval: false
  }
  fileList.value = []
}

// 编辑前数据回显处理
const editDataFn = (data: any) => {
  let { name, instructions, model, tools, files } = data
  let codeInterpreter = false
  let retrieval = false
  // 获取到的数据与展示所需要的数据类型不一致处理
  if (tools.length) {
    tools.forEach((item: any) => {
      if (item.type == 'code_interpreter') {
        codeInterpreter = true
      }
      if (item.type == 'retrieval') {
        retrieval = true
      }
    })
  } else {
    codeInterpreter = false
    retrieval = false
  }

  formData.value = {
    name,
    instructions,
    model,
    functions: tools.functions,
    codeInterpreter,
    retrieval
  }

  fileList.value = files
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

const isSwitchDisabled = ref(false)

watch(
  () => ({
    model: formData.value.model
  }),

  (newValue) => {
    if (newValue.model != 'gpt-3.5-turbo-1106') {
      isSwitchDisabled.value = true
    } else {
      isSwitchDisabled.value = false
    }
  }
)

const modelList = ref([
  'gpt-3.5-turbo-16k-0613',
  'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-1106',
  'gpt-3.5-turbo-0613',
  'gpt-3.5-turbo'
])

// 函数选择
const isFunction = ref(false)
const funAdd = () => {
  isFunction.value = !isFunction.value
}
// 创建编辑保存前数据处理
const createEditFn = () => {
  let { name, instructions, model, functions, codeInterpreter, retrieval } = formData.value

  let tools = []

  if (functions) {
    //json
    tools.push({ type: 'function', function: functions })
  }
  if (retrieval) {
    tools.push({ type: 'retrieval' })
  }
  if (codeInterpreter) {
    tools.push({ type: 'code_interpreter' })
  }
  let fileIds: any[string] = []
  fileList.value.forEach((item) => {
    fileIds.push((item as any).fileId)
  })
  console.log('fileIds', fileIds)

  let obj = {
    name,
    instructions,
    model,
    tools,
    fileIds: fileIds ? fileIds : []
  }
  return obj
}
// 保存按钮loadig
const saveLoading = ref<boolean>(false)
// 创建
const create = async () => {
  try {
    let obj = createEditFn()

    let res = await appApi.createAssistant(obj)
    saveLoading.value = false
    ElMessage({
      message: 'Create Success',
      type: 'success'
    })
    if (props.whoIsType === 'assistant') {
      emit('handleClose')
    }
    if (props.whoIsType === 'chat') {
      let { id } = res.data
      emit('handleGet', id)
    }
  } catch (error) {
    saveLoading.value = false
    ElMessage({
      message: 'Error',
      type: 'error'
    })

    console.log(error)
  }
}
// 编辑
const edit = async () => {
  try {
    let obj = createEditFn()
    let { id, assistantAppId } = props.data
    await appApi.editAssistant({ ...obj, id, assistantAppId })
    ElMessage({
      message: 'Edit Success',
      type: 'success'
    })
    saveLoading.value = false
    if (props.whoIsType === 'assistant') {
      emit('handleClose')
    } else {
      emit('handleGet', id)
    }
  } catch (error) {
    saveLoading.value = false
    ElMessage({
      message: 'Error',
      type: 'error'
    })
    console.log(error)
  }
}
const fromRules = ref()
//保存
const save = () => {
  fromRules.value = {
    name: [{ required: true, message: t('assistant.form.blurText'), trigger: 'blur' }],
    instructions: [{ required: true, message: t('assistant.form.blurText'), trigger: 'blur' }],
    model: [{ required: true, message: t('assistant.form.blurChange'), trigger: 'change' }]
  }
  if (!createForm.value) return
  createForm.value.validate(async (valid) => {
    if (!valid) return
    saveLoading.value = true
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
  id: number
}

//删除选中的文件
const delFile = async (e: any, id: any) => {
  try {
    if (id) {
      await appApi.deleteAssistantFile({ id })
      fileList.value.splice(e, 1)
      ElMessage({
        message: 'success',
        type: 'success'
      })
    }
  } catch (error) {
    ElMessage({
      message: 'Error',
      type: 'error'
    })
    console.log('delFile-error', error)
  }
}
// 校验
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  )
}
// 上传成功
const handleSuccess: UploadProps['onSuccess'] = (response: any) => {
  console.log('response', response)

  let res = response.data
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
          color: $basic-color;
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
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        background: linear-gradient(180deg, #4460dc, #6f89fe);
        border: none;
      }
    }
    .mr-b {
      margin-bottom: 20px;
    }
  }
}
</style>
