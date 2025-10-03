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
  
  actions: {
    // 初始化状态
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
    
    // 增强退出登录功能
    logout() {
      // 清空本地状态
      this.token = null
      this.username = null
      this.isLogin = false
      
      // 清空存储
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('username')
      
      console.log('用户状态已清除，准备跳转到登录页')
    }
  }
})