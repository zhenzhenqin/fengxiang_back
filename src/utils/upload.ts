// utils/upload.ts
import { $upload } from './request'  // 修改：使用新的 $upload 方法

// 文件上传
export const $uploadFile = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    // 修改：使用专门的 $upload 方法
    const response = await $upload('/common/upload', formData)
    
    if (response.code === 1) {
      return { 
        code: 1, 
        data: response.data,
        message: '上传成功'
      }
    } else {
      return { 
        code: 0, 
        message: response.message || '上传失败' 
      }
    }
  } catch (error: any) {
    console.error('文件上传失败:', error)
    return { 
      code: 0, 
      message: error.response?.data?.message || '网络错误，上传失败' 
    }
  }
}