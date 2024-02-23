import { defineStore } from 'pinia'
import { systemState } from '@/stores/interface'
export const useSystemStore = defineStore({
  id: 'system',
  state: (): systemState => ({
    title: '',
    menuActive: '/'
  }),
  getters: {},
  actions: {
    setTitle(title: string) {
      this.title = title
    },
    setMenuActive(value: string) {
      this.menuActive = value
    }
  }
})
