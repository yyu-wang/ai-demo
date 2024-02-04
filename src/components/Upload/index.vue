<template>
  <div>
    <el-upload
      :action="fileUrl"
      :headers="headers"
      :show-file-list="false"
      :on-success="handleSuccess"
      :on-error="handleError"
      :limit="1"
      :on-exceed="handleExceed"
      v-bind="bindObj"
    >
      <el-icon size="20"><Paperclip /></el-icon>
    </el-upload>
  </div>
</template>
<script setup lang="ts">
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
defineProps({
  modelValue: [Array], // v-model綁的值
  fileUrl: [String], // 上传地址
  headers: [String], // 上传地址请求头
  bindObj: {
    type: Object,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    default: () => {}
  } //组件自带的事件及配置
})
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
  let res = response.data[0]

  console.log('fileList.value', res)
}
// 上传失败
const handleError: UploadProps['onSuccess'] = (error: Error) => {
  ElMessage({
    message: 'error!',
    type: 'error'
  })
  console.log('error', error)
}
</script>
