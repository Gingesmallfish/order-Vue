<template>
  <!-- Element Plus 官方布局容器 -->
  <el-container class="app-layout h-screen overflow-hidden">
    <!-- 侧边栏：固定宽度240px，集成Sidebar组件 -->
    <el-aside width="240px" class="sidebar-bg">
      <Sidebar/>
    </el-aside>

    <!-- 右侧内容区：垂直布局（Header + 主内容） -->
    <el-container direction="vertical">
      <!-- 头部：高度64px（h-16对应64px） -->
      <el-header class="header-bg">
        <Header/>
      </el-header>

      <!-- 主内容：自动填充剩余高度，支持滚动 -->
      <el-main class="main-content">
        <router-view/>
      </el-main>
      <!-- 页脚 -->
      <el-footer class="footer-bg">
        <Footer/>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import Header from "@/Layout/components/Header.vue";
import Sidebar from "@/Layout/components/Sidebar.vue";
import Footer from "@/Layout/components/Footer.vue";
</script>

<style lang="scss" scoped>
.app-layout {

  // 强制布局占满屏幕
  .el-container {
    height: 100vh;
  }

  // 侧边栏样式覆盖
  .el-aside.sidebar-bg {
    background-color: #1f2937 !important; // 深灰背景
    border-right: none !important; // 移除默认边框
    padding: 0 !important; // 清除默认内边距
  }

  // 头部样式覆盖
  .el-header.header-bg {
    background-color: #334155 !important; // 浅灰背景
    border-bottom: none !important; // 移除默认边框
    padding: 0 !important; // 清除默认内边距
    color: #ffffff; // 文字白色
  }

  // 主内容样式
  .el-main.main-content {
    padding: 0 !important; // 自定义内边距
    overflow: auto; // 内容溢出时滚动
  }


  // 页脚样式
  .el-footer.footer-bg {
    background-color: #334155 !important; // 浅灰背景
    border-top: none !important; // 移除默认边框
    padding: 0 !important; // 清除默认内边距
    color: #ffffff; // 文字白色
    height: 64px; // 高度与头部一致
  }
}

</style>