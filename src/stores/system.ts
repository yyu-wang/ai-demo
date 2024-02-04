import { defineStore } from 'pinia'
interface systemState {
  title: string
  menuActive: string
}
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
