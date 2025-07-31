<template>
  <!-- 导航栏容器：flex布局 + 高度 + 背景色 + 阴影 -->
  <div class="flex h-16 bg-gray-600 shadow-md items-center border-b border-gray-200">
    <!-- 中间空白区域：自动填充剩余空间 -->
    <div class="flex-1"></div>

    <!-- 右侧用户区域：添加 relative 定位，作为搜索框的容器 -->
    <div class="w-[32%] flex items-center justify-end pr-4 relative">
      <!-- 🔴 搜索框容器：绝对定位 + 过渡动画 -->
      <div
          :class="[
          'absolute left-0 top-1 flex items-center pl-4 transition-all duration-300 ease-in-out',
          showSearch ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'
        ]"
          ref="searchContainer"
      >
        <el-input
            v-model="searchText"
            placeholder="请输入搜索内容"
            clearable
            size="small"
            class="w-full"
            ref="searchInput"
            @keyup.enter="performSearch"
        />
        <el-button class="ml-2" size="small" @click="closeSearch" circle>
          <el-icon><Close /></el-icon>
        </el-button>
      </div>

      <!-- 🔴 原按钮区域：始终显示 -->
      <div class="flex items-center mr-4">
        <!-- 搜索按钮（修正图标用法：用组件形式） -->
        <el-tooltip content="搜索" placement="bottom">
          <el-button circle size="small" class="mr-2" @click="openSearch">
            <el-icon><Search /></el-icon>
          </el-button>
        </el-tooltip>

        <!-- 全屏切换按钮 -->
        <el-tooltip content="全屏" placement="bottom">
          <el-button circle size="small" class="mr-2" @click="toggleFullScreen">
            <el-icon><FullScreen /></el-icon>
          </el-button>
        </el-tooltip>

        <!-- 刷新按钮 -->
        <el-tooltip content="刷新" placement="bottom">
          <el-button circle size="small" class="mr-2" @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>
      </div>

      <!-- 用户下拉菜单 -->
      <el-dropdown @command="handleCommand">
        <div class="flex items-center cursor-pointer">
          <el-avatar shape="square" :size="36" class="mr-2" />
          <span class="text-gray-100">{{ username }}</span>
          <el-icon class="ml-1">
            <ArrowDown class="text-white" />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="settings">系统设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Close, Search, FullScreen, Refresh } from '@element-plus/icons-vue'
import { logout } from '@/api/auth.js'
import { computed, ref, nextTick } from 'vue'
import {searchMenu} from "@/api/menu.js";
import {useStore} from "vuex";

const router = useRouter()
const store = useStore()
// 获取本地用户数据
const username = computed(() => {
  return store.state.userinfo.username || '匿名用户' // 增加兜底，避免空值
})

// 搜索相关功能
const showSearch = ref(false)
const searchText = ref('')
const searchInput = ref(null)

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        logout().then((res) => {
          if (res.data.code === 200) {
            ElMessage.success(res.data.message)
            store.commit('CLEAR_AUTH_INFO')
            router.push('/login')
          } else {
            ElMessage.error(res.data.message)
          }
        })
      })
  }
}

// 搜索功能相关方法
const openSearch = () => {
  showSearch.value = true
  // 等待 DOM 更新后聚焦输入框
  nextTick(() => {
    searchInput.value?.focus()
  })
}



const performSearch = () => {
  if (!searchText.value.trim()) {
    ElMessage.warning('请输入搜索内容')
    return
  }

  searchMenu({
    searchText: searchText.value
  }).then((res) => {
    console.log('搜索响应:', res) // 添加这行来查看完整响应
    if (res.data.code === 200) {
      ElMessage.success(res.data.message || '搜索成功')

      // 获取三层嵌套的 data 数据
      const searchResults = res.data.data || []

      // 当我不想搜索时候，既要返回菜单数据，也要返回搜索结果，就是清空输入框的内容的时候

      // 将搜索结果保存到 Vuex
      store.dispatch('setSearchResults', searchResults)
    } else {
      ElMessage.error(res.data?.message || '搜索失败')
    }
  })
}


// 关闭搜索是清除状态
const closeSearch = () => {
  showSearch.value = false
  searchText.value = ''

}

// 全屏切换功能
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((e) => {
      ElMessage.warning(`全屏失败: ${e.message}`)
    })
  } else {
    document.exitFullscreen().catch((e) => {
      ElMessage.warning(`退出全屏失败: ${e.message}`)
    })
  }
}

// 刷新功能
const handleRefresh = () => {
  window.location.reload()
}
</script>

<style lang="scss" scoped>
/* 若需要覆盖 Element Plus 样式，可在此添加 */
:deep(.el-input) {
  .el-input__wrapper {
    background-color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
  }
  .el-input__wrapper:focus {
    box-shadow: none;
    border-color: #4ade80; /* 自定义聚焦颜色 */
  }
}
</style>
