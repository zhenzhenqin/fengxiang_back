<template>
  <div class="order-detail">
    <div v-loading="loading">
      <el-descriptions v-if="orderDetail" :column="2" border>
        <el-descriptions-item label="订单号">{{ orderDetail.number }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusTagType(orderDetail.status)">
            {{ getStatusText(orderDetail.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="用户名">{{ orderDetail.consignee }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ orderDetail.phone }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ orderDetail.address }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ formatDate(orderDetail.orderTime) }}</el-descriptions-item>
        <el-descriptions-item label="实收金额">¥{{ formatAmount(orderDetail.amount) }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ orderDetail.remark || '无' }}</el-descriptions-item>
        
        <!-- 商品信息 -->
        <el-descriptions-item label="商品信息" :span="2">
          <el-table :data="processedOrderDetails" size="small" style="width: 100%">
            <el-table-column prop="name" label="商品名称" min-width="150" />
            <el-table-column prop="quantity" label="数量" width="80" align="center" />
            <!-- <el-table-column prop="unitPrice" label="单价" width="120" align="right">
              <template #default="{ row }">
                ¥{{ formatAmount(row.unitPrice) }}
              </template>
            </el-table-column> -->
            <!-- <el-table-column prop="subtotal" label="小计" width="120" align="right">
              <template #default="{ row }">
                ¥{{ formatAmount(row.subtotal) }}
              </template>
            </el-table-column> -->
          </el-table>
          
          <!-- 总计行 -->
          <div class="total-amount" style="text-align: right; margin-top: 16px; font-weight: bold;">
            订单总额: ¥{{ formatAmount(orderDetail.amount) }}
          </div>
        </el-descriptions-item>
        
        <!-- 支付信息 -->
        <el-descriptions-item label="支付方式" :span="2">
          {{ getPayMethodText(orderDetail.payMethod) }}
        </el-descriptions-item>
        <el-descriptions-item label="支付状态">
          {{ getPayStatusText(orderDetail.payStatus) }}
        </el-descriptions-item>
        <el-descriptions-item label="支付时间">
          {{ formatDate(orderDetail.checkoutTime) }}
        </el-descriptions-item>
        
        <!-- 取消信息 -->
        <el-descriptions-item v-if="orderDetail.cancelReason" label="取消原因" :span="2">
          {{ orderDetail.cancelReason }}
        </el-descriptions-item>
        <el-descriptions-item v-if="orderDetail.cancelTime" label="取消时间" :span="2">
          {{ formatDate(orderDetail.cancelTime) }}
        </el-descriptions-item>
        
        <!-- 发货信息 -->
        <el-descriptions-item v-if="orderDetail.deliveryTime" label="发货时间" :span="2">
          {{ formatDate(orderDetail.deliveryTime) }}
        </el-descriptions-item>
      </el-descriptions>
      
      <el-empty v-else description="订单详情加载失败" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { $getOrderDetail } from '../../../api/order'

const props = defineProps<{
  orderId: number | null
}>()

const loading = ref(false)
const orderDetail = ref<any>(null)

// 计算属性：处理商品明细
const processedOrderDetails = computed(() => {
  if (!orderDetail.value) return []
  
  // 如果有完整的订单明细列表，直接使用
  if (orderDetail.value.orderDetailList && orderDetail.value.orderDetailList.length > 0) {
    return orderDetail.value.orderDetailList.map((item: any) => ({
      name: item.name,
      quantity: item.number,
      unitPrice: item.price,
      subtotal: (item.price || 0) * (item.number || 0)
    }))
  }
  
  // 如果只有 orderGoods 字符串，解析它
  if (orderDetail.value.orderGoods) {
    const goods = orderDetail.value.orderGoods.split(';').filter(Boolean)
    const details = []
    
    for (const good of goods) {
      const [name, quantityStr] = good.split('*')
      const quantity = parseInt(quantityStr) || 0
      
      // 由于 orderGoods 中没有单价信息，我们假设平均分配总金额
      // 在实际项目中，应该从后端获取完整的商品信息
      const unitPrice = orderDetail.value.amount / getTotalQuantity(goods)
      
      details.push({
        name: name || '未知商品',
        quantity: quantity,
        unitPrice: unitPrice,
        subtotal: unitPrice * quantity
      })
    }
    
    return details
  }
  
  return []
})

// 辅助函数：计算总数量
const getTotalQuantity = (goods: string[]) => {
  let total = 0
  for (const good of goods) {
    const [, quantityStr] = good.split('*')
    total += parseInt(quantityStr) || 0
  }
  return total
}

// 金额格式化（后端返回的是元）
const formatAmount = (amount: number) => {
  if (!amount && amount !== 0) return '0.00'
  return parseFloat(amount.toString()).toFixed(2)
}

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
    1: 'warning',
    2: 'danger',
    3: 'primary',
    4: 'success',
    5: 'info',
    6: 'info'
  }
  return map[status] || 'info'
}

// 获取支付方式文本
const getPayMethodText = (payMethod: number) => {
  const map: { [key: number]: string } = {
    1: '微信支付',
    2: '支付宝',
    3: '银行卡'
  }
  return map[payMethod] || '未知支付方式'
}

// 获取支付状态文本
const getPayStatusText = (payStatus: number) => {
  const map: { [key: number]: string } = {
    0: '未支付',
    1: '已支付',
    2: '已退款'
  }
  return map[payStatus] || '未知状态'
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 获取订单详情
const getOrderDetail = async () => {
  if (!props.orderId) return
  
  loading.value = true
  try {
    const result = await $getOrderDetail(props.orderId)
    if (result.code === 1) {
      orderDetail.value = result.data
    } else {
      ElMessage.error(result.msg)
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  } finally {
    loading.value = false
  }
}

// 监听订单ID变化
watch(() => props.orderId, getOrderDetail)

onMounted(() => {
  if (props.orderId) {
    getOrderDetail()
  }
})
</script>

<style scoped>
.order-detail {
  padding: 0;
}

.total-amount {
  font-size: 16px;
  color: #f56c6c;
  padding: 8px 0;
}
</style>