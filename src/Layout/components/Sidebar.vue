<template>
  <div class="h-full flex flex-col bg-gray-900">
    <!-- Logo区域 -->
    <div class="h-16 flex items-center justify-center border-b border-gray-700">
      <img
          src="@/assets/img/Group.png"
          alt="平台Logo"
          class="h-8 object-contain"
      >
      <span class="text-xl font-bold ml-2 text-gray-100">校园接单云</span>
    </div>

    <el-menu
        :default-active="activeMenu"
        class="flex-1 overflow-y-auto"
        text-color="#cbd5e1"
        active-text-color="#fff"
        background-color="transparent"
        router
        :collapse-transition="false"
    >
      <!-- 动态渲染菜单项，添加过渡动画 -->
      <transition-group name="menu-item" tag="div">
        <!-- 使用 (menu, index) 同时获取当前项和索引 -->
        <template v-for="(menu, index) in menuList" :key="menu.id">
          <!-- 一级菜单项（无子集） -->
          <el-menu-item
              v-if="!menu.children || menu.children.length === 0"
              :index="menu.path"
              :key="menu.id"
              class="py-2 menu-item"
          >

            <el-icon v-if="menu.icon" class="text-blue-400">
              <component :is="iconComponents[menu.icon]"/>
            </el-icon>
            <span>{{ menu.name }}</span>
          </el-menu-item>

          <!-- 二级菜单（有子集） -->
          <el-sub-menu v-else :index="menu.path" class="submenu-item">
            <template #title>
              <el-icon v-if="menu.icon" class="text-blue-400">
                <component :is="iconComponents[menu.icon]"/>
              </el-icon>
              <span>{{ menu.name }}</span>
            </template>
            <!-- 二级菜单也可以添加索引 -->
            <transition-group name="submenu" tag="div">
              <el-menu-item
                  v-for="(subMenu, subIndex) in menu.children"
                  :key="subMenu.id"
                  :index="subMenu.path"
                  class="submenu-item"
              >
                <el-icon v-if="subMenu.icon" class="text-blue-400">
                  <component :is="iconComponents[subMenu.icon]"/>
                </el-icon>
                <span>{{ subMenu.name }}</span>
              </el-menu-item>
            </transition-group>
          </el-sub-menu>
        </template>
      </transition-group>
    </el-menu>

  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue'
import {useRoute} from 'vue-router'
// 引入Element Plus图标
import {
  ShoppingCart,
  Wallet,
  User,
  Setting, UserFilled, HomeFilled, Handbag
} from '@element-plus/icons-vue'
import {getMenuList} from "@/api/menu.js"
import index from "vuex";
import {ElMessage} from "element-plus";

// 响应式数据
const menuList = ref([])
const route = useRoute()
const activeMenu = ref('home')

// 图标映射表
const iconComponents = {
  ShoppingCart,
  Wallet,
  User,
  Setting,
  UserFilled,
  HomeFilled,
  Handbag,
}

// 获取菜单数据（使用.then()处理异步）
const fetchMenuList = () => {
  getMenuList().then(res => {
    // 处理成功响应
    if (res.data.code === 200) {
      menuList.value = res.data.data
      setActiveMenu()  // 初始化激活菜单
    } else {
      ElMessage.error(res.data.message || '菜单加载失败')
    }
  })
}

// 设置当前激活的菜单
const setActiveMenu = () => {
  activeMenu.value = route.path
}

// 监听路由变化，更新激活菜单
watch(route, () => {
  setActiveMenu()
})

// 组件挂载时获取菜单数据
onMounted(() => {
  fetchMenuList()
})
</script>

<style lang="scss" scoped>

.el-menu {
  border: none !important;
  background-color: transparent !important;
}

.el-menu-item.is-active,
.el-sub-menu__title.is-active {
  background-color: rgba(59, 74, 97, 0.3) !important;
}

.el-menu-item:hover,
.el-sub-menu__title:hover {
  background-color: rgba(75, 85, 99, 0.2) !important;
}

.el-sub-menu .el-menu {
  background-color: #1f2937 !important;
}

.el-sub-menu .el-menu-item {
  padding-left: 40px !important;
}


</style>
