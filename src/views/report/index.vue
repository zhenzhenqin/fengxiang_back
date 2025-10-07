<template>
  <div class="report-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">数据报表</h2>
      <p class="page-desc">蜂享自然运营数据统计分析</p>
    </div>

    <!-- 时间选择区域 -->
    <div class="time-select-card">
      <el-card shadow="never">
        <div class="time-select-content">
          <div class="quick-time-buttons">
            <el-button
              :type="activeTimeRange === 'yesterday' ? 'primary' : ''"
              @click="handleTimeRangeChange('yesterday')"
            >
              昨日
            </el-button>
            <el-button
              :type="activeTimeRange === 'last7Days' ? 'primary' : ''"
              @click="handleTimeRangeChange('last7Days')"
            >
              近7日
            </el-button>
            <el-button
              :type="activeTimeRange === 'last30Days' ? 'primary' : ''"
              @click="handleTimeRangeChange('last30Days')"
            >
              近30日
            </el-button>
            <el-button
              :type="activeTimeRange === 'thisWeek' ? 'primary' : ''"
              @click="handleTimeRangeChange('thisWeek')"
            >
              本周
            </el-button>
            <el-button
              :type="activeTimeRange === 'thisMonth' ? 'primary' : ''"
              @click="handleTimeRangeChange('thisMonth')"
            >
              本月
            </el-button>
          </div>
          
          <div class="custom-time-range">
            <el-date-picker
              v-model="customDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              @change="handleCustomDateChange"
            />
          </div>

          <!-- 导出按钮 -->
          <div class="export-button">
            <el-button
              type="success"
              :icon="Download"
              @click="handleExport"
              :loading="exportLoading"
            >
              导出数据
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 数据概览 -->
    <div class="overview-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="overview-card" shadow="hover">
            <div class="card-content">
              <div class="card-icon turnover">
                <el-icon><Money /></el-icon>
              </div>
              <div class="card-info">
                <div class="card-title">总营业额</div>
                <div class="card-value">¥{{ overviewData.turnover || '0.00' }}</div>
                <div class="card-desc">你个cxs怎么就赚了这么点</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="overview-card" shadow="hover">
            <div class="card-content">
              <div class="card-icon users">
                <el-icon><User /></el-icon>
              </div>
              <div class="card-info">
                <div class="card-title">新增用户</div>
                <div class="card-value">{{ overviewData.newUsers || 0 }}</div>
                <div class="card-desc">较上一周期</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="overview-card" shadow="hover">
            <div class="card-content">
              <div class="card-icon orders">
                <el-icon><Document /></el-icon>
              </div>
              <div class="card-info">
                <div class="card-title">有效订单</div>
                <div class="card-value">{{ overviewData.validOrderCount || 0 }}</div>
                <div class="card-desc">订单完成率 {{ (overviewData.orderCompletionRate * 100 || 0).toFixed(1) }}%</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="overview-card" shadow="hover">
            <div class="card-content">
              <div class="card-icon price">
                <el-icon><PriceTag /></el-icon>
              </div>
              <div class="card-info">
                <div class="card-title">客单价</div>
                <div class="card-value">¥{{ overviewData.unitPrice || '0.00' }}</div>
                <div class="card-desc">平均每单金额</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 图表区域 -->
    <div class="charts-container">
      <el-row :gutter="20">
        <!-- 营业额趋势图 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <span>营业额趋势</span>
              </div>
            </template>
            <div id="turnoverChart" style="height: 300px;"></div>
          </el-card>
        </el-col>

        <!-- 用户统计图 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <span>用户统计</span>
              </div>
            </template>
            <div id="userChart" style="height: 300px;"></div>
          </el-card>
        </el-col>

        <!-- 订单统计图 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <span>订单统计</span>
              </div>
            </template>
            <div id="orderChart" style="height: 300px;"></div>
          </el-card>
        </el-col>

        <!-- 销量排名Top10 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <span>热销商品TOP10</span>
              </div>
            </template>
            <div id="salesChart" style="height: 300px;"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessageBox } from 'element-plus'
