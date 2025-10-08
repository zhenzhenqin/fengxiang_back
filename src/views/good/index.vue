<!-- views/good/index.vue -->
<template>
  <div class="good-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">商品管理</h2>
      <p class="page-desc">管理系统商品信息</p>
    </div>

    <!-- 搜索区域 -->
    <div class="search-card">
      <el-card shadow="never" class="search-card-inner">
        <el-form :model="searchForm" ref="searchFormRef" :inline="true">
          <el-form-item label="商品名称" prop="name">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入商品名称"
              clearable
              style="width: 200px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="商品分类" prop="categoryId">
            <el-select
              v-model="searchForm.categoryId"
              placeholder="请选择商品分类"
              clearable
              style="width: 200px"
            >
              <el-option
                v-for="category in categoryList"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="售卖状态" prop="status">
            <el-select
              v-model="searchForm.status"
              placeholder="请选择售卖状态"
              clearable
              style="width: 200px"
            >
              <el-option label="启售" :value="1" />
              <el-option label="停售" :value="0" />
            </el-select>
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
            <span>商品列表</span>
            <span class="total-text">共 {{ total }} 条记录</span>
          </div>
          <div class="table-actions">
            <el-button 
              type="danger" 
              :icon="Delete" 
              @click="handleBatchDelete"
              :disabled="selectedRows.length === 0"
            >
              批量删除
            </el-button>
            <el-button type="primary" :icon="Plus" @click="handleAdd">
              新增商品
            </el-button>
            <el-button :icon="Refresh" @click="refreshTable">
              刷新
            </el-button>
          </div>
        </div>

        <!-- 商品表格 -->
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
          @selection-change="handleSelectionChange"
          @scroll="handleTableScroll"
        >
          <el-table-column type="selection" width="55" align="center" />
          
          <el-table-column 
            type="index" 
            label="序号" 
            width="80" 
            align="center"
            :index="indexMethod"
          />
          
          <el-table-column label="商品图片" width="120" align="center">
            <template #default="scope">
              <div class="image-cell">
                <el-image
                  v-if="scope.row.image"
                  :src="scope.row.image"
                  :preview-src-list="[scope.row.image]"
                  fit="cover"
                  class="good-image"
                >
                  <template #error>
                    <div class="image-slot">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
                <div v-else class="no-image">暂无图片</div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="name" label="商品名称" min-width="150" align="center">
            <template #default="scope">
              <span class="good-name">{{ scope.row.name || '-' }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="categoryName" label="商品分类" min-width="120" align="center">
            <template #default="scope">
              {{ scope.row.categoryName || '-' }}
            </template>
          </el-table-column>
          
          <el-table-column prop="price" label="价格" width="120" align="center">
            <template #default="scope">
              <span class="price">¥{{ scope.row.price || '0.00' }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="status" label="售卖状态" width="120" align="center">
            <template #default="scope">
              <div class="status-cell">
                <span 
                  class="status-dot" 
                  :class="scope.row.status === 1 ? 'status-active' : 'status-inactive'"
                ></span>
                <span :class="scope.row.status === 1 ? 'status-text-active' : 'status-text-inactive'">
                  {{ scope.row.status === 1 ? '启售' : '停售' }}
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
                  停售
                </el-button>
                <el-button
                  v-else
                  link
                  type="success"
                  size="small"
                  :icon="Check"
                  @click="handleStatusChange(scope.row.id, 1)"
                >
                  起售
                </el-button>

                <!-- 删除按钮 -->
                <el-button
                  link
                  type="danger"
                  size="small"
                  :icon="Delete"
                  @click="handleDelete(scope.row.id, scope.row.name)"
                 
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页和滚动加载状态 -->
        <div class="data-footer">
          <!-- 分页部分 -->
          <div class="demo-pagination-block">
            <div class="demonstration">共 {{ total }} 条记录</div>
            <el-pagination
              v-model:current-page="pagination.current"
              v-model:page-size="pagination.size"
              :page-sizes="[5, 10, 20, 50, 100]"
              :disabled="false"
              :background="true"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>

          <!-- 滚动加载提示 -->
          <div v-if="scrollLoading" class="scroll-loading">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>正在加载更多数据...</span>
          </div>
          <div v-else-if="tableData.length > 0" class="no-more-data">
            <span>已加载全部数据</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 新增/编辑商品弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      :title="isEditing ? '编辑商品' : '新增商品'"
      width="600px"
      :before-close="handleAddDialogClose"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input
            v-model="addForm.name"
            placeholder="请输入商品名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="商品分类" prop="categoryId">
          <el-select
            v-model="addForm.categoryId"
            placeholder="请选择商品分类"
            style="width: 100%"
          >
            <el-option
              v-for="category in categoryList"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="商品价格" prop="price">
          <el-input-number
            v-model="addForm.price"
            :min="0"
            :max="99999"
            :precision="2"
            :step="0.1"
            controls-position="right"
            placeholder="请输入商品价格"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="商品图片" prop="image">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="handleUpload"
          >
            <img v-if="addForm.image" :src="addForm.image" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                支持 jpg、png 格式，大小不超过 2MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="addForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入商品描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleAddDialogClose">取消</el-button>
          <el-button 
            v-if="!isEditing" 
            type="primary" 
            @click="handleSaveAndContinue"
            :loading="addLoading"
          >
            保存并继续添加
          </el-button>
          <el-button 
            type="primary" 
            @click="handleAddSubmit" 
            :loading="addLoading"
          >
            {{ isEditing ? '更新' : '保存' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules, type UploadProps } from 'element-plus'
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Remove,
  Check,
  Delete,
  Picture,
  Loading
} from '@element-plus/icons-vue'
import { 
  $getGoodList, 
  $updateGoodStatus, 
  $addGood,
  $updateGood,
  $getGoodById,
  $deleteGoods
} from '../../api/good'
import { $getCategoryList } from '../../api/category'
import { $uploadFile } from '../../utils/upload'

// 搜索表单
const searchForm = reactive({
  name: '',
  categoryId: undefined as number | undefined,
  status: undefined as number | undefined
})

const searchFormRef = ref<FormInstance>()

// 分页配置
const pagination = reactive({
  current: 1,
  size: 20
})

const total = ref(0)
const loading = ref(false)
const scrollLoading = ref(false)
const tableData = ref<any[]>([])
const selectedRows = ref<any[]>([])
const categoryList = ref<any[]>([])

// 滚动加载相关
const hasMore = ref(true)
const allData = ref<any[]>([]) // 存储所有数据用于滚动加载
const scrollPageSize = 20 // 每次滚动加载的数据量

// 新增/编辑商品相关
const addDialogVisible = ref(false)
const addLoading = ref(false)
const isEditing = ref(false)
const currentEditId = ref<number | null>(null)
const addFormRef = ref<FormInstance>()

const addForm = reactive({
  name: '',
  categoryId: undefined as number | undefined,
  price: 0,
  image: '',
  description: ''
})

// 表单验证规则
const addFormRules: FormRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '商品名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于等于0', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入商品描述', trigger: 'blur' },
    { min: 5, max: 200, message: '商品描述长度在 5 到 200 个字符', trigger: 'blur' }
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
  try {
    const result = await $getCategoryList({ page: 1, pageSize: 1000 })
    if (result.code === 1) {
      categoryList.value = result.data.records || []
    } else {
      ElMessage.error(result.msg || '获取分类列表失败')
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败')
  }
}

// 获取商品列表 - 支持分页和滚动加载
const fetchGoodList = async (isScrollLoad = false) => {
  if (isScrollLoad) {
    scrollLoading.value = true
  } else {
    loading.value = true
  }
  
  try {
    const params = {
      page: pagination.current,
      pageSize: isScrollLoad ? scrollPageSize : pagination.size,
      ...(searchForm.name && { name: searchForm.name }),
      ...(searchForm.categoryId && { categoryId: searchForm.categoryId }),
      ...(searchForm.status !== undefined && { status: searchForm.status })
    }

    const result = await $getGoodList(params)
    if (result.code === 1) {
      // 映射分类名称
      const goodsWithCategoryName = (result.data.records || []).map((item: any) => {
        const category = categoryList.value.find(cat => cat.id === item.categoryId)
        return {
          ...item,
          categoryName: category ? category.name : '-'
        }
      })
      
      if (isScrollLoad) {
        // 滚动加载，追加数据
        tableData.value = [...tableData.value, ...goodsWithCategoryName]
        // 检查是否还有更多数据
        hasMore.value = goodsWithCategoryName.length >= scrollPageSize
      } else {
        // 普通分页加载
        tableData.value = goodsWithCategoryName
        total.value = result.data.total || 0
        // 重置滚动加载状态
        hasMore.value = true
        allData.value = goodsWithCategoryName
      }
    } else {
      ElMessage.error(result.msg || '获取商品列表失败')
      if (!isScrollLoad) {
        tableData.value = []
        total.value = 0
      }
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
    if (!isScrollLoad) {
      tableData.value = []
      total.value = 0
    }
  } finally {
    loading.value = false
    scrollLoading.value = false
  }
}

// 表格滚动事件处理
const handleTableScroll = (event: any) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target
  // 当滚动到底部时加载更多数据
  if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore.value && !scrollLoading.value) {
    loadMoreData()
  }
}

// 监听窗口滚动事件
const handleWindowScroll = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
  const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
  
  // 当滚动到底部时加载更多数据
  if (scrollHeight - scrollTop <= clientHeight + 100 && hasMore.value && !scrollLoading.value) {
    loadMoreData()
  }
}


