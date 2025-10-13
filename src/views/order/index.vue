<template>
  <div class="order-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">订单管理</h2>
      <p class="page-desc">蜂享自然订单管理系统</p>
    </div>

    <!-- 订单状态选项卡 -->
    <div class="order-tabs-card">
      <el-card shadow="never">
        <el-tabs v-model="activeStatus" @tab-change="handleTabChange">
          <el-tab-pane label="全部订单" name=""></el-tab-pane>
          <el-tab-pane :name="statusMap.TO_BE_SHIPPED.toString()">
            <template #label>
              <span class="tab-label">
                待发货
                <el-badge v-if="statistics.toBeConfirmed > 0" :value="statistics.toBeConfirmed" 
                         class="badge-item" type="danger" />
              </span>
            </template>
          </el-tab-pane>
          <el-tab-pane :name="statusMap.SHIPPED.toString()">
            <template #label>
              <span class="tab-label">
                运输中
                <el-badge v-if="statistics.confirmed > 0" :value="statistics.confirmed" 
                         class="badge-item" type="danger" />
              </span>
            </template>
          </el-tab-pane>
          <el-tab-pane label="已完成" :name="statusMap.COMPLETED.toString()"></el-tab-pane>
          <el-tab-pane label="已取消" :name="statusMap.CANCELLED.toString()"></el-tab-pane>
          <el-tab-pane label="已退款" :name="statusMap.REFUND.toString()"></el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 搜索区域 -->
    <div class="search-card">
      <el-card shadow="never">
        <el-form :model="searchForm" :inline="true">
          <el-form-item label="订单号">
            <el-input
              v-model="searchForm.number"
              placeholder="请输入订单号"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input
              v-model="searchForm.phone"
              placeholder="请输入手机号"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="下单时间">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
            <el-button @click="handleReset" :icon="Refresh">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 订单列表 -->
    <div class="order-list-card">
      <el-card shadow="never">
        <el-table
          :data="orderList"
          v-loading="loading"
          :default-sort="{ prop: 'orderTime', order: 'descending' }"
        >
          <!-- 全部订单列 -->
          <template v-if="activeStatus === ''">
            <el-table-column prop="number" label="订单号" width="200" />
            <el-table-column prop="status" label="订单状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.status)">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="consignee" label="用户名" width="120" />
            <el-table-column prop="phone" label="手机号" width="130" />
            <el-table-column prop="address" label="地址" show-overflow-tooltip />
            <el-table-column prop="orderTime" label="下单时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.orderTime) }}
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="实收金额" width="120" align="right">
              <template #default="{ row }">
                ¥{{ formatAmount(row.amount) }}
              </template>
            </el-table-column>
          </template>

          <!-- 待发货列 -->
          <template v-else-if="activeStatus === statusMap.TO_BE_SHIPPED.toString()">
            <el-table-column prop="number" label="订单号" width="200" />
            <el-table-column label="商品信息" show-overflow-tooltip>
              <template #default="{ row }">
                <div v-if="row.orderGoods">{{ formatOrderGoods(row.orderGoods) }}</div>
                <div v-else-if="row.orderDetailList && row.orderDetailList.length > 0">
                  {{ formatOrderDetails(row.orderDetailList) }}
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="地址" show-overflow-tooltip />
            <el-table-column prop="amount" label="实收金额" width="120" align="right">
              <template #default="{ row }">
                ¥{{ formatAmount(row.amount) }}
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip>
              <template #default="{ row }">
                {{ row.remark || '-' }}
              </template>
            </el-table-column>
          </template>

          <!-- 运输中列 -->
          <template v-else-if="activeStatus === statusMap.SHIPPED.toString()">
            <el-table-column prop="number" label="订单号" width="200" />
            <el-table-column label="详细商品" show-overflow-tooltip>
              <template #default="{ row }">
                <div v-if="row.orderGoods">{{ formatOrderGoods(row.orderGoods) }}</div>
                <div v-else-if="row.orderDetailList && row.orderDetailList.length > 0">
                  {{ formatOrderDetails(row.orderDetailList) }}
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="地址" show-overflow-tooltip />
            <el-table-column prop="remark" label="备注" show-overflow-tooltip>
              <template #default="{ row }">
                {{ row.remark || '-' }}
              </template>
            </el-table-column>
          </template>

          <!-- 已完成列 -->
          <template v-else-if="activeStatus === statusMap.COMPLETED.toString()">
            <el-table-column prop="number" label="订单号" width="200" />
            <el-table-column prop="consignee" label="用户名" width="120" />
            <el-table-column prop="phone" label="手机号" width="130" />
            <el-table-column label="商品信息" show-overflow-tooltip>
              <template #default="{ row }">
                <div v-if="row.orderGoods">{{ formatOrderGoods(row.orderGoods) }}</div>
                <div v-else-if="row.orderDetailList && row.orderDetailList.length > 0">
                  {{ formatOrderDetails(row.orderDetailList) }}
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="实收金额" width="120" align="right">
              <template #default="{ row }">
                ¥{{ formatAmount(row.amount) }}
              </template>
            </el-table-column>
            <el-table-column prop="deliveryTime" label="完成时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.deliveryTime) }}
              </template>
            </el-table-column>
          </template>

          <!-- 已取消列 -->
          <template v-else-if="activeStatus === statusMap.CANCELLED.toString()">
            <el-table-column prop="number" label="订单号" width="200" />
            <el-table-column prop="consignee" label="用户名" width="120" />
            <el-table-column prop="cancelReason" label="取消原因" show-overflow-tooltip />
            <el-table-column prop="amount" label="订单金额" width="120" align="right">
              <template #default="{ row }">
                ¥{{ formatAmount(row.amount) }}
              </template>
            </el-table-column>
            <el-table-column prop="cancelTime" label="取消时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.cancelTime) }}
              </template>
            </el-table-column>
          </template>

          <!-- 已退款列 -->
          <template v-else-if="activeStatus === statusMap.REFUND.toString()">
            <el-table-column prop="number" label="订单号" width="200" />
            <el-table-column prop="consignee" label="用户名" width="120" />
            <el-table-column prop="phone" label="手机号" width="130" />
            <el-table-column prop="amount" label="退款金额" width="120" align="right">
              <template #default="{ row }">
                ¥{{ formatAmount(row.amount) }}
              </template>
            </el-table-column>
            <el-table-column prop="cancelReason" label="退款原因" show-overflow-tooltip />
            <el-table-column prop="cancelTime" label="退款时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.cancelTime) }}
              </template>
            </el-table-column>
          </template>

          <!-- 操作列 -->
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="canCancel(row.status)"
                type="danger"
                link
                size="small"
                @click="handleCancel(row)"
              >
                取消
              </el-button>
              <el-button
                v-if="canRefund(row.status)"
                type="warning"
                link
                size="small"
                @click="handleRefund(row)"
              >
                退款
              </el-button>
              <el-button
                type="primary"
                link
                size="small"
                @click="handleView(row)"
              >
                查看
              </el-button>
              <el-button
                v-if="canDelivery(row.status)"
                type="success"
                link
                size="small"
                @click="handleDelivery(row)"
              >
                发货
              </el-button>
              <el-button
                v-if="canComplete(row.status)"
                type="success"
                link
                size="small"
                @click="handleComplete(row)"
              >
                完成
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>

    <!-- 取消订单对话框 -->
    <el-dialog
      v-model="cancelDialogVisible"
      title="取消订单"
      width="500px"
    >
      <el-form :model="cancelForm" label-width="80px">
        <el-form-item label="取消原因">
          <el-input
            v-model="cancelForm.cancelReason"
            type="textarea"
            :rows="4"
            placeholder="请输入取消原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCancel" :loading="cancelLoading">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="订单详情"
      width="800px"
    >
      <OrderDetail :order-id="currentOrderId" v-if="detailDialogVisible" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import OrderDetail from './components/OrderDetail.vue'
