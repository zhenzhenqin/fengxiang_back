import { $get, $post, instance } from '../utils/request'

// 营业额统计
export const $getTurnoverStatistics = async (params: {
  begin: string
  end: string
}) => {
  try {
    const response = await $get('/report/turnoverStatistics', params)
    if (response.code === 1) {
      return {
        code: 1,
        data: response.data,
        msg: '获取营业额统计成功'
      }
    } else {
      return {
        code: 0,
        msg: response.msg || '获取营业额统计失败'
      }
    }
  } catch (error: any) {
    console.error('获取营业额统计失败:', error)
    return {
      code: 0,
      msg: error.response?.data?.msg || '网络错误，获取营业额统计失败'
    }
  }
}

// 用户统计
export const $getUserStatistics = async (params: {
  begin: string
  end: string
}) => {
  try {
    const response = await $get('/report/userStatistics', params)
    if (response.code === 1) {
      return {
        code: 1,
        data: response.data,
        msg: '获取用户统计成功'
      }
    } else {
      return {
        code: 0,
        msg: response.msg || '获取用户统计失败'
      }
    }
  } catch (error: any) {
    console.error('获取用户统计失败:', error)
    return {
      code: 0,
      msg: error.response?.data?.msg || '网络错误，获取用户统计失败'
    }
  }
}

// 订单统计
export const $getOrdersStatistics = async (params: {
  begin: string
  end: string
}) => {
  try {
    const response = await $get('/report/ordersStatistics', params)
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

// 销量排名Top10
export const $getSalesTop10 = async (params: {
  begin: string
  end: string
}) => {
  try {
    const response = await $get('/report/top10', params)
    if (response.code === 1) {
      return {
        code: 1,
        data: response.data,
        msg: '获取销量排名成功'
      }
    } else {
      return {
        code: 0,
        msg: response.msg || '获取销量排名失败'
      }
    }
  } catch (error: any) {
    console.error('获取销量排名失败:', error)
    return {
      code: 0,
      msg: error.response?.data?.msg || '网络错误，获取销量排名失败'
    }
  }
}

export const $download = async (url: string, params: object = {}, filename: string = 'file') => {
  const response = await instance.get(url, {
    params,
    responseType: 'blob'
  })
  
  // 创建blob URL并下载
  const blob = new Blob([response.data])
  const downloadUrl = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(downloadUrl)
  
  return {
    code: 1,
    msg: '下载成功'
  }
}