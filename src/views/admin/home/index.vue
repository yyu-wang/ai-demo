<template>
  <div class="home">
    <img src="@/assets/images/welcome.png" class="img" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import assistantApi from '@/api/modules/assistant'
// 获取助手列表
const getList = async () => {
  try {
    await assistantApi.listAssistant({
      page: 1,
      pageSize: 1
    })
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .img {
    width: 70%;
    max-width: 1200px;
    margin-bottom: 20px;
  }
}
</style>
