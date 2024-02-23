<template>
  <div id="layout">
    <div class="left">
      <Sider v-model="isCollapse"></Sider>
    </div>
    <div class="right">
      <div class="right-top">
        <Header v-model="isCollapse"></Header>
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
import Sider from './components/Sider.vue'
import Header from './components/Header.vue'

const isCollapse = ref(false)
</script>
<style scoped lang="scss">
#layout {
  display: flex;
  width: 100%;
  height: 100vh;

  .left {
    min-height: 100vh;
    box-shadow: 1px 2px 3px 0px #f2f2f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    z-index: 99;
  }

  .right {
    flex: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    .right-top {
      display: flex;
      height: 50px;
    }
    .main-box {
      flex: 1;
      padding: 0 10px 10px 10px;
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