import {
  $searchOrders,
  $getOrderStatistics,
  $cancelOrder,
  $deliveryOrder,
  $completeOrder,
  $refundOrder
} from '../../api/order'

// 状态映射
const statusMap = {
  PENDING_PAYMENT: 1, // 待付款
  TO_BE_SHIPPED: 2,   // 待发货
  SHIPPED: 3,         // 运输中
  COMPLETED: 4,       // 已完成
  CANCELLED: 5,       // 已取消
  REFUND: 6           // 已退款
}

// 响应式数据
const activeStatus = ref('')
const loading = ref(false)
const cancelDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const cancelLoading = ref(false)
const currentOrderId = ref<number | null>(null)

// 订单列表数据
const orderList = ref<any[]>([])

// 统计信息
const statistics = reactive({
  toBeConfirmed: 0,
  confirmed: 0,
  deliveryInProgress: 0
})

// 搜索表单
const searchForm = reactive({
  number: '',
  phone: '',
  dateRange: [] as string[]
})

// 取消表单
const cancelForm = reactive({
  id: 0,
  cancelReason: ''
})

// 分页信息
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 获取状态文本
const getStatusText = (status: number) => {
  const map: { [key: number]: string } = {
    1: '待付款',
    2: '待发货',
    3: '运输中',
    4: '已完成',
    5: '已取消',
    6: '已退款'
  }
  return map[status] || '未知状态'
}