// 加载更多数据
const loadMoreData = () => {
  if (scrollLoading.value || !hasMore.value) return
  
  // 使用分页的下一页来加载更多数据
  const nextPage = Math.floor(tableData.value.length / scrollPageSize) + 1
  pagination.current = nextPage
  fetchGoodList(true)
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchGoodList()
}

// 重置搜索
const handleReset = () => {
  if (searchFormRef.value) {
    searchFormRef.value.resetFields()
  }
  pagination.current = 1
  fetchGoodList()
}

// 刷新表格
const refreshTable = () => {
  fetchGoodList()
}

// 分页大小改变
const handleSizeChange = (size: number) => {
  pagination.size = size
  pagination.current = 1
  fetchGoodList()
}

// 当前页改变
const handleCurrentChange = (page: number) => {
  pagination.current = page
  fetchGoodList()
}

// 表格选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 启用/禁用商品
const handleStatusChange = async (id: number, status: number) => {
  try {
    const action = status === 1 ? '起售' : '停售'
    await ElMessageBox.confirm(
      `确定要${action}该商品吗？`,
      `${action}确认`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    console.log(`开始${action}商品，ID: ${id}, 状态: ${status}`)
    
    const result = await $updateGoodStatus(id, status)
    console.log(`${action}操作返回结果:`, result)
    
    if (result.code === 1) {
      ElMessage.success(`${action}成功`)
      fetchGoodList()
    } else {
      ElMessage.error(result.msg || `${action}失败`)
    }
  } catch (error: any) {
    if (error === 'cancel') {
      console.log('用户取消操作')
      return
    }
    console.error(`${status === 1 ? '起售' : '停售'}操作失败:`, error)
    ElMessage.error(error.message || `${status === 1 ? '起售' : '停售'}失败，请重试`)
  }
}

// 删除商品
const handleDelete = async (id: number, name: string) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除商品"${name}"吗？此操作不可恢复！`,
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error',
        confirmButtonClass: 'el-button--danger'
      }
    )

    console.log(`开始删除商品，ID: ${id}`)
    
    const result = await $deleteGoods([id])
    console.log('删除操作返回结果:', result)
    
    if (result.code === 1) {
      ElMessage.success('删除成功')
      fetchGoodList()
    } else {
      ElMessage.error(result.msg || '删除失败')
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

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的商品')
    return
  }

  try {
    const names = selectedRows.value.map(item => item.name).join('、')
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 个商品吗？\n${names}`,
      '批量删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error',
        confirmButtonClass: 'el-button--danger'
      }
    )

    const ids = selectedRows.value.map(item => item.id)
    console.log(`开始批量删除商品，IDs: ${ids}`)
    
    const result = await $deleteGoods(ids)
    console.log('批量删除操作返回结果:', result)
    
    if (result.code === 1) {
      ElMessage.success('批量删除成功')
      selectedRows.value = []
      fetchGoodList()
    } else {
      ElMessage.error(result.msg || '批量删除失败')
    }
  } catch (error: any) {
    if (error === 'cancel') {
      console.log('用户取消批量删除')
      return
    }
    console.error('批量删除操作失败:', error)
    ElMessage.error(error.message || '批量删除失败，请重试')
  }
}