import { $download } from '../../utils/request'
import { ElMessage } from 'element-plus'
import {
  Download,
  Money,
  User,
  Document,
  PriceTag
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import {
  $getTurnoverStatistics,
  $getUserStatistics,
  $getOrdersStatistics,
  $getSalesTop10,
  $exportBusinessData
} from '../../api/report'

// 时间范围选择
const activeTimeRange = ref('last7Days')
const customDateRange = ref([])

// 加载状态
const exportLoading = ref(false)

// 概览数据
const overviewData = reactive({
  turnover: 0,
  newUsers: 0,
  validOrderCount: 0,
  orderCompletionRate: 0,
  unitPrice: 0
})

// 图表实例
let turnoverChart: echarts.ECharts | null = null
let userChart: echarts.ECharts | null = null
let orderChart: echarts.ECharts | null = null
let salesChart: echarts.ECharts | null = null

// 获取时间范围
const getDateRange = (range: string) => {
  const now = new Date()
  let begin, end

  switch (range) {
    case 'yesterday':
      const yesterday = new Date(now)
      yesterday.setDate(now.getDate() - 1)
      begin = yesterday.toISOString().split('T')[0]
      end = begin
      break
    case 'last7Days':
      const last7Days = new Date(now)
      last7Days.setDate(now.getDate() - 6)
      begin = last7Days.toISOString().split('T')[0]
      end = now.toISOString().split('T')[0]
      break
    case 'last30Days':
      const last30Days = new Date(now)
      last30Days.setDate(now.getDate() - 29)
      begin = last30Days.toISOString().split('T')[0]
      end = now.toISOString().split('T')[0]
      break
    case 'thisWeek':
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))
      begin = weekStart.toISOString().split('T')[0]
      end = now.toISOString().split('T')[0]
      break
    case 'thisMonth':
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      begin = monthStart.toISOString().split('T')[0]
      end = now.toISOString().split('T')[0]
      break
    default:
      begin = now.toISOString().split('T')[0]
      end = begin
  }

  return { begin, end }
}

// 时间范围改变
const handleTimeRangeChange = (range: string) => {
  activeTimeRange.value = range
  customDateRange.value = []
  loadReportData()
}

// 自定义日期改变
const handleCustomDateChange = (dates: string[]) => {
  if (dates && dates.length === 2) {
    activeTimeRange.value = 'custom'
    loadReportData()
  }
}

// 获取当前时间范围
const getCurrentDateRange = () => {
  if (activeTimeRange.value === 'custom' && customDateRange.value.length === 2) {
    return {
      begin: customDateRange.value[0],
      end: customDateRange.value[1]
    }
  }
  return getDateRange(activeTimeRange.value)
}

// 加载报表数据
const loadReportData = async () => {
  const { begin, end } = getCurrentDateRange()
  
  try {
    // 并行请求所有数据
    const [turnoverRes, userRes, ordersRes, salesRes] = await Promise.all([
      $getTurnoverStatistics({ begin, end }),
      $getUserStatistics({ begin, end }),
      $getOrdersStatistics({ begin, end }),
      $getSalesTop10({ begin, end })
    ])

    if (turnoverRes.code === 1) {
      initTurnoverChart(turnoverRes.data)
      // 计算概览数据
      const turnoverList = turnoverRes.data.turnoverList.split(',').map(Number)
      overviewData.turnover = turnoverList.reduce((a, b) => a + b, 0).toFixed(2)
    }

    if (userRes.code === 1) {
      initUserChart(userRes.data)
      const newUserList = userRes.data.newUserList.split(',').map(Number)
      overviewData.newUsers = newUserList.reduce((a, b) => a + b, 0)
    }

    if (ordersRes.code === 1) {
      initOrderChart(ordersRes.data)
      overviewData.validOrderCount = ordersRes.data.validOrderCount
      overviewData.orderCompletionRate = ordersRes.data.orderCompletionRate
      // 计算客单价
      const turnover = parseFloat(overviewData.turnover)
      const validOrders = ordersRes.data.validOrderCount
      overviewData.unitPrice = validOrders > 0 ? (turnover / validOrders).toFixed(2) : '0.00'
    }

    if (salesRes.code === 1) {
      initSalesChart(salesRes.data)
    }

  } catch (error) {
    console.error('加载报表数据失败:', error)
    ElMessage.error('加载报表数据失败')
  }
}

// 初始化营业额图表
const initTurnoverChart = (data: any) => {
  const chartDom = document.getElementById('turnoverChart')!
  turnoverChart = echarts.init(chartDom)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>¥{c}'
    },
    xAxis: {
      type: 'category',
      data: data.dateList ? data.dateList.split(',') : []
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '¥{value}'
      }
    },
    series: [
      {
        data: data.turnoverList ? data.turnoverList.split(',').map(Number) : [],
        type: 'line',
        smooth: true,
        itemStyle: {
          color: '#ffd666'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 214, 102, 0.5)' },
            { offset: 1, color: 'rgba(255, 214, 102, 0.1)' }
          ])
        }
      }
    ]
  }
  
  turnoverChart.setOption(option)
}

