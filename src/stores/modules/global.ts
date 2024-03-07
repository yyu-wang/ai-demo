import { defineStore } from 'pinia'
import { GlobalState } from '@/stores/interface'
import piniaPersistConfig from '@/stores/helper/persist'

type ObjToKeyValArray<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T]

export const useGlobalStore = defineStore({
  id: 'global',
  // 修改默认值之后，需清除 localStorage 数据
  state: (): GlobalState => ({
    // 当前系统语言
    language: null,
    // 折叠菜单
    isCollapse: false,
    // 页脚
    footer: true
  }),
  getters: {},
  actions: {
    // Set GlobalState
    setGlobalState(...args: ObjToKeyValArray<GlobalState>) {
      this.$patch({ [args[0]]: args[1] })
    }
  },
  persist: piniaPersistConfig('global')
})
