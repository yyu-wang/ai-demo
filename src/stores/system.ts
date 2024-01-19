import { defineStore } from 'pinia'
interface systemState {
  title: string
}
export const useSystemStore = defineStore({
  id: 'system',
  state: (): systemState => ({
    title: ''
  }),
  getters: {},
  actions: {
    setTitle(title: string) {
      console.log('title', title)
      this.title = title
    }
  }
})
