// shims-vue.d.ts

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMeta {
  readonly env: {
    BASE_URL: string
    VITE_API_URL: string
    // 可以根据你的实际需要添加其他属性
  }
}