// 文件上传前校验
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPGOrPNG) {
    ElMessage.error('上传图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 处理文件上传
const handleUpload = async (options: any) => {
  try {
    const result = await $uploadFile(options.file)
    if (result.code === 1) {
      addForm.image = result.data
      ElMessage.success('图片上传成功')
    } else {
      ElMessage.error(result.message || '图片上传失败')
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error('图片上传失败')
  }
}

// 新增商品
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
      categoryId: undefined,
      price: 0,
      image: '',
      description: ''
    })
  }
}

// 编辑商品
const handleEdit = async (row: any) => {
  isEditing.value = true
  currentEditId.value = row.id
  addDialogVisible.value = true

  // 重置表单
  if (addFormRef.value) {
    addFormRef.value.resetFields()
  }

  // 获取商品详情
  try {
    const result = await $getGoodById(row.id)
    console.log('获取商品详情结果:', result)
    
    if (result.code === 1 && result.data) {
      Object.assign(addForm, {
        name: result.data.name || '',
        categoryId: result.data.categoryId || undefined,
        price: result.data.price || 0,
        image: result.data.image || '',
        description: result.data.description || ''
      })
      console.log('编辑商品数据加载成功:', addForm)
    } else {
      ElMessage.error(result.msg || '获取商品信息失败')
    }
  } catch (error) {
    console.error('获取商品信息失败:', error)
    ElMessage.error('获取商品信息失败')
  }
}

