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
        :unique-opened="false"
        class="flex-1 overflow-y-auto"
        text-color="#cbd5e1"
        active-text-color="#fff"
        background-color="transparent"
        router
        :collapse-transition="false"
        :openeds="openeds"
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
          <el-sub-menu
              v-else
              :index="menu.path"
              class="submenu-item"
              :ref="el => setMenuRef(el, menu.path)"
          >
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
import {ref, onMounted, watch, computed, nextTick} from 'vue';
import {useRoute, useRouter} from 'vue-router';
// 引入Element Plus图标
import {
  ShoppingCart,
  Wallet,
  User,
  Setting,
  UserFilled,
  HomeFilled,
  Handbag,
} from '@element-plus/icons-vue';
import {getMenuList} from '@/api/menu.js';
import {ElMessage} from 'element-plus';
import {useStore} from 'vuex'; // 引入Vuex

// 响应式数据
const originalMenuList = ref([]);
const route = useRoute();
const router = useRouter();
const store = useStore();
const activeMenu = ref('home');
const openeds = ref([]); // 控制展开的菜单项
const menuRefs = ref({}); // 存储菜单引用

// 图标映射表
const iconComponents = {
  ShoppingCart,
  Wallet,
  User,
  Setting,
  UserFilled,
  HomeFilled,
  Handbag,
};

// 设置菜单引用
const setMenuRef = (el, path) => {
  if (el) {
    menuRefs.value[path] = el;
  }
};

// 响应式菜单数据：优先使用搜索结果，否则则用原始菜单
const menuList = computed(() => {
  if (store.getters.isSearchMode && store.getters.searchResults) {
    // 确保 searchResults 是一个有效的数组
    const results =
        Array.isArray(store.getters.searchResults)
            ? store.getters.searchResults
            : (store.getters.searchResults.results || []);
    return results;
  } else {
    return originalMenuList.value;
  }
});

// 获取菜单数据（使用.then()处理异步）
const fetchMenuList = () => {
  getMenuList().then((res) => {
    // 处理成功响应
    if (res.data.code === 200) {
      originalMenuList.value = res.data.data;
      setActiveMenu(); // 初始化激活菜单
    } else {
      ElMessage.error(res.data.message || '菜单加载失败');
    }
  });
};

// 设置当前激活的菜单
const setActiveMenu = () => {
  activeMenu.value = route.path;
};

// 展开包含当前路由的菜单项
const expandCurrentMenu = () => {
  const currentPath = route.path;

  // 清空之前展开的菜单
  openeds.value = [];

  // 查找需要展开的菜单项
  const findAndExpand = (menus) => {
    for (const menu of menus) {
      // 如果当前菜单项就是激活的路由
      if (menu.path === currentPath) {
        if (menu.parent_id && menu.parent_id !== 0) {
          // 查找父级菜单并展开
          findParentAndExpand(menu.parent_id, originalMenuList.value);
        }
        return true;
      }

      // 如果有子菜单，递归查找
      if (menu.children && menu.children.length > 0) {
        if (findAndExpand(menu.children)) {
          // 如果在子菜单中找到了，展开当前菜单
          openeds.value.push(menu.path);
          return true;
        }
      }
    }
    return false;
  };

  // 查找父级并展开
  const findParentAndExpand = (parentId, menus) => {
    for (const menu of menus) {
      if (menu.id === parentId) {
        openeds.value.push(menu.path);
        if (menu.parent_id && menu.parent_id !== 0) {
          findParentAndExpand(menu.parent_id, menus);
        }
        break;
      }
    }
  };

  // 在搜索模式下特殊处理
  if (store.getters.isSearchMode && store.getters.searchResults) {
    // 展开所有搜索结果中的父级菜单
    expandSearchResults();
  } else {
    // 正常模式下展开当前菜单
    findAndExpand(originalMenuList.value);
  }
};

// 展开搜索结果中的菜单项
const expandSearchResults = () => {
  const searchResults = store.getters.searchResults.results || store.getters.searchResults;

  // 展开所有有子菜单的搜索结果项
  const expandAllParents = (menus) => {
    menus.forEach((menu) => {
      if (menu.children && menu.children.length > 0) {
        openeds.value.push(menu.path);
        expandAllParents(menu.children);
      }
    });
  };

  expandAllParents(searchResults);
};

// 监听路由变化，更新激活菜单和展开状态
watch(
    route,
    () => {
      setActiveMenu();
      nextTick(() => {
        expandCurrentMenu();
      });
    },
    {immediate: true} // 立即执行一次监听函数
);

// 监听搜索模式变化
watch(
    () => store.getters.isSearchMode,
    (newVal) => {
      nextTick(() => {
        if (newVal) {
          expandCurrentMenu();
        } else {
          openeds.value = [];
        }
      });
    }
);

// 监听菜单列表变化
watch(menuList, () => {
  nextTick(() => {
    expandCurrentMenu();
  });
});

// 组件挂载时获取菜单数据
onMounted(() => {
  fetchMenuList();
});
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
