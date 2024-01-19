<template>
  <div class="main">
    父组件： {{ value }}

    <InputItem :placeholder="'请输入'" v-model="value"></InputItem>
  </div>
</template>
<script setup lang="ts">
import InputItem from '@/components/inputItem/indexView.vue'
import { ref } from 'vue'
const value = ref('')
</script>
<style>
.main {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
