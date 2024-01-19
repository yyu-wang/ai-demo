<template>
  <div class="content">
    <div class="icon">
      <el-icon @click="isCollapseFn" size="20" v-show="!isCollapse"><Fold /></el-icon>
      <el-icon @click="isCollapseFn" size="20" v-show="isCollapse"><Expand /></el-icon>
    </div>
    <div class="title">{{ userStore.title }}</div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useSystemStore } from '@/stores/system'
const userStore = useSystemStore()
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
  box-shadow: 1px 1px 3px 0px $bg-color;
  display: flex;
  align-items: center;
  .icon {
    margin-left: 10px;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
    margin-left: 50px;
    line-height: 40px;
  }
}
</style>
