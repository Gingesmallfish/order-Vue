import {createRouter, createWebHashHistory} from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import Admin from '@/Layout/admin.vue'
import NotFound from '@/views/NotFound/404.vue'
import {ElMessage} from "element-plus";
import Register from "@/views/register.vue";
import configRouter from "@/router/config.js";

const routes = [
    {
        path: '/',
        redirect: '/login' // 首页重定向到登录页
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
        meta: {title: '在线接单平台 - 登录'}
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {title: '在线接单平台 - 注册'}
    },
    {
        path: '/home',
        name: 'Home',
        component: Admin,
        meta: {requiresAuth: true, title: '在线接单平台 - 首页'}, // 需要登录校验
        children: configRouter
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
        meta: {requiresAuth: true, title: '在线接单平台 - 404'}
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 路由守卫：校验登录状态
router.beforeEach((to, from, next) => {
    // 尝试从localStorage获取登录状态
    const token = localStorage.getItem('token')
    const requiresAuth = to.meta.requiresAuth

    // 设置页面标题
    document.title = to.meta.title

    if (requiresAuth && !token) {
        // 如果需要认证但没有token，重定向到登录页
        next('/login')
        // 显示无权限提示（需要在登录页处理这个查询参数）
        ElMessage.error('您没有权限访问该页面，请先登录！')
    } else if (token && to.path === '/login') {
        // 如果已登录且尝试访问登录页，重定向到首页
        next('/home')
    } else {
        // 其他情况正常跳转
        next()
    }
})
export default router
