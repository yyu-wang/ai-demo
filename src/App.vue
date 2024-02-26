<template>
  <RouterView />
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getBrowserLang } from '@/utils'
import { useGlobalStore } from '@/stores/modules/global'
import { LanguageType } from './stores/interface'

const globalStore = useGlobalStore()

// init language
const i18n = useI18n()
onMounted(() => {
  const language = globalStore.language ?? getBrowserLang()

  i18n.locale.value = language
  globalStore.setGlobalState('language', language as LanguageType)
})
</script>
<style scoped></style>
