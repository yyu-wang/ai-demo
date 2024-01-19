<template>
  <div id="layout">
    <div class="left">
      <Sider v-model="isCollapse"></Sider>
      <el-tooltip effect="dark" content="logout" placement="top-start">
        <div class="log-out">
          <el-popconfirm title="logout?" @confirm="logOut">
            <template #reference>
              <el-icon size="26" color="#999999"><UserFilled /></el-icon>
            </template>
          </el-popconfirm>
        </div>
      </el-tooltip>
    </div>
    <div class="right">
      <div class="right-top">
        <RightTop v-model="isCollapse"></RightTop>
      </div>
      <div class="main-box">
        <div class="main">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Sider from './sider.vue'
import RightTop from './rightTop.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
// 退出登录
const logOut = () => {
  sessionStorage.removeItem('token')
  router.push({
    path: '/login'
  })
}
const isCollapse = ref(false)
</script>
<style scoped lang="scss">
#layout {
  display: flex;

  .left {
    min-height: 100vh;
    box-shadow: 1px 2px 3px 0px $bg-color;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    z-index: 99;
    .log-out {
      width: 100%;
      height: 60px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .log-out:hover {
      background-color: $bg-color;
    }
  }

  .right {
    flex: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    .right-top {
      display: flex;
      height: 40px;
    }
    .main-box {
      flex: 1;
      background-color: #f2f2f5;
      padding: 10px;
      .main {
        width: auto;
        height: calc(100vh - 80px);
        background-color: #ffffff;
        border-radius: 6px;
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
        padding: 10px;
        overflow: auto;
      }
    }
  }
}
</style>
