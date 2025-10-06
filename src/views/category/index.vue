<!-- views/category/index.vue -->
<template>
  <div class="category-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">分类管理</h2>
      <p class="page-desc">管理系统商品分类信息</p>
    </div>

    <!-- 搜索区域 -->
    <div class="search-card">
      <el-card shadow="never" class="search-card-inner">
        <el-form :model="searchForm" ref="searchFormRef" :inline="true">
          <el-form-item label="分类名称" prop="name">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入分类名称"
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
            <span>分类列表</span>
            <span class="total-text">共 {{ total }} 条记录</span>
          </div>
          <div class="table-actions">
            <el-button type="primary" :icon="Plus" @click="handleAdd">
              新增分类
            </el-button>
            <el-button :icon="Refresh" @click="refreshTable">
              刷新
            </el-button>
          </div>
        </div>

        <!-- 分类表格 -->
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
          
          <el-table-column prop="name" label="分类名称" min-width="150" align="center">
            <template #default="scope">
              <span class="category-name">{{ scope.row.name || '-' }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="sort" label="排序" width="100" align="center">
            <template #default="scope">
              <span class="sort-value">{{ scope.row.sort || 0 }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="status" label="状态" width="120" align="center">
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
          
          <el-table-column prop="updateTime" label="操作时间" width="180" align="center">
            <template #default="scope">
              {{ formatTime(scope.row.updateTime) || formatTime(scope.row.createTime) || '-' }}
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="240" fixed="right" align="center">
            <template #default="scope">
              <div class="action-buttons">
                <!-- 修改按钮 -->
                <el-button
                  link
                  type="primary"
                  size="small"
                  :icon="Edit"
                  @click="handleEdit(scope.row)"
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
                >
                  启用
                </el-button>

                <!-- 删除按钮 -->
                <el-button
                  link
                  type="danger"
                  size="small"
                  :icon="Delete"
                  @click="handleDelete(scope.row.id, scope.row.name)"
                  :disabled="scope.row.status === 1"
                >
                  删除
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

    <!-- 新增/编辑分类弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      :title="isEditing ? '编辑分类' : '新增分类'"
      width="500px"
      :before-close="handleAddDialogClose"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="addForm.name"
            placeholder="请输入分类名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="addForm.sort"
            :min="0"
            :max="999"
            controls-position="right"
            placeholder="请输入排序值"
          />
          <div class="sort-tip">数值越小排序越靠前</div>
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
  Check,
  Delete
} from '@element-plus/icons-vue'
import { 
  $getCategoryList, 
  $updateCategoryStatus, 
  $addCategory,
  $updateCategory,
  $deleteCategory
} from '../../api/category'

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

// 新增/编辑分类相关
const addDialogVisible = ref(false)
const addLoading = ref(false)
const isEditing = ref(false)
const currentEditId = ref<number | null>(null)
const addFormRef = ref<FormInstance>()

const addForm = reactive({
  name: '',
  sort: 0
})

// 表单验证规则
const addFormRules: FormRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 20, message: '分类名称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序值', trigger: 'blur' },
    { type: 'number', min: 0, max: 999, message: '排序值范围 0-999', trigger: 'blur' }
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

// 获取分类列表
const fetchCategoryList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.current,
      pageSize: pagination.size,
      ...(searchForm.name && { name: searchForm.name })
    }

    const result = await $getCategoryList(params)
    if (result.code === 1) {
      tableData.value = result.data.records || []
      total.value = result.data.total || 0
      console.log('分类列表获取成功:', tableData.value)
    } else {
      ElMessage.error(result.message || '获取分类列表失败')
      tableData.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败')
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchCategoryList()
}

// 重置搜索
const handleReset = () => {
  if (searchFormRef.value) {
    searchFormRef.value.resetFields()
  }
  pagination.current = 1
  fetchCategoryList()
}

// 刷新表格
const refreshTable = () => {
  fetchCategoryList()
}

// 分页大小改变
const handleSizeChange = (size: number) => {
  pagination.size = size
  pagination.current = 1
  fetchCategoryList()
}

// 当前页改变
const handleCurrentChange = (page: number) => {
  pagination.current = page
  fetchCategoryList()
}

// 启用/禁用分类
const handleStatusChange = async (id: number, status: number) => {
  try {
    const action = status === 1 ? '启用' : '禁用'
    await ElMessageBox.confirm(
      `确定要${action}该分类吗？`,
      `${action}确认`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    console.log(`开始${action}分类，ID: ${id}, 状态: ${status}`)
    
    const result = await $updateCategoryStatus(id, status)
    console.log(`${action}操作返回结果:`, result)
    
    if (result.code === 1) {
      ElMessage.success(`${action}成功`)
      fetchCategoryList()
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

// 删除分类
const handleDelete = async (id: number, name: string) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类"${name}"吗？此操作不可恢复！`,
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error',
        confirmButtonClass: 'el-button--danger'
      }
    )

    console.log(`开始删除分类，ID: ${id}`)
    
    const result = await $deleteCategory(id)
    console.log('删除操作返回结果:', result)
    
    if (result.code === 1) {
      ElMessage.success('删除成功')
      fetchCategoryList()
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  } catch (error: any) {
    if (error === 'cancel') {
      console.log('用户取消删除')
      return
    }
    console.error('删除操作失败:', error)
    ElMessage.error(error.message || '删除失败，请重试')
  }
}

// 新增分类
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
      sort: 0
    })
  }
}

// 编辑分类
const handleEdit = async (row: any) => {
  isEditing.value = true
  currentEditId.value = row.id
  addDialogVisible.value = true

  // 重置表单
  if (addFormRef.value) {
    addFormRef.value.resetFields()
  }

  // 直接使用当前行的数据（因为分类数据相对简单，不需要重新请求详情）
  Object.assign(addForm, {
    name: row.name || '',
    sort: row.sort || 0
  })
  
  console.log('编辑分类数据加载成功:', addForm)
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
      console.log('开始更新分类，ID:', currentEditId.value)
      
      const result = await $updateCategory(currentEditId.value, {
        name: addForm.name,
        sort: addForm.sort
      })

      console.log('更新分类结果:', result)
      
      if (result.code === 1) {
        ElMessage.success('更新分类成功')
        addDialogVisible.value = false
        fetchCategoryList()
      } else {
        ElMessage.error(result.message || '更新分类失败')
      }
    } else {
      // 新增模式
      console.log('开始新增分类')
      
      const result = await $addCategory({
        name: addForm.name,
        sort: addForm.sort
      })

      console.log('新增分类结果:', result)
      
      if (result.code === 1) {
        ElMessage.success('新增分类成功')
        addDialogVisible.value = false
        fetchCategoryList()
      } else {
        ElMessage.error(result.message || '新增分类失败')
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
  fetchCategoryList()
})
</script>

<style scoped>
.category-container {
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

.category-name {
  font-weight: 500;
  color: #333;
}

.sort-value {
  font-weight: 500;
  color: #409EFF;
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
  gap: 8px;
}

.sort-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
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
  .category-container {
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

/* 数字输入框样式优化 */
:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>