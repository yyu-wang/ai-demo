<template>
  <div>
    <el-menu :default-active="userStore.menuActive" :collapse="isCollapse">
      <template v-for="item in routerList" :key="item.path">
        <template v-if="item.children && item.children.length > 0">
          <el-sub-menu :index="item.path">
            <template #title>
              <el-icon>
                <component :is="item.meta.icon"></component>
              </el-icon>
              <span>{{ setTitle(item.meta) }} </span>
            </template>
            <el-menu-item-group>
              <template v-for="jtem in item.children" :key="jtem.path">
                <el-menu-item @click="toRouter(jtem)" :index="jtem.path" v-if="!jtem.meta.isHide">
                  <el-icon>
                    <component :is="jtem.meta.icon"></component>
                  </el-icon>
                  <span>{{ setTitle(jtem.meta) }} </span>
                </el-menu-item>
              </template>
            </el-menu-item-group>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item @click="toRouter(item)" :index="item.path" v-if="!item.meta.isHide">
            <el-icon>
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{ setTitle(item.meta) }} </span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSystemStore } from '@/stores/modules/system'
import { useGlobalStore } from '@/stores/modules/global'
import { storeToRefs } from 'pinia'
const globalStore = useGlobalStore()
const { isCollapse } = storeToRefs(globalStore)

const userStore = useSystemStore()
const router = useRouter()
const route = useRoute()

// 设置名字
const setTitle = (meta: any) => {
  if (globalStore.language === 'en' && meta.titleEn) {
    return meta.titleEn
  } else if (globalStore.language === 'zh' && meta.titleZh) {
    return meta.titleZh
  } else if (globalStore.language === 'zh-hk' && meta.titleZhHk) {
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
//
const getRouter = () => {
  const arr = route.matched
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === 'adminLayout') {
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

<style scoped lang="scss">
.el-menu {
  border-right: none;
  background-color: $bg-color;
}
.el-menu-item.is-active {
  color: #ffffff;
  background-color: $menu-color;
}
.el-menu-item:hover {
  background-color: $menu-hover-color;
  color: #000000;
}
</style>
