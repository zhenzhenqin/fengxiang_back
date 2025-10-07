// api/category.ts
import { $post, $put, $get, $delete } from '../utils/request'

// 获取分类分页列表
export const $getCategoryList = async (params: {
  page: number;
  pageSize: number;
  name?: string;
}) => {
  try {
    const response = await $get('/category/page', params)
    if (response.code === 1) {
      return { 
        code: 1, 
        data: response.data,
        msg: '获取成功'
      }
    } else {
      return { 
        code: 0, 
        msg: response.msg || '获取分类列表失败' 
      }
    }
  } catch (error: any) {
    console.error('获取分类列表失败:', error)
    return { 
      code: 0, 
      msg: error.response.msg || '网络错误，获取分类列表失败' 
    }
  }
}

// 启用/禁用分类
export const $updateCategoryStatus = async (id: number, status: number) => {
  try {
    const response = await $post(`/category/status/${status}?id=${id}`, {})
    if (response.code === 1) {
      return { 
        code: 1, 
        msg: response.msg || '操作成功' 
      }
    } else {
      return { 
        code: 0, 
        msg: response.msg || '操作失败' 
      }
    }
  } catch (error: any) {
    console.error('启用/禁用分类失败:', error)
    const errormsg = error.response.msg || 
                        error.msg || 
                        '网络错误，操作失败'
    return { 
      code: 0, 
      msg: errormsg 
    }
  }
}

// 新增分类
export const $addCategory = async (categoryData: {
  name: string;
  sort: number;
}) => {
  try {
    const response = await $post('/category', categoryData)
    if (response.code === 1) {
      return { 
        code: 1, 
        msg: response.msg || '新增分类成功' 
      }
    } else {
      return { 
        code: 0, 
        msg: response.msg || '新增分类失败' 
      }
    }
  } catch (error: any) {
    console.error('新增分类失败:', error)
    return { 
      code: 0, 
      msg: error.response.msg || '网络错误，新增分类失败' 
    }
  }
}

// 更新分类信息
export const $updateCategory = async (id: number, categoryData: {
  name: string;
  sort: number;
}) => {
  try {
    // 注意：这里需要传递id，根据你的后端DTO结构
    const dataToSend = {
      id: id,
      ...categoryData
    }
    
    console.log('更新分类请求数据:', dataToSend)
    
    const response = await $put('/category', dataToSend)
    if (response.code === 1) {
      return { 
        code: 1, 
        msg: response.msg || '更新分类成功' 
      }
    } else {
      return { 
        code: 0, 
        msg: response.msg || '更新分类失败' 
      }
    }
  } catch (error: any) {
    console.error('更新分类失败:', error)
    return { 
      code: 0, 
      msg: error.response.msg || '更新分类失败' 
    }
  }
}

// 删除分类数据
export const $deleteCategory = async (id: number) => {
  try {
    const response = await $delete(`/category?id=${id}`)
    if (response.code === 1) {
      return { 
        code: 1, 
        msg: response.msg || '删除分类成功' 
      }
    } else {
      return { 
        code: 0, 
        msg: response.msg || '删除分类失败' 
      }
    }
  } catch (error: any) {
    console.error('删除分类失败:', error)
    return { 
      code: 0, 
      msg: error.response.msg || '删除分类失败' 
    }
  }
}