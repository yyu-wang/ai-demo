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
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus)
app.use(pinia)
app.use(router)

app.mount('#app')