// 获取状态标签类型
const getStatusTagType = (status: number) => {
  const map: { [key: number]: string } = {
    1: 'info',
    2: 'danger',
    3: 'primary',
    4: 'success',
    5: 'info',
    6: 'warning'
  }
  return map[status] || 'info'
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 格式化金额（后端返回的是元）
const formatAmount = (amount: number) => {
  if (!amount && amount !== 0) return '0.00'
  return parseFloat(amount.toString()).toFixed(2)
}

// 格式化商品信息（字符串格式）
const formatOrderGoods = (orderGoods: string) => {
  if (!orderGoods) return '-'
  return orderGoods.split(';').filter(Boolean).map(item => {
    const [name, number] = item.split('*')
    return `${name} × ${number}`
  }).join('<br/>')
}

// 格式化商品信息（对象数组格式）
const formatOrderDetails = (orderDetails: any[]) => {
  if (!orderDetails || orderDetails.length === 0) return '-'
  return orderDetails.map(item => {
    return `${item.name} × ${item.number}`
  }).join('<br/>')
}

// 操作权限判断
const canCancel = (status: number) => {
  return [statusMap.TO_BE_SHIPPED, statusMap.SHIPPED].includes(status)
}

const canRefund = (status: number) => {
  return [statusMap.TO_BE_SHIPPED, statusMap.SHIPPED].includes(status)
}

const canDelivery = (status: number) => {
  return status === statusMap.TO_BE_SHIPPED
}

const canComplete = (status: number) => {
  return status === statusMap.SHIPPED
}

// 搜索订单
const searchOrders = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      number: searchForm.number || undefined,
      phone: searchForm.phone || undefined,
      beginTime: searchForm.dateRange?.[0] || undefined,
      endTime: searchForm.dateRange?.[1] || undefined,
      status: activeStatus.value ? parseInt(activeStatus.value) : undefined
    }

    const result = await $searchOrders(params)
    if (result.code === 1) {
      orderList.value = result.data.records || []
      pagination.total = result.data.total || 0
    } else {
      ElMessage.error(result.msg)
    }
  } catch (error) {
    console.error('搜索订单失败:', error)
    ElMessage.error('搜索订单失败')
  } finally {
    loading.value = false
  }
}

// 获取订单统计
const getOrderStatistics = async () => {
  try {
    const result = await $getOrderStatistics()
    if (result.code === 1) {
      Object.assign(statistics, result.data)
    }
  } catch (error) {
    console.error('获取订单统计失败:', error)
  }
}

