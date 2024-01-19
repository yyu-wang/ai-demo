import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  server: {
    proxy: {
      '*': {
        target: 'http://192.168.100.18:8000',
        changeOrigin: true
        // rewrite 不再需要，因为我们已经匹配了所有路径
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ` @use "@/styles/global.scss" as *;`
      }
    }
  },
  plugins: [vue(), vueJsx()]
})
