// api/good.ts
import { $post, $put, $get, $delete } from '../utils/request'

// 获取商品分页列表
export const $getGoodList = async (params: {
  page: number;
  pageSize: number;
  name?: string;
  categoryId?: number;
  status?: number;
}) => {
  try {
    const response = await $get('/dish/page', params)
    if (response.code === 1) {
      return { 
        code: 1, 
        data: response.data,
        msg: '获取成功'
      }
    } else {
      return { 
        code: 0, 
        msg: response.msg || '获取商品列表失败' 
      }
    }
  } catch (error: any) {
    console.error('获取商品列表失败:', error)
    return { 
      code: 0, 
      msg: error.response?.data?.msg || '网络错误，获取商品列表失败' 
    }
  }
}

// 启用/禁用商品
export const $updateGoodStatus = async (id: number, status: number) => {
  try {
    const response = await $post(`/dish/status/${status}?id=${id}`, {})
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
    console.error('启用/禁用商品失败:', error)
    const errormsg = error.response?.data?.msg || 
                        error.msg || 
                        '网络错误，操作失败'
    return { 
      code: 0, 
      msg: errormsg 
    }
  }
}

// 新增商品
export const $addGood = async (goodData: {
  name: string;
  categoryId: number;
  price: number;
  image: string;
  description: string;
}) => {
  try {
    const response = await $post('/dish', goodData)
    if (response.code === 1) {
      return { 
        code: 1, 
        msg: response.msg || '新增商品成功' 
      }
    } else {
      return { 
        code: 0, 
        msg: response.msg || '新增商品失败' 
      }
    }
  } catch (error: any) {
    console.error('新增商品失败:', error)
    return { 
      code: 0, 
      msg: error.response?.data?.msg || '网络错误，新增商品失败' 
    }
  }
}

// 更新商品信息
export const $updateGood = async (id: number, goodData: {
  name: string;
  categoryId: number;
  price: number;
  image: string;
  description: string;
}) => {
  try {
    const dataToSend = {
      id: id,
      ...goodData
    }
    
    console.log('更新商品请求数据:', dataToSend)
    
    const response = await $put('/dish', dataToSend)
    if (response.code === 1) {
      return { 
        code: 1, 
        msg: response.msg || '更新商品成功' 
      }
    } else {
      return { 
        code: 0, 
        msg: response.msg || '更新商品失败' 
      }
    }
  } catch (error: any) {
    console.error('更新商品失败:', error)
    return { 
      code: 0, 
      msg: error.response?.data?.msg || '更新商品失败' 
    }
  }
}

// 根据ID获取商品详情
export const $getGoodById = async (id: number) => {
  try {
    const response = await $get(`/dish/${id}`)
    if (response.code === 1) {
      return { 
        code: 1, 
        data: response.data,
        msg: '获取成功'
      }
    } else {
      return { 
        code: 0, 
        msg: response.msg || '获取商品信息失败' 
      }
    }
  } catch (error: any) {
    console.error('获取商品信息失败:', error)
    return { 
      code: 0, 
      msg: error.response?.data?.msg || '网络错误，获取商品信息失败' 
    }
  }
}

// 批量删除商品
// 批量删除商品
// 批量删除商品
export const $deleteGoods = async (ids: number[]) => {
  try {
    // 使用 URL 查询参数方式传递 ids
    const idsParam = ids.join(',');
    const response = await $delete(`/dish?ids=${idsParam}`);
    if (response.code === 1) {
      return { 
        code: 1, 
        msg: response.msg || '删除商品成功' 
      }
    } else {
      return { 
        code: 0, 
        msg: response.msg || '删除商品失败' 
      }
    }
  } catch (error: any) {
    console.error('删除商品失败:', error)
    return { 
      code: 0, 
      msg: error.response.msg || '删除商品失败' 
    }
  }
}

// 根据分类ID获取商品列表
export const $getGoodsByCategory = async (categoryId: number) => {
  try {
    const response = await $get('/dish/list', { categoryId })
    if (response.code === 1) {
      return { 
        code: 1, 
        data: response.data,
        msg: '获取成功'
      }
    } else {
      return { 
        code: 0, 
        msg: response.msg || '获取商品列表失败' 
      }
    }
  } catch (error: any) {
    console.error('获取商品列表失败:', error)
    return { 
      code: 0, 
      msg: error.response?.data?.msg || '网络错误，获取商品列表失败' 
    }
  }
}