// 事件处理
const handleTabChange = (tabName: string) => {
  activeStatus.value = tabName
  pagination.currentPage = 1
  searchOrders()
}

const handleSearch = () => {
  pagination.currentPage = 1
  searchOrders()
}

const handleReset = () => {
  Object.assign(searchForm, {
    number: '',
    phone: '',
    dateRange: []
  })
  pagination.currentPage = 1
  searchOrders()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  searchOrders()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  searchOrders()
}

const handleCancel = (row: any) => {
  currentOrderId.value = row.id
  cancelForm.id = row.id
  cancelForm.cancelReason = ''
  cancelDialogVisible.value = true
}

const handleRefund = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要退款吗？此操作将把订单状态改为已退款。', '确认退款', {
      confirmButtonText: '确定退款',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    })

    const result = await $refundOrder(row.id)
    
    if (result.code === 1) {
      ElMessage.success('退款操作提交成功')
      
      // 等待后端处理
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 强制刷新数据
      await searchOrders()
      await getOrderStatistics()
      
      // 检查退款是否真正生效
      const currentOrders = orderList.value
      const refundedOrder = currentOrders.find(order => order.id === row.id)
      
      if (refundedOrder) {
        if (refundedOrder.status === 6) {
          ElMessage.success(`订单 ${row.number} 已成功退款`)
          // 自动切换到已退款选项卡
          activeStatus.value = '6'
          await searchOrders()
        } else {
          ElMessage.warning(`订单状态未正确更新，当前状态: ${getStatusText(refundedOrder.status)}`)
        }
      } else {
        // 订单可能不在当前页面，切换到已退款选项卡查看
        activeStatus.value = '6'
        pagination.currentPage = 1
        await searchOrders()
        ElMessage.success('退款成功，请查看已退款列表')
      }
    } else {
      ElMessage.error(`退款失败: ${result.msg}`)
    }
  } catch (error: any) {
    if (error === 'cancel' || error?.action === 'cancel') {
      return // 用户取消
    }
    console.error('退款异常:', error)
    ElMessage.error('退款操作异常，请稍后重试')
  }
}

const handleView = (row: any) => {
  currentOrderId.value = row.id
  detailDialogVisible.value = true
}

const handleDelivery = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要发货吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const result = await $deliveryOrder(row.id)
    if (result.code === 1) {
      ElMessage.success('发货成功')
      searchOrders()
      getOrderStatistics()
    } else {
      ElMessage.error(result.msg)
    }
  } catch (error) {
    // 用户取消
  }
}

const handleComplete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要完成订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const result = await $completeOrder(row.id)
    if (result.code === 1) {
      ElMessage.success('订单完成')
      searchOrders()
      getOrderStatistics()
    } else {
      ElMessage.error(result.msg)
    }
  } catch (error) {
    // 用户取消
  }
}

const confirmCancel = async () => {
  if (!cancelForm.cancelReason.trim()) {
    ElMessage.warning('请输入取消原因')
    return
  }

  cancelLoading.value = true
  try {
    const result = await $cancelOrder(cancelForm)
    if (result.code === 1) {
      ElMessage.success('取消订单成功')
      cancelDialogVisible.value = false
      searchOrders()
      getOrderStatistics()
    } else {
      ElMessage.error(result.msg)
    }
  } catch (error) {
    console.error('取消订单失败:', error)
    ElMessage.error('取消订单失败')
  } finally {
    cancelLoading.value = false
  }
}

// 生命周期
onMounted(() => {
  searchOrders()
  getOrderStatistics()
})
</script>

<style scoped>
.order-container {
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

.order-tabs-card,
.search-card,
.order-list-card {
  margin-bottom: 20px;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-item {
  margin-left: 4px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .order-container {
    padding: 16px;
  }
  
  .search-card .el-form-item {
    margin-bottom: 12px;
  }
}
</style>