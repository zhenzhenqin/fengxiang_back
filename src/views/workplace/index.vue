<template>
  <div class="workplace-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">工作台</h2>
      <p class="page-desc">蜂享自然运营数据总览</p>
    </div>

    <!-- 今日数据概览 -->
    <div class="overview-section">
      <el-card class="overview-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">今日数据</span>
            <span class="card-date">{{ currentDate[1] }}</span>
            <router-link to="/layout/report" class="card-link">详细数据</router-link>
          </div>
        </template>
        <div class="overview-content">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="overview-item">
                <div class="item-icon turnover">
                  <el-icon>
                    <Money />
                  </el-icon>
                </div>
                <div class="item-info">
                  <div class="item-label">营业额</div>
                  <div class="item-value">¥ {{ businessData.turnover?.toFixed(2) || '0.00' }}</div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="overview-item">
                <div class="item-icon orders">
                  <el-icon>
                    <Document />
                  </el-icon>
                </div>
                <div class="item-info">
                  <div class="item-label">有效订单</div>
                  <div class="item-value">{{ businessData.validOrderCount || 0 }}</div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="overview-item">
                <div class="item-icon rate">
                  <el-icon>
                    <TrendCharts />
                  </el-icon>
                </div>
                <div class="item-info">
                  <div class="item-label">订单完成率</div>
                  <div class="item-value">
                    {{ ((businessData.orderCompletionRate || 0) * 100).toFixed(1) }}%
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="overview-item">
                <div class="item-icon price">
                  <el-icon>
                    <PriceTag />
                  </el-icon>
                </div>
                <div class="item-info">
                  <div class="item-label">平均客单价</div>
                  <div class="item-value">¥ {{ businessData.unitPrice?.toFixed(2) || '0.00' }}</div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="overview-item">
                <div class="item-icon users">
                  <el-icon>
                    <User />
                  </el-icon>
                </div>
                <div class="item-info">
                  <div class="item-label">新增用户</div>
                  <div class="item-value">{{ businessData.newUsers || 0 }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <!-- 订单管理和菜品总览 -->
    <div class="management-section">
      <el-row :gutter="20">
        <!-- 订单管理 -->
        <el-col :span="12">
          <el-card class="management-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span class="card-title">订单管理</span>
                <router-link to="/layout/order" class="card-link">订单明细</router-link>
              </div>
            </template>
            <div class="order-content">
              <el-row :gutter="16">
                <el-col :span="8">
                  <div class="order-item">
                    <div class="order-icon waiting">
                      <el-icon>
                        <Clock />
                      </el-icon>
                    </div>
                    <div class="order-info">
                      <div class="order-label">待发货</div>
                      <div class="order-value">
                        <router-link to="/order?status=2" class="order-link">
                          {{ orderData.toBeShippedOrders || 0 }}
                        </router-link>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="order-item">
                    <div class="order-icon shipped">
                      <el-icon>
                        <Van />
                      </el-icon>
                    </div>
                    <div class="order-info">
                      <div class="order-label">已发货</div>
                      <div class="order-value">
                        <router-link to="/order?status=3" class="order-link">
                          {{ orderData.shippedOrders || 0 }}
                        </router-link>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="order-item">
                    <div class="order-icon completed">
                      <el-icon>
                        <CircleCheck />
                      </el-icon>
                    </div>
                    <div class="order-info">
                      <div class="order-label">已完成</div>
                      <div class="order-value">
                        <router-link to="/order?status=4" class="order-link">
                          {{ orderData.completedOrders || 0 }}
                        </router-link>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="order-item">
                    <div class="order-icon cancelled">
                      <el-icon>
                        <CloseBold />
                      </el-icon>
                    </div>
                    <div class="order-info">
                      <div class="order-label">已取消</div>
                      <div class="order-value">
                        <router-link to="/order?status=5" class="order-link">
                          {{ orderData.cancelledOrders || 0 }}
                        </router-link>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="order-item">
                    <div class="order-icon all">
                      <el-icon>
                        <List />
                      </el-icon>
                    </div>
                    <div class="order-info">
                      <div class="order-label">全部订单</div>
                      <div class="order-value">
                        <router-link to="/order" class="order-link">
                          {{ orderData.allOrders || 0 }}
                        </router-link>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>

        <!-- 菜品总览 -->
        <el-col :span="12">
          <el-card class="management-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span class="card-title">商品总览</span>
                <router-link to="/layout/good" class="card-link">商品管理</router-link>
              </div>
            </template>
            <div class="dish-content">
              <el-row :gutter="16">
                <el-col :span="12">
                  <div class="dish-item">
                    <div class="dish-icon sold">
                      <el-icon>
                        <Goods />
                      </el-icon>
                    </div>
                    <div class="dish-info">
                      <div class="dish-label">已启售</div>
                      <div class="dish-value">{{ dishData.sold || 0 }}</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="dish-item">
                    <div class="dish-icon discontinued">
                      <el-icon>
                        <Box />
                      </el-icon>
                    </div>
                    <div class="dish-info">
                      <div class="dish-label">已停售</div>
                      <div class="dish-value">{{ dishData.discontinued || 0 }}</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="dish-action">
                    <el-button type="primary" :icon="Plus" @click="handleAddGood" class="add-button">
                      新增商品
                    </el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Money,
  Document,
  TrendCharts,
  PriceTag,
  User,
  Clock,
  Van,
  CircleCheck,
  CloseBold,
  List,
  Goods,
  Box,
  Plus,
  ShoppingCart,
  Setting,
  DataBoard,
  Histogram,
  Promotion
} from '@element-plus/icons-vue'

