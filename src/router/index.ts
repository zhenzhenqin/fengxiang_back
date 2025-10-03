import { createRouter, createWebHistory } from "vue-router"
//import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ElMessage } from 'element-plus'
// 新增：导入Pinia Auth Store
import { useAuthStore } from '../store/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 你原有路由配置完全不变！
    {
      path: '/',
      meta: { title: '登录' },
      component: () => import('../views/login/index.vue')
    },
    {
      path: '/login',
      redirect: '/'
    },  
    {
      path: '/layout',
      meta: { 
        title: '布局', 
        requiresAuth: true 
      },
      component: () => import('../views/layout/index.vue'),
      children: [
        { path: 'index', meta: { title: '首页' }, component: () => import('../views/index/index.vue') },
        { path: 'employee', meta: { title: '员工管理' }, component: () => import('../views/employee/index.vue') },
        { path: 'category', meta: { title: '分类管理' }, component: () => import('../views/category/index.vue') },
        { path: 'good', meta: { title: '商品管理' }, component: () => import('../views/good/index.vue') },
        { path: 'order', meta: { title: '订单管理' }, component: () => import('../views/order/index.vue') },
        { path: 'report', meta: { title: '数据统计' }, component: () => import('../views/report/index.vue') },
        { path: 'dashboard', meta: { title: '工作台' }, component: () => import('../views/workplace/index.vue') }
      ]
    }
  ]
})

// 修改：路由守卫从Pinia读取状态（同步无延迟）
// router/index.ts
// router/index.ts
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 1. 已登录用户访问登录页 → 直接跳首页
  if (!to.meta.requiresAuth && authStore.isLogin) {
    next('/layout/index')
    return
  }

  // 2. 需要授权的路由 → 用Pinia的token判断
  if (to.meta.requiresAuth) {
    if (authStore.token) {
      next() // 有Token，直接放行
    } else {
      ElMessage.warning('请先登录后再访问！')
      next('/')
    }
  } else {
    // 3. 无需授权的路由 → 直接放行
    next()
  }
})

// 你原有afterEach逻辑完全不变
router.afterEach((to, from) => {
  if(to.meta && to.meta.title){
    document.title = `${to.meta.title} - 蜂享自然`
  }
  //NProgress.done()
})

export default router