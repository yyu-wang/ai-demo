<template>
  <div>这是聊天页面</div>
</template>
<script lang="ts" setup>
import { useSystemStore } from '@/stores/system'
const userStore = useSystemStore()
console.log('userStore', userStore.title)
</script>
