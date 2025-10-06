// utils/request.ts
import axios from 'axios'
import { baseURL } from '../config/baseUrl'
import router from '../router'

const instance = axios.create({
  baseURL: baseURL,
  timeout: 30000
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 排除登录请求，避免循环重定向
  if (config.url === '/employee/login') {
    return config;
  }
  
  // 每次发送请求之前向请求头中添加token信息
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers['token'] = token
  }
  
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  // 处理响应错误，比如token过期
  if (error.response?.status === 401) {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('username')
    router.push('/')
  }
  return Promise.reject(error);
});

// 修改：增强请求方法，支持配置参数
export const $get = async (url: string, params: object = {}, config: object = {}) => {
  let { data } = await instance.get(url, { params, ...config });
  return data
}

export const $post = async (url: string, params: object = {}, config: object = {}) => {
  let { data } = await instance.post(url, params, config);
  return data
}

export const $put = async (url: string, params: object = {}, config: object = {}) => {
  let { data } = await instance.put(url, params, config);
  return data
}

export const $delete = async (url: string, params: object = {}, config: object = {}) => {
  let { data } = await instance.delete(url, { params, ...config });
  return data
}

// 新增：专门用于文件上传的方法
export const $upload = async (url: string, formData: FormData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  let { data } = await instance.post(url, formData, config);
  return data
}