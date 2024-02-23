<template>
  <el-dropdown trigger="click">
    <div class="avatar flx-center">
      <el-icon size="26" color="rgb(81, 81, 81)"><UserFilled /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <el-icon><User /></el-icon>{{ $t('header.personalData') }}
        </el-dropdown-item>

        <el-dropdown-item divided @click="logOut">
          <el-icon><SwitchButton /></el-icon>{{ $t('header.logout') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- infoDialog -->
  <InfoDialog ref="infoRef"></InfoDialog>
  <!-- passwordDialog -->
  <PasswordDialog ref="passwordRef"></PasswordDialog>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

const router = useRouter()

// 退出
const logOut = () => {
  ElMessageBox.confirm('Log out?', 'Tip', {
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    type: 'warning'
  }).then(() => {
    sessionStorage.removeItem('token')
    router.push({
      path: '/login'
    })
  })
}
</script>

<style scoped lang="scss">
.avatar {
  width: 50px;
  height: 50px;
  overflow: hidden;
  cursor: pointer;
}
</style>
