// 获取日期信息
export const getday = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const week = now.getDay()
  const weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  
  return [
    `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    `${month}月${day}日 ${weekArr[week]}`
  ]
}