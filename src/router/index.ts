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
// router/index.ts
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 确保每次路由切换时状态都是最新的
  const isLogin = authStore.getIsLogin
  const token = authStore.getToken

  console.log('🛡️ 路由守卫检查:', { 
    to: to.path, 
    requiresAuth: to.meta.requiresAuth,
    isLogin, 
    hasToken: !!token 
  })

  // 1. 已登录用户访问登录页 → 直接跳首页
  if (!to.meta.requiresAuth && isLogin) {
    console.log('🔀 已登录用户访问登录页，跳转到首页')
    next('/layout/index')
    return
  }

  // 2. 需要授权的路由 → 检查登录状态
  if (to.meta.requiresAuth) {
    if (token) {
      console.log('✅ 权限验证通过，放行')
      next()
    } else {
      console.log('❌ 未登录，跳转到登录页')
      // 只有从内部页面跳转时才显示提示，避免初次访问就弹窗
      if (from.path !== '/' && from.path !== '') {
        ElMessage.warning('请先登录后再访问！')
      }
      next('/')
    }
  } else {
    // 3. 无需授权的路由 → 直接放行
    console.log('🎯 公开路由，直接放行')
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