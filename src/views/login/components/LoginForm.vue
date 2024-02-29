<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="userName">
      <el-input
        v-model="loginForm.userName"
        :placeholder="$t('login.usernamePlaceholder')"
        @keyup.enter="login(loginFormRef)"
      >
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        type="password"
        :placeholder="$t('login.passwordPlaceholder')"
        show-password
        autocomplete="new-password"
        @keyup.enter="login(loginFormRef)"
      >
      </el-input>
    </el-form-item>
    <el-form-item prop="rePassword" v-if="!isLogin">
      <el-input
        v-model="loginForm.rePassword"
        type="password"
        :placeholder="$t('login.rePasswordPlaceholder')"
        show-password
        autocomplete="new-password"
        @keyup.enter="login(loginFormRef)"
      >
      </el-input>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button round size="large" type="primary" :loading="loading" @click="login(loginFormRef)">
      {{ isLogin ? $t('login.loginButton') : $t('login.registerButton') }}
    </el-button>
  </div>
  <div class="text">
    {{ isLogin ? $t('login.promptTextOne') : $t('login.promptTextTwo') }}
    <el-button @click="registerFn" type="success" link>
      {{ isLogin ? $t('login.registerButton') : $t('login.loginButton') }}</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { ElForm } from 'element-plus'
import { reactive, ref } from 'vue'

import loginApi from '@/api/modules/login' // 导入封装的 PostApi
import { ElMessage } from 'element-plus'
// import { getTimeState } from '@/utils'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
type FormInstance = InstanceType<typeof ElForm>

interface ReqLoginForm {
  userName: string
  password: string
  rePassword: string
}

const loginFormRef = ref<FormInstance>()

const loginForm = reactive<ReqLoginForm>({
  userName: '',
  password: '',
  rePassword: ''
})

const loading = ref(false)

const loginRules = ref()

// 表单校验
const getLoginI18nSetRules = () => {
  loginRules.value = {
    userName: [{ required: true, message: t('login.userNameRules'), trigger: 'blur' }],
    password: [{ required: true, message: t('login.passwordRules'), trigger: 'blur' }],
    rePassword: [{ required: true, message: t('login.rePasswordRules'), trigger: 'blur' }]
  }
}

interface responseType {
  token?: string
  code?: number
  expire?: number
  message?: string
  // 其他可能的属性
}
const isLogin = ref(true)
// 登录
const login = (formEl: FormInstance | undefined) => {
  getLoginI18nSetRules()
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
    let res = await loginApi.login(loginForm)

    localStorage.setItem('userName', loginForm.userName)
    localStorage.setItem('token', res.token)
    if ((res as responseType).token) {
      // 4.跳转到首页
      router.push({
        path: '/'
      })
      // ElNotification({
      //   title: getTimeState(),
      //   message: 'Welcome',
      //   type: 'success',
      //   duration: 3000
      // })
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
    message: 'Register successful',
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
