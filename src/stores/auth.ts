import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  
  actions: {
    login(credentials: { username: string; password: string }) {
      // 实现登录逻辑
    },
    logout() {
      // 实现登出逻辑
    }
  }
})