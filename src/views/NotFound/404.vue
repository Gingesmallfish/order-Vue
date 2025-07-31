<template>
  <div class="error-container">
    <!-- 错误信息卡片 -->
    <el-card class="error-card">
      <!-- 错误图标/图片区域 -->
      <div class="error-img-wrapper">
        <img
            src="@/assets/img/404.png"
            alt="404 Not Found"
            class="error-img"
        >
        <!-- 装饰元素 -->
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
      </div>

      <!-- 文字信息区域 -->
      <div class="error-info">
        <h1 class="error-code">404</h1>
        <p class="error-message">抱歉，您访问的页面不存在或已被移除</p>

        <!-- 操作按钮 -->
        <div class="error-actions">
          <el-button
              type="primary"
              size="large"
              @click="$router.push('/home')"
              class="back-home"
          >
            <el-icon>
              <Hide/>
            </el-icon>
            返回首页
          </el-button>
          <el-button
              type="default"
              size="large"
              @click="$router.go(-1)"
          >
            <el-icon>
              <ArrowLeft/>
            </el-icon>
            返回上一页
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import {Hide, ArrowLeft} from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.error-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #eef1f5 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;

  // 背景装饰点
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle at 20% 30%, rgba(180, 190, 255, 0.1) 0%, transparent 20%),
    radial-gradient(circle at 70% 60%, rgba(220, 230, 255, 0.1) 0%, transparent 30%);
    z-index: 0;
  }
}

.error-card {
  width: 100%;
  max-width: 800px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: relative;
  z-index: 1;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-img-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 250px;
  margin-bottom: 30px;

  .error-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.5s ease;

    &:hover {
      transform: scale(1.05) rotate(1deg);
    }
  }

  // 浮动装饰元素
  .floating-shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(64, 158, 255, 0.1);
    z-index: -1;
    animation: float 6s ease-in-out infinite;
  }

  .shape-1 {
    width: 120px;
    height: 120px;
    top: -20px;
    right: -30px;
    animation-delay: 0s;
  }

  .shape-2 {
    width: 80px;
    height: 80px;
    bottom: -10px;
    left: -20px;
    background: rgba(103, 194, 58, 0.1);
    animation-delay: 2s;
  }
}

.error-info {
  text-align: center;
  width: 100%;

  .error-code {
    font-size: 60px;
    font-weight: 700;
    color: #333;
    margin-bottom: 15px;
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: 10px;
      left: 10%;
      width: 80%;
      height: 15px;
      background: rgba(64, 158, 255, 0.15);
      z-index: -1;
      transform: skew(-12deg) rotate(-2deg);
    }
  }

  .error-message {
    font-size: 18px;
    color: #666;
    margin-bottom: 30px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }
}

.error-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;

  .back-home {
    background: #409eff;
    border-color: #409eff;

    &:hover {
      background: #66b1ff;
      border-color: #66b1ff;
    }
  }

  .el-button {
    padding: 12px 30px;
    font-size: 16px;
    transition: all 0.3s ease;

    .el-icon {
      margin-right: 8px;
    }
  }
}

// 浮动动画
@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

// 响应式调整
@media (max-width: 768px) {
  .error-card {
    padding: 30px 15px;
  }

  .error-img-wrapper {
    height: 200px;
  }

  .error-code {
    font-size: 45px;
  }

  .error-message {
    font-size: 16px;
  }

  .error-actions {
    flex-direction: column;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
  }

  .el-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .error-img-wrapper {
    height: 160px;
  }

  .error-code {
    font-size: 36px;
  }

  .error-message {
    font-size: 14px;
  }
}
</style>