// 初始化用户统计图表
const initUserChart = (data: any) => {
  const chartDom = document.getElementById('userChart')!
  userChart = echarts.init(chartDom)
  
  const dateList = data.dateList ? data.dateList.split(',') : []
  const totalUserList = data.totalUserList ? data.totalUserList.split(',').map(Number) : []
  const newUserList = data.newUserList ? data.newUserList.split(',').map(Number) : []
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['总用户数', '新增用户']
    },
    xAxis: {
      type: 'category',
      data: dateList
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '总用户数',
        data: totalUserList,
        type: 'line',
        smooth: true,
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: '新增用户',
        data: newUserList,
        type: 'line',
        smooth: true,
        itemStyle: {
          color: '#67C23A'
        }
      }
    ]
  }
  
  userChart.setOption(option)
}

// 初始化订单统计图表
const initOrderChart = (data: any) => {
  const chartDom = document.getElementById('orderChart')!
  orderChart = echarts.init(chartDom)
  
  const dateList = data.dateList ? data.dateList.split(',') : []
  const orderCountList = data.orderCountList ? data.orderCountList.split(',').map(Number) : []
  const validOrderCountList = data.validOrderCountList ? data.validOrderCountList.split(',').map(Number) : []
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['总订单数', '有效订单数']
    },
    xAxis: {
      type: 'category',
      data: dateList
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '总订单数',
        data: orderCountList,
        type: 'bar',
        itemStyle: {
          color: '#E6A23C'
        }
      },
      {
        name: '有效订单数',
        data: validOrderCountList,
        type: 'bar',
        itemStyle: {
          color: '#67C23A'
        }
      }
    ]
  }
  
  orderChart.setOption(option)
}

// 初始化销量排名图表
const initSalesChart = (data: any) => {
  const chartDom = document.getElementById('salesChart')!
  salesChart = echarts.init(chartDom)
  
  // 获取原始数据
  const nameList = data.nameList ? data.nameList.split(',') : []
  const numberList = data.numberList ? data.numberList.split(',').map(Number) : []
  
  // 反转数据，使销量多的商品显示在上方
  const reversedNameList = [...nameList].reverse()
  const reversedNumberList = [...numberList].reverse()
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: reversedNameList,  // 使用反转后的数据
      axisLabel: {
        interval: 0,
        formatter: function(value: string) {
          return value.length > 6 ? value.substring(0, 6) + '...' : value
        }
      }
    },
    series: [
      {
        name: '销量',
        type: 'bar',
        data: reversedNumberList,  // 使用反转后的数据
        itemStyle: {
          color: '#F56C6C'
        },
        label: {
          show: true,
          position: 'right'
        }
      }
    ]
  }
  
  salesChart.setOption(option)
}

// 导出数据
const handleExport = async () => {
  try {
    await ElMessageBox.confirm('是否确认导出运营数据报表?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    exportLoading.value = true
    
    // 直接使用下载方法
    const result = await $download('/report/export', {}, '蜂享自然运营数据报表.xlsx')
    
    if (result.code === 1) {
      ElMessage.success('导出成功')
    } else {
      ElMessage.error(result.msg || '导出失败')
    }
  } catch (error: any) {
    if (error === 'cancel') {
      // 用户取消导出
      return
    }
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

// 窗口大小变化时重绘图表
const handleResize = () => {
  turnoverChart?.resize()
  userChart?.resize()
  orderChart?.resize()
  salesChart?.resize()
}

onMounted(() => {
  // 初始化加载数据
  loadReportData()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
  
  // 确保DOM更新后初始化图表
  nextTick(() => {
    // 图表已经在数据加载时初始化
  })
})
</script>

<style scoped>
.report-container {
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

.time-select-card {
  margin-bottom: 20px;
}

.time-select-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.quick-time-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.custom-time-range {
  flex: 1;
  min-width: 300px;
}

.export-button {
  margin-left: auto;
}

.overview-cards {
  margin-bottom: 20px;
}

.overview-card {
  border-radius: 8px;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.card-icon.turnover {
  background: linear-gradient(135deg, #ffd666, #faad14);
}

.card-icon.users {
  background: linear-gradient(135deg, #91d5ff, #409eff);
}

.card-icon.orders {
  background: linear-gradient(135deg, #b7eb8f, #52c41a);
}

.card-icon.price {
  background: linear-gradient(135deg, #ffccc7, #ff4d4f);
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.card-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.card-desc {
  font-size: 12px;
  color: #999;
}

.charts-container {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.chart-header {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .time-select-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .quick-time-buttons {
    justify-content: center;
  }
  
  .export-button {
    margin-left: 0;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .report-container {
    padding: 16px;
  }
  
  .card-content {
    flex-direction: column;
    text-align: center;
  }
  
  .quick-time-buttons {
    justify-content: stretch;
  }
  
  .quick-time-buttons .el-button {
    flex: 1;
  }
}
</style>