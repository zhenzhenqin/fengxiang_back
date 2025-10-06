<template>
  <!-- 整体布局容器：垂直排列 Header + 主体（Aside + Main） -->
  <el-container class="app-container">
    <!-- 1. 顶部 Header：Logo + 用户名下拉 -->
    <el-header class="app-header">
      <!-- 左侧：Logo + 蜂享自然艺术字 -->
      <div class="header-left">
        <img src="../../assets/logo.jpg" class="logo-img" />
        <h1 class="brand-title">蜂享自然</h1>
      </div>

      <!-- 右侧：当前用户名 + 下拉框（修改密码/退出登录） -->
      <div class="header-right">
        <el-dropdown @command="handleDropdownCommand" trigger="click">
          <div class="user-info">
            <el-icon class="user-icon">
              <User />
            </el-icon>
            <span class="username">{{ currentUsername }}</span>
            <el-icon class="arrow-icon">
              <ArrowDown />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="changePwd">
                <el-icon class="menu-icon">
                  <Lock />
                </el-icon>
                <span>修改密码</span>
              </el-dropdown-item>
              <el-dropdown-item command="logout">
                <el-icon class="menu-icon">
                  <Logout />
                </el-icon>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 2. 主体内容：左侧菜单 + 右侧首页 -->
    <el-container class="main-container">
      <!-- 左侧菜单栏：7个模块 + 统一图标样式 -->
      <el-aside class="app-aside" width="220px">
        <el-menu router class="aside-menu" background-color="#FFF9E6" text-color="#A07852" active-text-color="#614028"
          default-active="1" @select="handleMenuSelect">
          <el-menu-item index="index">
            <el-icon class="menu-icon">
              <House />
            </el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="dashboard">
            <el-icon class="menu-icon">
              <Briefcase />
            </el-icon>
            <span>工作台</span>
          </el-menu-item>
          <el-menu-item index="report">
            <el-icon class="menu-icon">
              <Histogram />
            </el-icon>
            <span>数据统计</span>
          </el-menu-item>
          <el-menu-item index="order">
            <el-icon class="menu-icon">
              <ShoppingCart />
            </el-icon>
            <span>订单管理</span>
          </el-menu-item>
          <el-menu-item index="good">
            <el-icon class="menu-icon">
              <Goods />
            </el-icon>
            <span>商品管理</span>
          </el-menu-item>
          <el-menu-item index="category">
            <el-icon class="menu-icon">
              <Menu />
            </el-icon>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="employee">
            <el-icon class="menu-icon">
              <UserFilled />
            </el-icon>
            <span>员工管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 右侧首页内容 - 修改为可滚动 -->
      <el-main class="main-content">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

  <!-- 修改密码弹窗 -->
  <el-dialog 
    title="修改密码" 
    v-model="isPwdDialogShow" 
    width="400px" 
    center
    :before-close="handlePwdCancel"
  >
    <el-form 
      ref="pwdFormRef" 
      :model="pwdForm" 
      :rules="pwdFormRules" 
      label-width="100px" 
      class="pwd-form"
    >
      <el-form-item label="原密码" prop="oldPwd">
        <el-input 
          type="password" 
          v-model="pwdForm.oldPwd" 
          placeholder="请输入原密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input 
          type="password" 
          v-model="pwdForm.newPwd" 
          placeholder="请输入新密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input 
          type="password" 
          v-model="pwdForm.confirmPwd"
          placeholder="请再次输入新密码"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handlePwdCancel">取消</el-button>
      <el-button type="primary" @click="handlePwdSubmit" :loading="false">
        确认修改
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// 引入组件
import {
  ElContainer, ElHeader, ElAside, ElMain, ElMenu, ElMenuItem,
  ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon, ElDialog,
  ElForm, ElFormItem, ElInput, ElButton, ElMessage, ElMessageBox
} from 'element-plus'

// 引入图标
import {
  User, ArrowDown, Lock, SwitchButton as Logout, House, Briefcase, Histogram,
  ShoppingCart, Goods, Menu, UserFilled,
} from '@element-plus/icons-vue'
import { reactive, ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { $logout, $updatePassword } from '../../api/employee' // 新增 $updatePassword
import { useAuthStore } from '../../store/user'

const router = useRouter()
const authStore = useAuthStore()

// 使用 computed 确保响应式更新
const currentUsername = computed(() => authStore.getUsername || '管理员')

const isPwdDialogShow = ref(false)
const pwdFormRef = ref<FormInstance>()
const pwdForm = reactive({ 
  oldPwd: '', 
  newPwd: '', 
  confirmPwd: '' 
})

// 密码验证规则
const pwdFormRules = reactive<FormRules>({
  oldPwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value === pwdForm.oldPwd) {
          callback(new Error('新密码不能与原密码相同'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ],
  confirmPwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== pwdForm.newPwd) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ]
})

// 打开修改密码弹窗时的处理
const handleChangePwdDialogOpen = () => {
  isPwdDialogShow.value = true
  // 下次DOM更新时重置表单
  nextTick(() => {
    if (pwdFormRef.value) {
      pwdFormRef.value.resetFields()
    }
  })
}