import {
  $getBusinessData,
  $getOrderOverView,
  $getDishOverView
} from '../../api/workspace'
import { getday } from '../../utils/formValidate'

const router = useRouter()

// 当前日期
const currentDate = ref(getday())

// 业务数据
const businessData = reactive({
  turnover: 0,
  validOrderCount: 0,
  orderCompletionRate: 0,
  unitPrice: 0,
  newUsers: 0
})

// 订单数据
const orderData = reactive({
  toBeShippedOrders: 0,
  shippedOrders: 0,
  completedOrders: 0,
  cancelledOrders: 0,
  allOrders: 0
})

// 菜品数据
const dishData = reactive({
  sold: 0,
  discontinued: 0
})


// 加载数据
const loadData = async () => {
  try {
    const [businessRes, orderRes, dishRes] = await Promise.all([
      $getBusinessData(),
      $getOrderOverView(),
      $getDishOverView()
    ])

    if (businessRes.code === 1) {
      Object.assign(businessData, businessRes.data)
    } else {
      ElMessage.error(businessRes.msg || '获取营业数据失败')
    }

    if (orderRes.code === 1) {
      Object.assign(orderData, orderRes.data)
    } else {
      ElMessage.error(orderRes.msg || '获取订单数据失败')
    }

    if (dishRes.code === 1) {
      Object.assign(dishData, dishRes.data)
    } else {
      ElMessage.error(dishRes.msg || '获取商品数据失败')
    }
  } catch (error) {
    console.error('加载工作台数据失败:', error)
    ElMessage.error('加载工作台数据失败')
  }
}

// 新增商品
const handleAddGood = () => {
  router.push({
    path: '/layout/good',
    query: { openAddDialog: 'true' }
  })
}


onMounted(() => {
  loadData()
})
</script>

<style scoped>
.workplace-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);
}

.page-header {
  margin-bottom: 24px;
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

/* 概览卡片样式 */
.overview-section {
  margin-bottom: 24px;
}

.overview-card {
  border-radius: 12px;
  border: 1px solid #e8e8e8;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.card-date {
  font-size: 14px;
  color: #666;
  flex: 1;
  margin-left: 16px;
}

.card-link {
  font-size: 14px;
  color: #409EFF;
  text-decoration: none;
}

.card-link:hover {
  color: #67a8ff;
}

.overview-content {
  padding: 8px 0;
}

.overview-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.overview-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.item-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 20px;
}

.item-icon.turnover {
  background: linear-gradient(135deg, #ffd666, #faad14);
  color: #fff;
}

.item-icon.orders {
  background: linear-gradient(135deg, #91d5ff, #409eff);
  color: #fff;
}

.item-icon.rate {
  background: linear-gradient(135deg, #b7eb8f, #52c41a);
  color: #fff;
}

.item-icon.price {
  background: linear-gradient(135deg, #ffccc7, #ff4d4f);
  color: #fff;
}

.item-icon.users {
  background: linear-gradient(135deg, #d3adf7, #722ed1);
  color: #fff;
}

.item-info {
  flex: 1;
}

.item-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.item-value {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

/* 管理卡片样式 */
.management-section {
  margin-bottom: 24px;
}

.management-card {
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  height: 100%;
}

.order-content,
.dish-content {
  padding: 8px 0;
}

.order-item,
.dish-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.order-item:hover,
.dish-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-icon,
.dish-icon {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 18px;
}

.order-icon.waiting {
  background: #fff7e6;
  color: #fa8c16;
}

.order-icon.shipped {
  background: #e6f7ff;
  color: #1890ff;
}

.order-icon.completed {
  background: #f6ffed;
  color: #52c41a;
}

.order-icon.cancelled {
  background: #fff2f0;
  color: #ff4d4f;
}

.order-icon.all {
  background: #f9f0ff;
  color: #722ed1;
}

.dish-icon.sold {
  background: #f6ffed;
  color: #52c41a;
}

.dish-icon.discontinued {
  background: #fff2f0;
  color: #ff4d4f;
}

.order-info,
.dish-info {
  flex: 1;
}

.order-label,
.dish-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.order-value,
.dish-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.order-link {
  color: inherit;
  text-decoration: none;
}

.order-link:hover {
  color: #409EFF;
}

.dish-action {
  padding: 16px;
  text-align: center;
}

.add-button {
  width: 100%;
  height: 44px;
  font-size: 14px;
}


.quick-actions-card {
  border-radius: 12px;
  border: 1px solid #e8e8e8;
}

.quick-actions-content {
  padding: 8px 0;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  font-size: 20px;
  color: #fff;
}

.action-icon.good {
  background: linear-gradient(135deg, #b37feb, #722ed1);
}

.action-icon.order {
  background: linear-gradient(135deg, #ff9c6e, #fa541c);
}

.action-icon.report {
  background: linear-gradient(135deg, #69c0ff, #096dd9);
}

.action-icon.category {
  background: linear-gradient(135deg, #95de64, #389e0d);
}

.action-icon.user {
  background: linear-gradient(135deg, #ffc069, #d46b08);
}

.action-icon.setting {
  background: linear-gradient(135deg, #ff85c0, #c41d7f);
}

.action-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {

  .overview-item,
  .order-item,
  .dish-item {
    padding: 12px;
  }

  .item-value,
  .order-value,
  .dish-value {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .workplace-container {
    padding: 16px;
  }

  .management-section .el-col {
    margin-bottom: 16px;
  }

  .quick-actions-section .el-col {
    margin-bottom: 12px;
  }

  .overview-item {
    flex-direction: column;
    text-align: center;
  }

  .item-icon {
    margin-right: 0;
    margin-bottom: 8px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .card-date {
    margin-left: 0;
  }
}
</style>