<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <svg
      t="1708659792347"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="7192"
      width="24"
      height="24"
    >
      <path
        d="M651.3 390.041h325.224a47.76 47.76 0 0 1 46.623 48.897v536.165A47.76 47.76 0 0 1 976.524 1024H419.322a47.76 47.76 0 0 1-46.623-48.897V633.959H46.907A47.76 47.76 0 0 1 0.284 585.062V48.897A47.76 47.76 0 0 1 46.907 0h557.77A47.76 47.76 0 0 1 651.3 48.897zM46.907 585.061h557.77V48.898H46.907v536.165z m635.665-16.488l-102.343 278.6h45.485l25.018-71.64h113.714l25.018 71.64h43.78l-102.912-278.6z m-22.175 170.572l44.35-126.223 47.19 126.223z m-354.22-625.43h35.251v71.071h135.32v188.198h-35.251V350.81H341.428V481.58h-33.546V350.81h-97.226v22.174h-35.251V184.786h132.477z m-95.52 200.706h96.657v-93.246h-96.658z m130.771 0h100.069v-93.246H341.428z"
        fill="#515151"
        p-id="7193"
      ></path>
    </svg>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in languageList"
          :key="item.value"
          :command="item.value"
          :disabled="language === item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useGlobalStore } from '@/stores/modules/global'
import { LanguageType } from '@/stores/interface'

const i18n = useI18n()
const globalStore = useGlobalStore()
const language = computed(() => globalStore.language)

const languageList = [
  { label: '简体中文', value: 'zh' },
  { label: '繁體中文', value: 'zh-hk' },
  { label: 'English', value: 'en' }
]

const changeLanguage = (lang: string) => {
  i18n.locale.value = lang
  globalStore.setGlobalState('language', lang as LanguageType)
}
</script>