// 修改密码提交
const handlePwdSubmit = async () => {
  if (!pwdFormRef.value) return
  
  try {
    // 表单验证
    await pwdFormRef.value.validate()
    
    console.log('开始修改密码...')
    
    // 调用修改密码接口
    const result = await $updatePassword({
      oldPassword: pwdForm.oldPwd,
      newPassword: pwdForm.newPwd
    })
    
    if (result.code === 1) {
      // 修改成功
      ElMessage.success(result.message || '密码修改成功！')
      
      // 关闭弹窗
      isPwdDialogShow.value = false
      
      // 重置表单
      pwdFormRef.value.resetFields()
      
      // 提示用户重新登录（根据业务需求决定是否需要重新登录）
      ElMessage.info('为了安全起见，请重新登录')
      
      // 延迟跳转到登录页
      setTimeout(() => {
        authStore.logout()
        router.replace('/')
      }, 1500)
      
    } else {
      // 修改失败
      ElMessage.error(result.message || '密码修改失败，请重试')
    }
    
  } catch (error) {
    // 表单验证失败
    console.error('密码修改失败:', error)
    ElMessage.error('密码修改失败')
  }
}

// 取消修改密码
const handlePwdCancel = () => {
  isPwdDialogShow.value = false
  if (pwdFormRef.value) {
    pwdFormRef.value.resetFields()
  }
}

// 退出登录（保持不变）
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '退出确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    console.log('开始执行退出登录流程...')
    
    const result = await $logout()
    console.log('退出接口返回:', result)
    
    authStore.logout()
    console.log('前端状态已清除')
    
    ElMessage.success('已退出登录')
    
    router.replace('/').then(() => {
      console.log('跳转成功')
    }).catch(err => {
      console.error('路由跳转失败:', err)
      window.location.href = '/'
    })
    
  } catch (error) {
    if (error === 'cancel') {
      console.log('用户取消退出')
      return
    }
    
    console.error('退出过程发生错误:', error)
    authStore.logout()
    ElMessage.warning('已退出本地登录')
    router.replace('/')
  }
}

// 下拉菜单命令处理
const handleDropdownCommand = (c: string) => {
  if (c === 'changePwd') {
    handleChangePwdDialogOpen()
  } else if (c === 'logout') {
    handleLogout()
  }
}

const handleMenuSelect = (i: string) => console.log('选中菜单：', i)
</script>

<style scoped>
/* 1. 整体容器样式 - 修改为允许滚动 */
.app-container {
  width: 100vw;
  height: 100vh;
  background-color: #FFFDF5;
  /* 移除 overflow: hidden 以允许滚动 */
  display: flex;
  flex-direction: column;
}

/* 2. 顶部Header样式不变 */
.app-header {
  background-color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(255, 184, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 60px;
  flex-shrink: 0; /* 防止header被压缩 */
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(90deg, #FFB800, #8B4513);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #FFF9E6;
}

.user-icon,
.arrow-icon {
  font-size: 18px;
  color: #A07852;
}

.username {
  font-size: 15px;
  color: #614028;
  font-weight: 500;
}

.el-dropdown-menu {
  border-radius: 8px;
  border: 1px solid #FFE5B4;
  box-shadow: 0 4px 16px rgba(255, 184, 0, 0.15);
}

/* 3. 主容器 - 修改为可滚动 */
.main-container {
  flex: 1;
  height: calc(100vh - 60px);
  overflow: hidden; /* 外层容器隐藏滚动条 */
}

/* 4. 左侧菜单栏样式 - 修改高度 */
.app-aside {
  background-color: #FFF9E6;
  border-right: 1px solid #FFE5B4;
  height: 100%;
  overflow-y: auto; /* 如果菜单项很多，允许菜单滚动 */
}

.aside-menu {
  border-right: none;
  height: auto; /* 改为自动高度 */
  min-height: 100%; /* 确保菜单至少占满整个高度 */
}

.el-menu-item {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  border-radius: 8px;
  margin: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-icon {
  font-size: 16px !important;
  color: inherit !important;
  width: 20px;
  text-align: center;
}

.el-menu-item:hover {
  background-color: #FFEDCC !important;
  color: #7D5A3C !important;
}

.el-menu-item.is-active {
  background-color: #FFF3D0 !important;
}

/* 5. 主内容区域 - 修改为可滚动 */
.main-content {
  padding: 0;
  height: 100%;
  overflow-y: auto; /* 允许内容区域滚动 */
  background-color: #f8f9fa; /* 添加背景色，与商品管理页面保持一致 */
}

/* 6. 修改密码弹窗样式不变 */
.pwd-form {
  margin-top: 16px;
}

/* 7. Logo图片样式 */
.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 4px;
}

/* 8. 响应式适配 */
@media (max-width: 1024px) {
  .app-aside {
    width: 64px !important;
  }

  .brand-title {
    display: none;
  }

  .el-menu-item span {
    display: none;
  }
}

@media (max-width: 768px) {
  .username {
    display: none;
  }
}
</style>