// 关闭新增弹窗
const handleAddDialogClose = () => {
  addDialogVisible.value = false
  if (addFormRef.value) {
    addFormRef.value.resetFields()
  }
}

// 保存并继续添加
const handleSaveAndContinue = async () => {
  if (!addFormRef.value) return

  try {
    await addFormRef.value.validate()
    addLoading.value = true

    const result = await $addGood({
      name: addForm.name,
      categoryId: addForm.categoryId!,
      price: addForm.price,
      image: addForm.image,
      description: addForm.description
    })

    console.log('新增商品结果:', result)
    
    if (result.code === 1) {
      ElMessage.success('新增商品成功')
      // 重置表单，继续添加
      addFormRef.value.resetFields()
      Object.assign(addForm, {
        name: '',
        categoryId: undefined,
        price: 0,
        image: '',
        description: ''
      })
      fetchGoodList()
    } else {
      ElMessage.error(result.msg || '新增商品失败')
    }
  } catch (error) {
    // 表单验证失败
    console.error('表单验证失败:', error)
    ElMessage.error('请完善表单信息')
  } finally {
    addLoading.value = false
  }
}

// 提交新增/编辑表单
const handleAddSubmit = async () => {
  if (!addFormRef.value) return

  try {
    await addFormRef.value.validate()
    addLoading.value = true

    if (isEditing.value && currentEditId.value) {
      // 编辑模式
      console.log('开始更新商品，ID:', currentEditId.value)
      
      const result = await $updateGood(currentEditId.value, {
        name: addForm.name,
        categoryId: addForm.categoryId!,
        price: addForm.price,
        image: addForm.image,
        description: addForm.description
      })

      console.log('更新商品结果:', result)
      
      if (result.code === 1) {
        ElMessage.success('更新商品成功')
        addDialogVisible.value = false
        fetchGoodList()
      } else {
        ElMessage.error(result.msg || '更新商品失败')
      }
    } else {
      // 新增模式
      console.log('开始新增商品')
      
      const result = await $addGood({
        name: addForm.name,
        categoryId: addForm.categoryId!,
        price: addForm.price,
        image: addForm.image,
        description: addForm.description
      })

      console.log('新增商品结果:', result)
      
      if (result.code === 1) {
        ElMessage.success('新增商品成功')
        addDialogVisible.value = false
        fetchGoodList()
      } else {
        ElMessage.error(result.msg || '新增商品失败')
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

const router = useRouter()

// 初始化
onMounted(() => {
  fetchCategoryList()
  fetchGoodList()
  window.addEventListener('scroll', handleWindowScroll) //监听滚动事件

  // 检查是否需要自动打开新增商品对话框
  if (router.currentRoute.value.query.openAddDialog === 'true') {
    nextTick(() => {
      handleAdd() // 自动打开新增商品对话框
    })
  }
})

// 在组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleWindowScroll)
})
</script>

<style scoped>
.good-container {
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

.good-name {
  font-weight: 500;
  color: #333;
}

.price {
  font-weight: 600;
  color: #e6a23c;
}

.image-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}

.good-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background: #f5f7fa;
  color: #909399;
  border-radius: 6px;
}

.no-image {
  color: #909399;
  font-size: 12px;
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

/* 分页和滚动加载样式 */
.data-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.demo-pagination-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.demonstration {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.scroll-loading,
.scroll-tip,
.no-more-data {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  color: #909399;
  font-size: 14px;
}

.scroll-loading {
  color: #409EFF;
}

.scroll-loading .el-icon {
  margin-right: 8px;
}

.scroll-tip {
  background-color: #f0f9ff;
  border-radius: 4px;
  border: 1px solid #e1f3ff;
}

.no-more-data {
  background-color: #f5f7fa;
  border-radius: 4px;
}

/* 上传组件样式 */
.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  :deep(.el-upload:hover) {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .good-container {
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