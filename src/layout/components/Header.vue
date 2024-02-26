<template>
  <div class="content">
    <div class="left">
      <div class="icon">
        <el-icon @click="isCollapseFn" size="20" v-show="!isCollapse"><Fold /></el-icon>
        <el-icon @click="isCollapseFn" size="20" v-show="isCollapse"><Expand /></el-icon>
      </div>
      <!-- <div class="title">{{ userStore.title }}</div> -->
    </div>
    <div class="right">
      <div class="lg flx-center">
        <Lunguage />
      </div>
      <Avatar />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
// import { useSystemStore } from '@/stores/modules/system'

import Lunguage from './headerCompopents/Lunguage.vue'
import Avatar from './headerCompopents/Avatar.vue'

// import { loginSystemStore } from '@/stores/login'
// const userStore = useSystemStore()

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const isCollapse = ref(false)
// eslint-disable-next-line vue/valid-define-emits
const emits = defineEmits()
// 关闭menu的文字信息
const isCollapseFn = () => {
  isCollapse.value = !isCollapse.value
  emits('update:modelValue', isCollapse.value)
}
</script>
<style lang="scss" scoped>
.content {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 3px 0px $bg-color;
  .left {
    display: flex;
    align-items: center;
    .icon {
      margin-left: 10px;
    }
    .title {
      font-size: 20px;
      margin-left: 50px;
      line-height: 40px;
    }
  }
  .right {
    height: 100%;
    display: flex;
    align-items: center;
    padding-right: 10px;
    .lg {
      margin-right: 20px;
      height: 100%;
      cursor: pointer;
    }
  }
}
</style>
