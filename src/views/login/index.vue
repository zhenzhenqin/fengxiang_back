<template>
  <!-- 你原有布局、样式完全不变！ -->
  <div class="login-page">
    <div class="login-container">
      <div class="login-left">
        <img src="https://img95.699pic.com/photo/60077/3130.jpg_wh860.jpg" alt="蜂蜜图片" class="honey-img" />
        <div class="hover-intro">
          <h3>蜂享自然</h3>
          <p>自然馈赠的甜蜜，无添加原生态蜂蜜</p>
        </div>
      </div>
      <div class="login-right">
        <div class="brand">
          <span class="brand-icon">🌿</span>
          <div class="brand-text">
            <h2>蜂享自然</h2>
            <p>自然馈赠 · 纯粹甜蜜</p>
          </div>
        </div>
        <el-form ref="formRef" class="form" :model="formData" status-icon :rules="rules" label-width="0px">
          <el-form-item prop="username" class="form-item">
            <div class="input-box">
              <span class="icon">👤</span>
              <el-input v-model="formData.username" placeholder="请输入用户名" class="input-field" @keyup.enter="submitForm(formRef)" />
            </div>
          </el-form-item>
          <el-form-item prop="password" class="form-item">
            <div class="input-box">
              <span class="icon">🔒</span>
              <el-input v-model="formData.password" type="password" placeholder="请输入密码" class="input-field" @keyup.enter="submitForm(formRef)" />
            </div>
          </el-form-item>
          <el-form-item class="form-item">
            <div class="btn-group">
              <el-button type="primary"  class="login-btn" @click="submitForm(formRef)">
                登录
              </el-button>
              <el-button @click="resetForm(formRef)" class="cancel-btn">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue' // 新增onMounted
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import router from '../../router'
import { $login } from '../../api/employee'
// 新增：导入Pinia Auth Store
import { useAuthStore } from '../../store/user'

const formRef = ref<FormInstance>()
// 新增：获取Pinia Store实例
const authStore = useAuthStore()

// 你原有表单数据、验证函数完全不变
const formData = reactive({
  username: '',
  password: '',
})

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入用户名'))
  } else {
    callback()
  }
}

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<typeof formData>>({
  username: [{ validator: validatePass, trigger: 'blur' }],
  password: [{ validator: validatePass2, trigger: 'blur' }],
})

// 新增：页面挂载后检查Pinia状态（已登录直接跳首页）
// login.vue 的 onMounted
onMounted(() => {
  // 使用 getter 确保获取最新状态
  if (authStore.getIsLogin) {
    console.log('🔐 检测到已登录，自动跳转到首页')
    router.replace('/layout/index')
  }
})

// 修改：表单提交（取消Token循环检查，用Pinia同步状态）
// login.vue 中的submitForm方法
const submitForm = async (formEl: FormInstance | undefined) => {
  console.log('📌 submitForm 被调用')
  if (!formEl) return
  try {
    await formEl.validate()
    console.log('1. 表单验证通过，调用$login')

    const result = await $login(formData)
    console.log('2. $login返回结果：', result)

    // 确保Pinia状态更新完成后再跳转
    if (result?.code === 1) {
      console.log('3. 登录成功，从Pinia获取Token：', authStore.token)
      
      // 添加微小延迟确保状态同步
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // 使用replace而不是push，避免历史记录问题
      router.replace('/layout/index').then(() => {
        console.log('4. router.replace成功，已跳转到首页')
      }).catch(err => {
        console.error('4. router.replace失败原因：', err)
        // 使用location.replace而不是href，避免历史记录问题
        window.location.replace('/layout/index')
      })
    } else {
      console.log('3. $login返回code≠1，不跳转')
    }
  } catch (err) {
    console.error('5. 表单验证失败：', err)
    ElMessage.error('请完善表单信息')
  }
}

// 你原有重置表单逻辑完全不变
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped>
/* 你原有样式完全不变！ */
.login-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #FFF3D0 0%, #FFD770 100%);
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.login-container {
  width: 100%;
  max-width: 1000px;
  height: 500px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(255, 193, 7, 0.2);
  display: flex;
  overflow: hidden;
  margin-top: 15vh;
}

.login-left {
  width: 50%;
  height: 100%;
  position: relative;
}

.honey-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hover-intro {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 25px;
  width: 70%;
  border-radius: 8px 0 0 8px;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.05);
}

.hover-intro h3 {
  margin: 0 0 10px 0;
  font-size: 22px;
  color: #FFB800;
}

.hover-intro p {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.login-right {
  width: 50%;
  height: 100%;
  padding: 50px 40px;
  box-sizing: border-box;
}

.brand {
  display: flex;
  align-items: center;
  margin-bottom: 55px;
}

.brand-icon {
  font-size: 32px;
  color: #FFB800;
  margin-right: 12px;
}

.brand-text h2 {
  margin: 0;
  font-size: 26px;
  color: #FFB800;
}

.brand-text p {
  margin: 5px 0 0 0;
  font-size: 13px;
  color: #999;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.form-item {
  margin-bottom: 0 !important;
  padding: 0;
}

.input-box {
  display: flex;
  align-items: center;
  border: 1px solid #F5F5F5;
  border-radius: 8px;
  padding: 0 16px;
  height: 48px;
  width: 100%;
}

.icon {
  font-size: 18px;
  color: #999;
  margin-right: 12px;
}

.input-field {
  width: 100% !important;
  height: 100%;
  border: none !important;
  outline: none !important;
  font-size: 15px;
  color: #333;
  background: transparent !important;
  min-width: 0 !important;
}

.input-field::placeholder {
  color: #CCC;
  font-size: 14px;
}

.btn-group {
  display: flex;
  gap: 16px;
}

.login-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px !important;
  background-color: #FFB800 !important;
  border: none !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  color: white !important;
}

.login-btn:hover {
  background-color: #FFA700 !important;
}

.cancel-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px !important;
  border: 1px solid #F5F5F5 !important;
  font-size: 16px !important;
  color: #666 !important;
  background-color: white !important;
}

.cancel-btn:hover {
  background-color: #F9F9F9 !important;
}

@media (max-width: 768px) {
  .login-container {
    margin-top: 10vh;
    flex-direction: column;
    height: auto;
    max-height: 90vh;
    overflow-y: auto;
  }

  .login-left,
  .login-right {
    width: 100%;
  }

  .login-left {
    height: 220px;
  }

  .hover-intro {
    width: 100%;
    border-radius: 0 0 8px 8px;
    top: auto;
    bottom: 0;
    transform: none;
  }

  .btn-group {
    flex-direction: column;
    gap: 12px;
  }
}
</style>