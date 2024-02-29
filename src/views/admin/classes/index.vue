<template>
  <div class="box">
    <el-button class="btn" type="primary">cerate</el-button>
  </div>
  <div class="main">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="key" label="Class Key" width="300" />
      <el-table-column prop="name" label="Class Name" width="300" />
      <el-table-column prop="description" label="Description (optional)" />
      <el-table-column align="center" :label="t('assistant.tab.operate')" width="100">
        <template #default="scope">
          <div style="display: flex; justify-content: space-between">
            <el-tooltip effect="dark" :content="t('assistant.tab.delete')" placement="top-start">
              <el-icon size="20" @click="deleteFn(scope.row)"><Delete /></el-icon>
            </el-tooltip>
            <el-tooltip effect="dark" :content="t('assistant.tab.edit')" placement="top-start">
              <el-icon size="20" @click="editFn(scope.row)"><Edit /></el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="box">
      <el-pagination
        class="item"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        background="true"
        layout="prev, pager, next, jumper"
        :total="1000"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentPage = ref(1)
const pageSize = ref(20)
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
const tableData = [
  {
    key: '12313',
    name: 'Tom',
    description: 'No. 189, Grove St, Los Angeles'
  }
]

const deleteFn = (row: any) => {
  console.log(row)
}
const editFn = (row: any) => {
  console.log(row)
}
// onMounted(() => {})
</script>
<style scoped lang="scss">
.box {
  display: flex;
  justify-content: flex-end;
  .btn {
    margin-bottom: 10px;
  }
  .item {
    padding: 10px;
  }
}
</style>
