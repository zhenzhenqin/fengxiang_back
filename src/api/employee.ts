import { $post } from '../utils/request'
import { ElMessage } from 'element-plus'
// 新增：导入Pinia Auth Store
import { useAuthStore } from '../store/user'

/**
 * 员工管理
 */

// 登录（你原有逻辑基础上，替换sessionStorage为Pinia）
export const $login = async (data: any) => {
  var response = await $post('/employee/login', data)
  
  if (response.code === 1 && response.data.token) {
    // 新增：调用Pinia同步更新状态（无延迟）
    const authStore = useAuthStore()
    authStore.loginSuccess(
      response.data.token, 
      response.data.username || data.username // 兼容后端字段
    )
    
    // 原有欢迎提示不变
    const username = data.username
    ElMessage({
      message: `欢迎${username}进入蜂享自然`,
      type: 'success',
    })

    return { code: 1 }
  } else {
    // 原有失败提示不变
    ElMessage({
      message: '登录失败',
      type: 'error',
    })
  }
}