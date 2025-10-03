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
    <el-container>
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

      <!-- 右侧首页内容-->
      <el-main>
        <router-view></router-view>
      </el-main>

    </el-container>
  </el-container>

  <!-- 修改密码弹窗 -->
  <el-dialog title="修改密码" v-model="isPwdDialogShow" width="400px" center>
    <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdFormRules" label-width="100px" class="pwd-form">
      <el-form-item label="原密码" prop="oldPwd"><el-input type="password" v-model="pwdForm.oldPwd" /></el-form-item>
      <el-form-item label="新密码" prop="newPwd"><el-input type="password" v-model="pwdForm.newPwd" /></el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd"><el-input type="password"
          v-model="pwdForm.confirmPwd" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isPwdDialogShow = false">取消</el-button>
      <el-button type="primary" @click="handlePwdSubmit">确认修改</el-button>
    </template>
  </el-dialog>
</template>


<script setup lang="ts">

//引入组件
import {
  ElContainer, ElHeader, ElAside, ElMain, ElMenu, ElMenuItem,
  ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon, ElDialog,
  ElForm, ElFormItem, ElInput, ElButton, ElMessage, ElMessageBox
} from 'element-plus'

//引入图标
import {
  User, ArrowDown, Lock, SwitchButton as Logout, House, Briefcase, Histogram,
  ShoppingCart, Goods, Menu, UserFilled,
} from '@element-plus/icons-vue'
import { reactive, ref, onMounted, computed } from 'vue' // 新增 computed
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { $logout } from '../../api/employee'
import { useAuthStore } from '../../store/user'

const router = useRouter()
const authStore = useAuthStore()

// 修改：使用 computed 确保响应式更新
const currentUsername = computed(() => authStore.getUsername || '管理员')

const isPwdDialogShow = ref(false)
const pwdFormRef = ref<FormInstance>()
const pwdForm = reactive({ oldPwd: '', newPwd: '', confirmPwd: '' })
const pwdFormRules = reactive<FormRules>({
  oldPwd: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: (r, v, c) => v === pwdForm.newPwd ? c() : c(new Error('两次密码不一致')), trigger: 'blur' }
  ]
})

// 移除旧的 onMounted，因为现在使用 computed

// 其余代码保持不变...
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

const handleDropdownCommand = (c: string) => {
  if (c === 'changePwd') {
    isPwdDialogShow.value = true
  } else if (c === 'logout') {
    handleLogout()
  }
}

const handleMenuSelect = (i: string) => console.log('选中菜单：', i)

const handlePwdSubmit = async () => {
  if (!pwdFormRef.value) return
  try {
    await pwdFormRef.value.validate()
    ElMessage.success('密码修改成功！请重新登录')
    isPwdDialogShow.value = false
    Object.assign(pwdForm, { oldPwd: '', newPwd: '', confirmPwd: '' })
  } catch (e) { 
    ElMessage.error('表单验证失败') 
  }
}
</script>

<style scoped>
/* 1. 整体容器样式不变 */
.app-container {
  width: 100vw;
  height: 100vh;
  background-color: #FFFDF5;
  overflow: hidden;
}

/* 新增：禁止全局滚动 */

/* 2. 顶部Header样式不变 */
.app-header {
  background-color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(255, 184, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 60px;
  /* 固定Header高度，便于计算主体高度 */
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* .logo-icon {
  font-size: 28px;
  color: #FFB800;
} */

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

/* 3. 左侧菜单栏样式不变 */
.app-aside {
  background-color: #FFF9E6;
  border-right: 1px solid #FFE5B4;
  height: calc(100vh - 60px);
  /* 与Header高度匹配，填满剩余高度 */
}

.aside-menu {
  border-right: none;
  height: 100%;
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

/* 5. 修改密码弹窗样式不变 */
.pwd-form {
  margin-top: 16px;
}

/* 6. 响应式适配：进一步优化小屏幕 */
@media (max-width: 1024px) {
  .app-aside {
    width: 64px !important;
  }

  .brand-title {
    display: none;
  }

  .home-intro-card {
    width: 85%;
  }

  /* 从90%改为85%，更紧凑 */
  .el-menu-item span {
    display: none;
  }
}

@media (max-width: 768px) {
  .username {
    display: none;
  }



  /* 从24px改为16px，减少padding */
  .home-intro-card {
    width: 92%;
    padding: 16px;
    /* 从24px改为16px，更紧凑 */
    bottom: 16px;
  }

  .intro-title {
    font-size: 18px;
  }

  .intro-desc {
    font-size: 13px;
  }
}

/* 新增：Logo图片样式，放在.header-left下面 */
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Logo图片样式：固定尺寸，避免拉伸 */
.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 4px;
}
</style>