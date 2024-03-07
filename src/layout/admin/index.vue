<template>
  <el-container class="layout">
    <el-aside>
      <div class="aside-box" :style="{ width: isCollapse ? '50px' : '200px' }">
        <el-scrollbar>
          <Side></Side>
        </el-scrollbar>
      </div>
    </el-aside>
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <Main></Main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import Side from './components/Side.vue'
import Header from './components/Header.vue'
import Main from './components/Main.vue'
import { useGlobalStore } from '@/stores/modules/global'
import { storeToRefs } from 'pinia'
const globalStore = useGlobalStore()
const { isCollapse } = storeToRefs(globalStore)
</script>
<style scoped lang="scss">
.el-container {
  width: 100%;
  height: 100%;
  :deep(.el-aside) {
    width: auto;
    box-shadow: 1px 1px 1px 0px #dcdcdc;
    .aside-box {
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: width 0.3s ease;

      .el-scrollbar {
        height: 100%;
        background-color: $bg-color;
        .el-menu {
          width: 100%;
          overflow-x: hidden;
          border-right: none;
        }
      }
    }
  }
  .el-header {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    box-shadow: 1px 1px 0px 1px #dcdcdc;
    height: 50px;
    padding: 0 15px;
  }
}
</style>
