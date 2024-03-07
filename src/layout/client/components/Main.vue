<template>
  <el-main>
    <router-view v-slot="{ Component, route }">
      <Transition appear name="fade-transform" mode="out-in">
        <div :key="route.fullPath" class="main-box">
          <component :is="Component" />
        </div>
      </Transition>
    </router-view>
  </el-main>
  <el-footer v-show="footer">
    <Footer />
  </el-footer>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useDebounceFn } from '@vueuse/core'
import { useGlobalStore } from '@/stores/modules/global'
import Footer from '@/layout/components/Footer.vue'

const globalStore = useGlobalStore()
const { isCollapse, footer } = storeToRefs(globalStore)

// 监听窗口大小变化，折叠侧边栏
const screenWidth = ref(0)
const listeningWindow = useDebounceFn(() => {
  screenWidth.value = document.body.clientWidth
  if (!isCollapse.value && screenWidth.value < 1200) globalStore.setGlobalState('isCollapse', true)
  if (isCollapse.value && screenWidth.value > 1200) globalStore.setGlobalState('isCollapse', false)
}, 100)
window.addEventListener('resize', listeningWindow, false)
onBeforeUnmount(() => {
  window.removeEventListener('resize', listeningWindow)
})
</script>

<style scoped lang="scss">
.el-main {
  box-sizing: border-box;
  overflow-x: hidden;
  --el-main-padding: 0;
  margin: 10px 10px 0 10px;
  height: 100%;
}
.main-box {
  width: 100%;
  height: 100%;
}
.el-footer {
  height: auto;
  padding: 0;
}
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.2s;
}
.fade-transform-enter-from {
  opacity: 0;
  transition: all 0.2s;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transition: all 0.2s;
  transform: translateX(30px);
}
</style>
