// api/employee.ts
import { $post, $put, $get } from '../utils/request' // 确保导入 $put
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../store/user'

/**
 * 员工管理
 */

// 登录
// api/employee.ts - 修改登录函数
export const $login = async (data: any) => {
  try {
    var response = await $post('/employee/login', data)
    
    if (response.code === 1 && response.data.token) {
      const authStore = useAuthStore()
      authStore.loginSuccess(
        response.data.token, 
        response.data.username || data.username
      )
      
      const username = data.username
      ElMessage({
        message: `欢迎${username}进入蜂享自然`,
        type: 'success',
      })

      return { code: 1 }
    } else {
      // 处理其他类型的失败
      ElMessage({
        message: response.message || '登录失败',
        type: 'error',
      })
      return { code: 0 }
    }
  } catch (error: any) {
    console.error('登录请求失败:', error)
    
    // 根据错误类型显示不同的消息
    let errorMessage = '登录失败'
    
    if (error.response?.data?.message) {
      const backendMessage = error.response.data.message
      
      if (backendMessage.includes('ACCOUNT_LOCKED') || backendMessage.includes('账号被锁定')) {
        errorMessage = '账号已被锁定，请联系管理员'
      } else if (backendMessage.includes('ACCOUNT_NOT_FOUND') || backendMessage.includes('账号不存在')) {
        errorMessage = '账号不存在'
      } else if (backendMessage.includes('PASSWORD_ERROR') || backendMessage.includes('密码错误')) {
        errorMessage = '密码错误'
      } else {
        errorMessage = backendMessage
      }
    } else if (error.message) {
      errorMessage = error.message
    }
    
    ElMessage({
      message: errorMessage,
      type: 'error',
    })
    
    return { code: 0 }
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

// 修改密码接口
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

// 获取员工分页列表
export const $getEmployeeList = async (params: {
  page: number;
  pageSize: number;
  name?: string;
}) => {
  try {
    const response = await $get('/employee/page', params)
    if (response.code === 1) {
      return { 
        code: 1, 
        data: response.data,
        message: '获取成功'
      }
    } else {
      return { 
        code: 0, 
        message: response.message || '获取员工列表失败' 
      }
    }
  } catch (error: any) {
    console.error('获取员工列表失败:', error)
    return { 
      code: 0, 
      message: error.response?.data?.message || '网络错误，获取员工列表失败' 
    }
  }
}

// 启用/禁用员工账号
export const $updateEmployeeStatus = async (id: number, status: number) => {
  try {
    // 修改：将 id 作为查询参数传递
    const response = await $post(`/employee/status/${status}?id=${id}`, {})
    if (response.code === 1) {
      return { 
        code: 1, 
        message: response.message || '操作成功' 
      }
    } else {
      return { 
        code: 0, 
        message: response.message || '操作失败' 
      }
    }
  } catch (error: any) {
    console.error('启用/禁用员工失败:', error)
    // 更详细的错误信息
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        '网络错误，操作失败'
    return { 
      code: 0, 
      message: errorMessage 
    }
  }
}

// 根据ID获取员工详情
export const $getEmployeeById = async (id: number) => {
  try {
    const response = await $get(`/employee/${id}`)
    if (response.code === 1) {
      return { 
        code: 1, 
        data: response.data,
        message: '获取成功'
      }
    } else {
      return { 
        code: 0, 
        message: response.message || '获取员工信息失败' 
      }
    }
  } catch (error: any) {
    console.error('获取员工信息失败:', error)
    return { 
      code: 0, 
      message: error.response?.data?.message || '网络错误，获取员工信息失败' 
    }
  }
}

// 新增员工
export const $addEmployee = async (employeeData: {
  username: string;
  name: string;
  phone: string;
  sex: string;
  idNumber: string;
}) => {
  try {
    // 修正性别转换：男=1，女=0
    const dataToSend = {
      ...employeeData,
      sex: employeeData.sex === '男' ? '1' : '0'
    }
    
    console.log('新增员工请求数据:', dataToSend)
    
    const response = await $post('/employee', dataToSend)
    if (response.code === 1) {
      return { 
        code: 1, 
        message: response.message || '新增员工成功' 
      }
    } else {
      return { 
        code: 0, 
        message: response.message || '新增员工失败' 
      }
    }
  } catch (error: any) {
    console.error('新增员工失败:', error)
    return { 
      code: 0, 
      message: error.response?.data?.message || '网络错误，新增员工失败' 
    }
  }
}

// 更新员工信息
export const $updateEmployee = async (id: number, employeeData: {
  name: string;
  phone: string;
  sex: string;
  idNumber: string;
}) => {
  try {
    // 修正性别转换：男=1，女=0
    const dataToSend = {
      id: id,
      ...employeeData,
      sex: employeeData.sex === '男' ? '1' : '0'
    }
    
    console.log('更新员工请求数据:', dataToSend)
    
    // 注意：根据你的后端接口，编辑员工信息应该是 PUT /employee
    const response = await $put('/employee', dataToSend)
    if (response.code === 1) {
      return { 
        code: 1, 
        message: response.message || '更新员工成功' 
      }
    } else {
      return { 
        code: 0, 
        message: response.message || '更新员工失败' 
      }
    }
  } catch (error: any) {
    console.error('更新员工失败:', error)
    return { 
      code: 0, 
      message: error.response?.data?.message || '更新员工失败' 
    }
  }
}