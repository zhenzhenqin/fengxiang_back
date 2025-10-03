// store/user.ts
import { defineStore } from 'pinia'

interface AuthState {
  token: string | null
  username: string | null
  empId: string | null // 新增：员工ID
  isLogin: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    username: null,
    empId: null, // 新增
    isLogin: false
  }),
  
  getters: {
    getToken: (state) => state.token || sessionStorage.getItem('token'),
    getUsername: (state) => state.username || sessionStorage.getItem('username'),
    getEmpId: (state) => state.empId || sessionStorage.getItem('empId'), // 新增
    getIsLogin: (state) => state.isLogin || !!sessionStorage.getItem('token')
  },
  
  actions: {
    // 初始化状态
    initialize() {
      const token = sessionStorage.getItem('token')
      const username = sessionStorage.getItem('username')
      const empId = sessionStorage.getItem('empId') // 新增
      
      if (token) {
        this.token = token
        this.username = username
        this.empId = empId // 新增
        this.isLogin = true
        console.log('🔐 从sessionStorage恢复登录状态:', { 
          username,
          empId,
          token: token?.substring(0, 10) + '...' 
        })
      } else {
        console.log('🔐 未找到登录状态，用户未登录')
      }
    },
    
    // 登录成功 - 如果需要存储员工ID，可以在这里添加
    loginSuccess(token: string, username: string, empId?: string) {
      this.token = token
      this.username = username
      this.empId = empId || null // 新增
      this.isLogin = true
      sessionStorage.setItem('token', token)
      sessionStorage.setItem('username', username)
      if (empId) {
        sessionStorage.setItem('empId', empId) // 新增
      }
      console.log('✅ 登录成功，状态已保存')
    },
    
    // 退出登录
    logout() {
      this.token = null
      this.username = null
      this.empId = null // 新增
      this.isLogin = false
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('username')
      sessionStorage.removeItem('empId') // 新增
      console.log('🚪 退出登录，状态已清除')
    }
  }
})