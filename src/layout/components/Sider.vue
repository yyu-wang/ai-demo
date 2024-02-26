<template>
  <div>
    <div class="logo-box">
      <img class="img-logo" v-if="!modelValue" src="../../assets/images/edugpt_logo.png" alt="" />
      <img class="img-icon" v-else src="../../assets/images/edugpt_browser-icon.png" alt="" />
      <!-- <div class="img-logo" v-if="!modelValue"></div>
      <div class="img-icon" v-else></div> -->
    </div>

    <el-menu :default-active="userStore.menuActive" :collapse="modelValue">
      <template v-for="item in routerList" :key="item.path">
        <el-menu-item @click="toRouter(item)" :index="item.path" v-if="!item.meta.isHide">
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ setTitle(item.meta) }} </span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSystemStore } from '@/stores/modules/system'
import { useGlobalStore } from '@/stores/modules/global'
const globalStore = useGlobalStore()
const userStore = useSystemStore()
const router = useRouter()
const route = useRoute()
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// 设置名字
const setTitle = (meta: any) => {
  if (globalStore.language === 'en') {
    return meta.titleEn
  } else if (globalStore.language === 'zh') {
    return meta.titleZh
  } else if (globalStore.language === 'zh-hk') {
    return meta.titleZhHk
  } else {
    return meta.title
  }
}

// 跳转路由
const toRouter = (obj: any) => {
  router.push({
    path: obj.path
  })
  setSelect(obj.path)
}
const routerList = ref<any[]>()
// 跳轉
const getRouter = () => {
  const arr = route.matched
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === 'layout') {
      routerList.value = arr[i].children
      setSelect(route.path)
    }
  }
}
// 设置选中
const setSelect = (currentPath: string) => {
  if (routerList.value?.length) {
    routerList.value.forEach((item) => {
      if (currentPath === item.path && item && item.meta) {
        userStore.setMenuActive(item.path)
        userStore.setTitle(item.meta.title as string)
      }
    })
  }
}

// 获取当前所有路由信息
onMounted(() => {
  getRouter()
})
</script>
<style lang="scss" scoped>
.logo-box {
  display: flex;
  align-items: center;
  justify-content: center;
  .img-logo {
    width: 200px;
    height: 50px;
    // background: url(../../assets/images/edugpt_logo.png);
  }

  .img-icon {
    width: 50px;
    height: 50px;
    // background: url(../../assets/images/edugpt_browser-icon.png);
  }
}

.el-menu {
  border-right: none;
  background-color: $bg-color;
}
.el-menu-item.is-active {
  color: #ffffff;
  background-color: $basic-color;
}
.el-menu-item:hover {
  background-color: $basic-color;
  color: #ffffff;
}
</style>
