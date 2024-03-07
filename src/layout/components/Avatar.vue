<template>
  <el-dropdown trigger="click">
    <div class="avatar flx-center">
      <el-icon size="26" color="rgb(81, 81, 81)"><UserFilled /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="showUserInfo">
          <el-icon><User /></el-icon>{{ $t('header.personalData') }}
        </el-dropdown-item>

        <el-dropdown-item divided @click="logOut">
          <el-icon><SwitchButton /></el-icon>{{ $t('header.logout') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <el-dialog v-model="userVisible" :title="$t('header.personalData')" width="500">
    <span>{{ $t('login.usernamePlaceholder') }}：{{ userName }}</span>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const userName = ref<string | null>(localStorage.getItem('userName'))
// 退出
const logOut = () => {
  ElMessageBox.confirm(t('tip.logout'), t('tip.tip'), {
    confirmButtonText: t('tip.confirmButtonText'),
    cancelButtonText: t('tip.cancelButtonText'),
    type: 'warning'
  }).then(() => {
    localStorage.removeItem('token')
    router.push({
      path: '/login'
    })
  })
}
// 显示用户信息
const userVisible = ref<boolean>(false)
const showUserInfo = () => {
  userVisible.value = true
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
