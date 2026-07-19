import { defineStore } from 'pinia'
import Axios from '../utils/Axios'

export const usePageStore = defineStore({
  id: 'page',
  state: () => ({
    page: null,
    loading: false,
    error: null
  }),
  getters: {
  },
  actions: {
    async fetchPage(page, locale) {
      this.page = null
      this.loading = true
      try {
        const data = await Axios.noAuth(import.meta.env.VITE_API_URL+`/api/pages/${page}?locale=${locale}`, 'GET');
        this.page = data.data.page;
        console.log(this.page)
      } catch (error) {
        console.log(error)
        this.error = error
      } finally {
        this.loading = false
      }
    }
  }
})
