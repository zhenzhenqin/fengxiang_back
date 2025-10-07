<!-- views/employee/index.vue -->
<template>
  <div class="employee-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">员工管理</h2>
      <p class="page-desc">管理系统员工账号信息</p>
    </div>

    <!-- 搜索区域 -->
    <div class="search-card">
      <el-card shadow="never" class="search-card-inner">
        <el-form :model="searchForm" ref="searchFormRef" :inline="true">
          <el-form-item label="员工姓名" prop="name">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入员工姓名"
              clearable
              style="width: 200px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" :icon="Search">
              搜索
            </el-button>
            <el-button @click="handleReset" :icon="Refresh">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 表格区域 -->
    <div class="table-card">
      <el-card shadow="never">
        <!-- 表格顶部操作栏 -->
        <div class="table-header">
          <div class="table-title">
            <span>员工列表</span>
            <span class="total-text">共 {{ total }} 条记录</span>
          </div>
          <div class="table-actions">
            <el-button type="primary" :icon="Plus" @click="handleAdd">
              新增员工
            </el-button>
            <el-button :icon="Refresh" @click="refreshTable">
              刷新
            </el-button>
          </div>
        </div>

        <!-- 员工表格 -->
        <el-table
          :data="tableData"
          v-loading="loading"
          style="width: 100%"
          :header-cell-style="{ 
            background: '#FFF9E6', 
            color: '#614028',
            fontWeight: '600'
          }"
          row-key="id"
        >
          <el-table-column 
            type="index" 
            label="序号" 
            width="80" 
            align="center"
            :index="indexMethod"
          />
          
          <el-table-column prop="name" label="员工姓名" min-width="120" align="center">
            <template #default="scope">
              <span class="employee-name">{{ scope.row.name || '-' }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="username" label="员工账号" min-width="120" align="center" />
          
          <el-table-column prop="phone" label="手机号" min-width="130" align="center">
            <template #default="scope">
              {{ scope.row.phone || '-' }}
            </template>
          </el-table-column>

          <el-table-column prop="sex" label="性别" width="80" align="center">
            <template #default="scope">
              <el-tag 
                :type="getSexDisplay(scope.row.sex) === '男' ? 'primary' : 'danger'" 
                size="small"
              >
                {{ getSexDisplay(scope.row.sex) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="status" label="账号状态" width="120" align="center">
            <template #default="scope">
              <div class="status-cell">
                <span 
                  class="status-dot" 
                  :class="scope.row.status === 1 ? 'status-active' : 'status-inactive'"
                ></span>
                <span :class="scope.row.status === 1 ? 'status-text-active' : 'status-text-inactive'">
                  {{ scope.row.status === 1 ? '启用' : '禁用' }}
                </span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="updateTime" label="最后操作时间" width="180" align="center">
            <template #default="scope">
              {{ formatTime(scope.row.updateTime) || formatTime(scope.row.createTime) || '-' }}
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="200" fixed="right" align="center">
            <template #default="scope">
              <div class="action-buttons">
                <!-- 修改按钮 -->
                <el-button
                  link
                  type="primary"
                  size="small"
                  :icon="Edit"
                  @click="handleEdit(scope.row)"
                  :disabled="!canOperate(scope.row)"
                >
                  修改
                </el-button>
                
                <!-- 启用/禁用按钮 -->
                <el-button
                  v-if="scope.row.status === 1"
                  link
                  type="danger"
                  size="small"
                  :icon="Remove"
                  @click="handleStatusChange(scope.row.id, 0)"
                  :disabled="!canOperate(scope.row)"
                >
                  禁用
                </el-button>
                <el-button
                  v-else
                  link
                  type="success"
                  size="small"
                  :icon="Check"
                  @click="handleStatusChange(scope.row.id, 1)"
                  :disabled="!canOperate(scope.row)"
                >
                  启用
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页部分 -->
        <div class="demo-pagination-block">
          <div class="demonstration">共 {{ total }} 条记录</div>
          <el-pagination
            v-model:current-page="pagination.current"
            v-model:page-size="pagination.size"
            :page-sizes="[10, 20, 50, 100]"
            :disabled="false"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>

    <!-- 新增/编辑员工弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      :title="isEditing ? '编辑员工' : '新增员工'"
      width="500px"
      :before-close="handleAddDialogClose"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
      >
        <el-form-item label="员工姓名" prop="name">
          <el-input
            v-model="addForm.name"
            placeholder="请输入员工姓名"
            maxlength="10"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="员工账号" prop="username" v-if="!isEditing">
          <el-input
            v-model="addForm.username"
            placeholder="请输入员工账号"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="addForm.phone"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="addForm.sex">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNumber">
          <el-input
            v-model="addForm.idNumber"
            placeholder="请输入身份证号"
            maxlength="18"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleAddDialogClose">取消</el-button>
        <el-button type="primary" @click="handleAddSubmit" :loading="addLoading">
          {{ isEditing ? '更新' : '确认' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Remove,
  Check
} from '@element-plus/icons-vue'
import { 
  $getEmployeeList, 
  $updateEmployeeStatus, 
  $addEmployee,
  $getEmployeeById,
  $updateEmployee
} from '../../api/employee'
import { useAuthStore } from '../../store/user'

// 搜索表单
const searchForm = reactive({
  name: ''
})

const searchFormRef = ref<FormInstance>()

// 分页配置
const pagination = reactive({
  current: 1,
  size: 10
})

const total = ref(0)
const loading = ref(false)
const tableData = ref<any[]>([])

// 新增/编辑员工相关
const addDialogVisible = ref(false)
const addLoading = ref(false)
const isEditing = ref(false)
const currentEditId = ref<number | null>(null)
const addFormRef = ref<FormInstance>()

const addForm = reactive({
  name: '',
  username: '',
  phone: '',
  sex: '男',
  idNumber: ''
})

// 表单验证规则
const addFormRules: FormRules = {
  name: [
    { required: true, message: '请输入员工姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入员工账号', trigger: 'blur' },
    { min: 4, max: 20, message: '账号长度在 4 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  sex: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  idNumber: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /^\d{17}[\dXx]$/, message: '请输入正确的身份证号码', trigger: 'blur' }
  ]
}

// 序号计算方法
const indexMethod = (index: number) => {
  return (pagination.current - 1) * pagination.size + index + 1
}

// 格式化时间
const formatTime = (time: string) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-')
}

// 性别显示转换（后端返回1=男，0=女）
const getSexDisplay = (sex: any) => {
  if (sex === 1 || sex === '1') return '男'
  if (sex === 0 || sex === '0') return '女'
  return sex || '-'
}

// 获取员工列表
const fetchEmployeeList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.current,
      pageSize: pagination.size,
      ...(searchForm.name && { name: searchForm.name })
    }

    const result = await $getEmployeeList(params)
    if (result.code === 1) {
      tableData.value = result.data.records || []
      total.value = result.data.total || 0
      console.log('员工列表获取成功:', tableData.value)
    } else {
      ElMessage.error(result.message || '获取员工列表失败')
      tableData.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取员工列表失败:', error)
    ElMessage.error('获取员工列表失败')
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchEmployeeList()
}

// 重置搜索
const handleReset = () => {
  if (searchFormRef.value) {
    searchFormRef.value.resetFields()
  }
  pagination.current = 1
  fetchEmployeeList()
}

// 刷新表格
const refreshTable = () => {
  fetchEmployeeList()
}

// 分页大小改变
const handleSizeChange = (size: number) => {
  pagination.size = size
  pagination.current = 1
  fetchEmployeeList()
}

// 当前页改变
const handleCurrentChange = (page: number) => {
  pagination.current = page
  fetchEmployeeList()
}

//操作权限判断
const canOperate = (row: any) => {
  const authStore = useAuthStore()
  const currentUsername = authStore.getUsername
  return currentUsername === row.username || currentUsername === 'admin' || currentUsername === 'chaixiushen'
}

// 启用/禁用员工
const handleStatusChange = async (id: number, status: number) => {
  try {
    const action = status === 1 ? '启用' : '禁用'
    await ElMessageBox.confirm(
      `确定要${action}该员工账号吗？`,
      `${action}确认`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    console.log(`开始${action}员工，ID: ${id}, 状态: ${status}`)
    
    const result = await $updateEmployeeStatus(id, status)
    console.log(`${action}操作返回结果:`, result)
    
    if (result.code === 1) {
      ElMessage.success(`${action}成功`)
      fetchEmployeeList()
    } else {
      ElMessage.error(result.message || `${action}失败`)
    }
  } catch (error: any) {
    if (error === 'cancel') {
      console.log('用户取消操作')
      return
    }
    console.error(`${status === 1 ? '启用' : '禁用'}操作失败:`, error)
    ElMessage.error(error.message || `${status === 1 ? '启用' : '禁用'}失败，请重试`)
  }
}

// 新增员工
const handleAdd = () => {
  isEditing.value = false
  currentEditId.value = null
  addDialogVisible.value = true
  
  // 重置表单
  if (addFormRef.value) {
    addFormRef.value.resetFields()
    // 设置默认值
    Object.assign(addForm, {
      name: '',
      username: '',
      phone: '',
      sex: '男',
      idNumber: ''
    })
  }
}

// 编辑员工
const handleEdit = async (row: any) => {
  isEditing.value = true
  currentEditId.value = row.id
  addDialogVisible.value = true

  // 重置表单
  if (addFormRef.value) {
    addFormRef.value.resetFields()
  }

  // 获取员工详情
  try {
    const result = await $getEmployeeById(row.id)
    console.log('获取员工详情结果:', result)
    
    if (result.code === 1 && result.data) {
      // 转换性别显示：1=男，0=女
      const sexDisplay = result.data.sex === 1 || result.data.sex === '1' ? '男' : '女'
      
      Object.assign(addForm, {
        name: result.data.name || '',
        phone: result.data.phone || '',
        sex: sexDisplay,
        idNumber: result.data.idNumber || ''
      })
      console.log('编辑员工数据加载成功:', addForm)
    } else {
      ElMessage.error(result.message || '获取员工信息失败')
    }
  } catch (error) {
    console.error('获取员工信息失败:', error)
    ElMessage.error('获取员工信息失败')
  }
}

// 关闭新增弹窗
const handleAddDialogClose = () => {
  addDialogVisible.value = false
  if (addFormRef.value) {
    addFormRef.value.resetFields()
  }
}

// 提交新增/编辑表单
const handleAddSubmit = async () => {
  if (!addFormRef.value) return

  try {
    // 验证表单
    await addFormRef.value.validate()
    addLoading.value = true

    if (isEditing.value && currentEditId.value) {
      // 编辑模式
      console.log('开始更新员工，ID:', currentEditId.value)
      
      const result = await $updateEmployee(currentEditId.value, {
        name: addForm.name,
        phone: addForm.phone,
        sex: addForm.sex,
        idNumber: addForm.idNumber
      })

      console.log('更新员工结果:', result)
      
      if (result.code === 1) {
        ElMessage.success('更新员工成功')
        addDialogVisible.value = false
        fetchEmployeeList()
      } else {
        ElMessage.error(result.message || '更新员工失败')
      }
    } else {
      // 新增模式
      console.log('开始新增员工')
      
      const result = await $addEmployee({
        name: addForm.name,
        username: addForm.username,
        phone: addForm.phone,
        sex: addForm.sex,
        idNumber: addForm.idNumber
      })

      console.log('新增员工结果:', result)
      
      if (result.code === 1) {
        ElMessage.success('新增员工成功')
        addDialogVisible.value = false
        fetchEmployeeList()
      } else {
        ElMessage.error(result.message || '新增员工失败')
      }
    }
  } catch (error) {
    // 表单验证失败
    console.error('表单验证失败:', error)
    ElMessage.error('请完善表单信息')
  } finally {
    addLoading.value = false
  }
}

// 初始化
onMounted(() => {
  fetchEmployeeList()
})
</script>

<style scoped>
/* 样式保持不变 */
.employee-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.page-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.search-card {
  margin-bottom: 20px;
}

.search-card-inner {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.table-card {
  margin-bottom: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.total-text {
  font-size: 14px;
  color: #666;
  margin-left: 12px;
  font-weight: normal;
}

.table-actions {
  display: flex;
  gap: 12px;
}

.employee-name {
  font-weight: 500;
  color: #333;
}

.status-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-active {
  background-color: #67c23a;
}

.status-inactive {
  background-color: #f56c6c;
}

.status-text-active {
  color: #67c23a;
  font-weight: 500;
}

.status-text-inactive {
  color: #f56c6c;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

/* 分页样式 */
.demo-pagination-block {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demonstration {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .employee-container {
    padding: 16px;
  }
  
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .table-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .demo-pagination-block {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .demonstration {
    width: 100%;
  }
  
  :deep(.el-pagination) {
    justify-content: flex-start;
  }
}

/* 确保分页组件在移动端正常显示 */
@media (max-width: 576px) {
  :deep(.el-pagination__sizes),
  :deep(.el-pagination__jump) {
    margin-top: 8px;
  }
}
</style>