// store/user.ts
import { defineStore } from 'pinia'

interface AuthState {
  token: string | null
  username: string | null
  isLogin: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    username: null,
    isLogin: false
  }),
  
  // 新增：使用持久化插件或者确保每次获取时都从storage读取
  getters: {
    // 确保在getter中也从sessionStorage读取，作为兜底
    getToken: (state) => state.token || sessionStorage.getItem('token'),
    getUsername: (state) => state.username || sessionStorage.getItem('username'),
    getIsLogin: (state) => state.isLogin || !!sessionStorage.getItem('token')
  },
  
  actions: {
    // 初始化状态 - 从sessionStorage恢复
    initialize() {
      const token = sessionStorage.getItem('token')
      const username = sessionStorage.getItem('username')
      
      if (token) {
        this.token = token
        this.username = username
        this.isLogin = true
        console.log('🔐 从sessionStorage恢复登录状态:', { token: token?.substring(0, 10) + '...', username })
      } else {
        console.log('🔐 未找到登录状态，用户未登录')
      }
    },
    
    // 登录成功
    loginSuccess(token: string, username: string) {
      this.token = token
      this.username = username
      this.isLogin = true
      sessionStorage.setItem('token', token)
      sessionStorage.setItem('username', username)
      console.log('✅ 登录成功，状态已保存')
    },
    
    // 退出登录
    logout() {
      this.token = null
      this.username = null
      this.isLogin = false
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('username')
      console.log('🚪 退出登录，状态已清除')
    }
  }
})