import { $get } from '../utils/request'

// 获取营业数据
export const $getBusinessData = async () => {
  try {
    const response = await $get('/workspace/businessData')
    if (response.code === 1) {
      return {
        code: 1,
        data: response.data,
        msg: '获取营业数据成功'
      }
    } else {
      return {
        code: 0,
        msg: response.msg || '获取营业数据失败'
      }
    }
  } catch (error: any) {
    console.error('获取营业数据失败:', error)
    return {
      code: 0,
      msg: error.response?.data?.msg || '网络错误，获取营业数据失败'
    }
  }
}

// 获取订单管理数据
export const $getOrderOverView = async () => {
  try {
    const response = await $get('/workspace/overviewOrders')
    if (response.code === 1) {
      return {
        code: 1,
        data: response.data,
        msg: '获取订单管理数据成功'
      }
    } else {
      return {
        code: 0,
        msg: response.msg || '获取订单管理数据失败'
      }
    }
  } catch (error: any) {
    console.error('获取订单管理数据失败:', error)
    return {
      code: 0,
      msg: error.response?.data?.msg || '网络错误，获取订单管理数据失败'
    }
  }
}

// 获取菜品总览数据
export const $getDishOverView = async () => {
  try {
    const response = await $get('/workspace/overviewDishes')
    if (response.code === 1) {
      return {
        code: 1,
        data: response.data,
        msg: '获取菜品总览数据成功'
      }
    } else {
      return {
        code: 0,
        msg: response.msg || '获取菜品总览数据失败'
      }
    }
  } catch (error: any) {
    console.error('获取菜品总览数据失败:', error)
    return {
      code: 0,
      msg: error.response?.data?.msg || '网络错误，获取菜品总览数据失败'
    }
  }
}