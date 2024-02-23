import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import pinia from '@/stores'
import '@/styles/common.scss'
import '@/styles/index.scss'

import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import '@/styles/element/index.scss'

// vue i18n
import I18n from '@/languages/index'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus).use(pinia).use(router).use(I18n).mount('#app')
