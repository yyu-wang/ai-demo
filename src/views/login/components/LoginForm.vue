<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="userName">
      <el-input v-model="loginForm.userName" placeholder="userName"> </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        type="password"
        placeholder="password"
        show-password
        autocomplete="new-password"
      >
      </el-input>
    </el-form-item>
    <el-form-item prop="rePassword" v-if="!isLogin">
      <el-input
        v-model="loginForm.rePassword"
        type="password"
        placeholder="Enter password again"
        show-password
        autocomplete="new-password"
      >
      </el-input>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <!-- <el-button :icon="CircleClose" round size="large" @click="resetForm(loginFormRef)">
      Reset
    </el-button> -->
    <el-button round size="large" type="primary" :loading="loading" @click="login(loginFormRef)">
      {{ isLogin ? 'Login' : 'Register' }}
    </el-button>
  </div>
  <div class="text">
    {{ isLogin ? 'No account?' : 'back' }}
    <el-button @click="registerFn" type="success" link>
      {{ isLogin ? 'Register' : 'Login' }}</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { ElForm } from 'element-plus'
import { reactive, ref } from 'vue'
// import { CircleClose, UserFilled } from '@element-plus/icons-vue'
import loginApi from '@/api/login' // 导入封装的 PostApi
import { ElMessage, ElNotification } from 'element-plus'
import { getTimeState } from '@/utils'
import { useRouter } from 'vue-router'
const router = useRouter()
type FormInstance = InstanceType<typeof ElForm>

interface ReqLoginForm {
  userName: ''
  password: ''
  rePassword: ''
}

const loginFormRef = ref<FormInstance>()

const loginForm = reactive<ReqLoginForm>({
  userName: '',
  password: '',
  rePassword: ''
})
const loading = ref(false)
// 表单校验
const loginRules = reactive({
  userName: [{ required: true, message: 'please enter user name', trigger: 'blur' }],
  password: [{ required: true, message: 'please enter password', trigger: 'blur' }],
  rePassword: [{ required: true, message: 'Please enter password again', trigger: 'blur' }]
})
interface responseType {
  token?: string
  code?: number
  expire?: number
  message?: string
  // 其他可能的属性
}
const isLogin = ref(true)
// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      if (!isLogin.value) {
        //注册
        submitRegister(formEl)
      } else {
        // 登录
        submitLogin()
      }
      // 1.执行登录接口
    } finally {
      loading.value = false
    }
  })
}

// 登录
const submitLogin = async () => {
  try {
    let { userName, password } = loginForm
    let res = await loginApi.login({
      userName,
      password
    })
    if ((res as responseType).token) {
      sessionStorage.setItem('token', (res as responseType).token!)
      // 4.跳转到首页
      router.push({
        path: '/'
      })
      ElNotification({
        title: getTimeState(),
        message: '欢迎登录',
        type: 'success',
        duration: 3000
      })
    }
  } catch (error: any) {
    ElMessage({
      message: error.message,
      type: 'error'
    })
  }
}
// 注册
const submitRegister = async (formEl: FormInstance | undefined) => {
  await loginApi.register(loginForm)
  ElMessage({
    message: '注册成功',
    type: 'success'
  })
  resetForm(formEl)
}
// 切换注册登录
const registerFn = () => {
  isLogin.value = !isLogin.value
}

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 40px;
}
.el-input__icon {
  color: #db2828;
}
.login-btn {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 40px;
  white-space: nowrap;
  .el-button {
    width: 100%;
  }
}
.text {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 50px;
  align-items: center;
}
</style>
