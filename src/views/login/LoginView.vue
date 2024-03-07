<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <img class="logo" src="@/assets/images/edugpt_logo.png" alt="" />
      <div class="lg"><Language /></div>
      <div class="login-form">
        <div class="logo-text">{{ $t('login.title') }}</div>
        <LoginForm />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="login">
import LoginForm from './components/LoginForm.vue'
import Language from '@/layout/components/Language.vue'
</script>

<style scoped lang="scss">
.login-container {
  height: 100%;
  min-height: 550px;
  background-color: $bg-color;
  background-image: url('@/assets/images/login_bg.svg');
  background-size: 100% 100%;
  background-size: cover;
}
.login-box {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 96.5%;
  height: 94%;
  padding: 0 50px;
  background-color: rgb(255 255 255 / 80%);
  border-radius: 10px;
  .logo {
    position: absolute;
    width: 200px;
    left: 32px;
    top: 10px;
  }
  .lg {
    position: absolute;
    right: 32px;
    top: 10px;
  }
  .login-form {
    width: 420px;
    padding: 50px 40px 45px;
    background-color: var(--el-bg-color);
    border-radius: 10px;
    box-shadow: rgb(0 0 0 / 10%) 0 2px 10px 2px;

    .logo-text {
      padding: 0 0 0 25px;
      margin: 0 0 30px 0;
      font-size: 32px;
      font-weight: bold;
      color: #34495e;
      white-space: nowrap;
    }
  }
}
</style>
@/layout/components/headerCompopents/Language.vue
