<template>
  <div>首页</div>
  <div v-for="(item, index) in 100" :key="index">首页{{ item }}</div>
</template>
<script lang="ts" setup>
import { useSystemStore } from '@/stores/system'
const userStore = useSystemStore()
console.log('userStore', userStore.title)
</script>
