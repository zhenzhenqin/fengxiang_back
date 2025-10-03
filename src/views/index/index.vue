<template>
  <div class="app-main">
    <!-- 核心修改：固定容器高度，确保在视口内 -->
    <div class="home-container">
      <!-- 核心修改：图片完整显示，不裁剪 -->
      <img src="https://cdn.pixabay.com/photo/2015/05/04/10/03/honey-752145_1280.jpg" alt="蜂享自然蜂蜜"
        class="home-honey-img" />
      <!-- 悬浮介绍卡片：位置微调，避免遮挡 -->
      <div class="home-intro-card">
        <h2 class="intro-title">蜂享自然 · 源自深山的甜蜜</h2>
        <p class="intro-desc">
          我们坚持原生态养蜂，每一滴蜂蜜都来自海拔800米以上的深山蜜源地，
          无添加蔗糖、无防腐剂，保留蜂蜜最本真的营养与风味。
          从蜂箱到餐桌，全程溯源，只为给您带来自然馈赠的纯粹甜蜜。
        </p>
        <div class="intro-tags">
          <span class="tag">原生态</span>
          <span class="tag">无添加</span>
          <span class="tag">深山蜜源</span>
          <span class="tag">全程溯源</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
 
</script>

<style scoped>
/* 4. 右侧首页内容：核心修改图片容器和图片样式 */
.app-main {
  padding: 24px;
  box-sizing: border-box;
  height: calc(100vh - 60px);
  /* 固定Main高度，与Header匹配 */
  overflow: hidden;
  /* 禁止Main内部滚动 */
}

.app-main {
  padding: 16px;
}

/* 核心修改1：固定容器高度，确保在Main内完全显示 */
.home-container {
  width: 100%;
  height: 100%;
  /* 填满Main高度，无需滚动 */
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(255, 184, 0, 0.15);
  background-color: #FFF3D0;
  /* 新增：图片未填满时用浅蜂蜜色填充，避免空白 */
}

/* 核心修改2：图片完整显示，不裁剪，适配容器 */
.home-honey-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* 关键：完整显示图片，不裁剪，按比例缩放 */
  object-position: center;
  /* 图片居中显示 */
}

/* 悬浮卡片：位置微调，避免底部遮挡 */
.home-intro-card {
  position: absolute;
  bottom: 24px;
  /* 从60px改为24px，靠近底部，不超出容器 */
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
  /* 从32px改为24px，减少高度占用 */
  box-shadow: 0 8px 24px rgba(255, 184, 0, 0.2);
  border-top: 4px solid #FFB800;
}

.intro-title {
  font-size: 20px;
  /* 从22px改为20px，减少高度 */
  color: #8B4513;
  margin: 0 0 12px 0;
  /* 从16px改为12px，减少间距 */
  font-weight: 600;
}

.intro-desc {
  font-size: 14px;
  /* 从15px改为14px，减少高度 */
  color: #666;
  line-height: 1.6;
  margin: 0 0 16px 0;
  /* 从20px改为16px，减少间距 */
}

.intro-tags {
  display: flex;
  gap: 8px;
  /* 从12px改为8px，减少间距 */
  flex-wrap: wrap;
}

.tag {
  font-size: 12px;
  /* 从13px改为12px，减少大小 */
  color: #8B4513;
  background-color: #FFF3D0;
  padding: 3px 10px;
  /* 从4px12px改为3px10px，减少大小 */
  border-radius: 20px;
}
</style>