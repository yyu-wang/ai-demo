<template>
  <div>
    <el-input :value="modelValue" v-model="value" @input="updateValue" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({
  modelValue: {
    type: String,
    required: true
  }
})
const value = ref()
// eslint-disable-next-line vue/valid-define-emits
const emits = defineEmits()
const updateValue = (e) => {
  emits('update:modelValue', e)
}
</script>
