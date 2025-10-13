import { $get, $put, $post } from '../utils/request'

// 订单搜索
export const $searchOrders = async (params: {
  page: number
  pageSize: number
  number?: string
  phone?: string
  beginTime?: string
  endTime?: string
  status?: number
}) => {
  try {
    const response = await $get('/order/conditionSearch', params)
    if (response.code === 1) {
      return {
        code: 1,
        data: response.data,
        msg: '订单搜索成功'
      }
    } else {
      return {
        code: 0,
        msg: response.msg || '订单搜索失败'
      }
    }
  } catch (error: any) {
    console.error('订单搜索失败:', error)
    return {
      code: 0,
      msg: error.response?.data?.msg || '网络错误，订单搜索失败'
    }
  }
}

// 获取订单详情
export const $getOrderDetail = async (id: number) => {
  try {
    const response = await $get(`/order/details/${id}`)
    if (response.code === 1) {
      return {
        code: 1,
        data: response.data,
        msg: '获取订单详情成功'
      }
    } else {
      return {
        code: 0,
        msg: response.msg || '获取订单详情失败'
      }
    }
  } catch (error: any) {
    console.error('获取订单详情失败:', error)
    return {
      code: 0,
      msg: error.response?.data?.msg || '网络错误，获取订单详情失败'
    }
  }
}

// 获取订单统计信息
export const $getOrderStatistics = async () => {
  try {
    const response = await $get('/order/statistics')
    if (response.code === 1) {
      return {
        code: 1,
        data: response.data,
        msg: '获取订单统计成功'
      }
    } else {
      return {
        code: 0,
        msg: response.msg || '获取订单统计失败'
      }
    }
  } catch (error: any) {
    console.error('获取订单统计失败:', error)
    return {
      code: 0,
      msg: error.response?.data?.msg || '网络错误，获取订单统计失败'
    }
  }
}

// 取消订单
export const $cancelOrder = async (data: {
  id: number
  cancelReason: string
}) => {
  try {
    const response = await $put('/order/cancel', data)
    if (response.code === 1) {
      return {
        code: 1,
        msg: '取消订单成功'
      }
    } else {
      return {
        code: 0,
        msg: response.msg || '取消订单失败'
      }
    }
  } catch (error: any) {
    console.error('取消订单失败:', error)
    return {
      code: 0,
      msg: error.response?.data?.msg || '网络错误，取消订单失败'
    }
  }
}

// 派送订单
export const $deliveryOrder = async (id: number) => {
  try {
    const response = await $put(`/order/delivery/${id}`)
    if (response.code === 1) {
      return {
        code: 1,
        msg: '派送订单成功'
      }
    } else {
      return {
        code: 0,
        msg: response.msg || '派送订单失败'
      }
    }
  } catch (error: any) {
    console.error('派送订单失败:', error)
    return {
      code: 0,
      msg: error.response?.data?.msg || '网络错误，派送订单失败'
    }
  }
}

// 完成订单
export const $completeOrder = async (id: number) => {
  try {
    const response = await $put(`/order/complete/${id}`)
    if (response.code === 1) {
      return {
        code: 1,
        msg: '完成订单成功'
      }
    } else {
      return {
        code: 0,
        msg: response.msg || '完成订单失败'
      }
    }
  } catch (error: any) {
    console.error('完成订单失败:', error)
    return {
      code: 0,
      msg: error.response?.data?.msg || '网络错误，完成订单失败'
    }
  }
}

// 退款订单
export const $refundOrder = async (id: number) => {
  try {
    const response = await $put(`/order/refund/${id}`)
    if (response.code === 1) {
      return {
        code: 1,
        msg: '退款订单成功'
      }
    } else {
      return {
        code: 0,
        msg: response.msg || '退款订单失败'
      }
    }
  } catch (error: any) {
    console.error('退款订单失败:', error)
    return {
      code: 0,
      msg: error.response?.data?.msg || '网络错误，退款订单失败'
    }
  }
}