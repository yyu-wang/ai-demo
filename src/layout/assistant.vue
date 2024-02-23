<template>
  <div id="layout">
    <div class="main-box">
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
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
  }
  .main-box {
    flex: 1;
    .main {
      height: 100%;
      border-radius: 6px;
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
      overflow: auto;
    }
  }
}
</style>
