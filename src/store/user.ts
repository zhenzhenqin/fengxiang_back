// store/user.ts
import {defineStore} from 'pinia'

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
  
  actions: {
    // 初始化状态 - 在应用启动时调用
    initialize() {
      this.token = sessionStorage.getItem('token')
      this.username = sessionStorage.getItem('username')
      this.isLogin = !!this.token
    },
    
    // 登录成功
    loginSuccess(token: string, username: string) {
      this.token = token
      this.username = username
      this.isLogin = true
      sessionStorage.setItem('token', token)
      sessionStorage.setItem('username', username)
    },
    
    logout() {
      this.token = null
      this.username = null
      this.isLogin = false
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('username')
    }
  }
})