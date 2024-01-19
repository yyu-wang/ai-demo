<template>
  <el-menu :default-active="defaultActive" :collapse="modelValue">
    <el-menu-item
      @click="toRouter(item)"
      v-for="(item, index) in routerList"
      :index="numberToString(index)"
      :key="index"
    >
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-menu-item>
  </el-menu>
</template>
<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { numberToString } from '@/utils'
import { useSystemStore } from '@/stores/system'
const userStore = useSystemStore()
const router = useRouter()
const route = useRoute()
const defaultActive = ref('0')

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// 跳转路由
const toRouter = (obj: any) => {
  router.push({
    path: obj.path
  })
  // 修改展示标题
  userStore.setTitle(obj.meta.title)
}
const routerList = ref<any[]>()
const getRouter = () => {
  const arr = route.matched
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === 'layout') {
      routerList.value = arr[i].children
      if (defaultActive.value === '0') {
        userStore.setTitle(routerList.value[0].meta.title)
      }
    }
  }
}
// 获取当前所有路由信息
onMounted(() => {
  getRouter()
})
</script>
<style lang="scss" scoped>
.el-menu {
  border-right: none;
}
.el-menu-item.is-active {
  color: $basic-color;
}
.el-menu-item:hover {
  background-color: $bg-color;
  color: $font-color;
}
</style>
