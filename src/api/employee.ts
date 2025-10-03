// api/employee.ts
import { $post, $put } from '../utils/request' // 确保导入 $put
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../store/user'

/**
 * 员工管理
 */

// 登录
export const $login = async (data: any) => {
  var response = await $post('/employee/login', data)
  
  if (response.code === 1 && response.data.token) {
    const authStore = useAuthStore()
    authStore.loginSuccess(
      response.data.token, 
      response.data.username || data.username,
      response.data.id
    )
    
    const username = data.username
    ElMessage({
      message: `欢迎${username}进入蜂享自然`,
      type: 'success',
    })

    return { code: 1 }
  } else {
    ElMessage({
      message: '登录失败',
      type: 'error',
    })
  }
}

// 退出登录
export const $logout = async () => {
  try {
    const response = await $post('/employee/logout')
    if (response.code === 1) {
      return { code: 1, message: '退出成功' }
    } else {
      return { code: 0, message: response.message || '退出失败' }
    }
  } catch (error) {
    console.error('退出登录接口调用失败:', error)
    return { code: 0, message: '网络错误，退出失败' }
  }
}

// 新增：修改密码接口
export const $updatePassword = async (passwordData: {
  oldPassword: string;
  newPassword: string;
}) => {
  try {
    // 使用 PUT 请求，路径为 /employee/editPassword
    const response = await $put('/employee/editPassword', {
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword
      // empId 应该由后端从 token 中解析，前端不需要传递
    })
    
    if (response.code === 1) {
      return { 
        code: 1, 
        message: response.message || '密码修改成功' 
      }
    } else {
      return { 
        code: 0, 
        message: response.message || '密码修改失败' 
      }
    }
  } catch (error: any) {
    console.error('修改密码接口调用失败:', error)
    return { 
      code: 0, 
      message: error.response?.data?.message || '网络错误，密码修改失败' 
    }
  }
}