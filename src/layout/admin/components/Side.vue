<template>
  <div>
    <div class="logo-box">
      <img class="img-logo" v-if="!isCollapse" src="@/assets/images/edugpt_logo.png" alt="" />
      <img class="img-icon" v-else src="@/assets/images/edugpt_browser-icon.png" alt="" />
    </div>

    <Menu :model-value="isCollapse" />
  </div>
</template>
<script setup lang="ts">
import Menu from './Menu.vue'
import { useGlobalStore } from '@/stores/modules/global'
import { storeToRefs } from 'pinia'
const globalStore = useGlobalStore()
const { isCollapse } = storeToRefs(globalStore)
</script>
<style lang="scss" scoped>
.logo-box {
  display: flex;
  align-items: center;
  justify-content: center;
  .img-logo {
    width: 200px;
    height: 50px;
  }

  .img-icon {
    width: 50px;
    height: 50px;
  }
}
</style>
