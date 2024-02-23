<template>
  <div class="main">
    <div>111{{ $t('home.welcome') }}</div>

    <InputItem :placeholder="'请输入'" v-model="value"></InputItem>
  </div>
</template>
<script setup lang="ts">
import InputItem from '@/components/ceshi/index.vue'
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
