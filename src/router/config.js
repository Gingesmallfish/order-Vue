import HomeView from "@/views/HomeView.vue";
import Settings from "@/views/Settings.vue";
import Profile from "@/views/Profile.vue";

import AdminAccount from "@/views/user-manage/admin-account.vue";
 import SystemProfile from "@/views/system-setting/System-Profile.vue";
import HelpCenter from "@/views/system-setting/help-center.vue";
import SystemConfig from "@/views/system-setting/system-config.vue";


const configRouter = [
    {
        path: '',
        name: 'HomeView',
        component: HomeView,
        meta: {requiresAuth: true, title: '在线接单平台 - 首页'}
    },

    {
        path: '/profile',
        name: 'profile',
        component: Profile,
        meta: {requiresAuth: true, title: '在线接单平台 - 个人中心'}
    },
    {
        path: '/settings',
        name: 'settings',
        component: Settings,
        meta: {requiresAuth: true, title: '在线接单平台 - 设置'}
    },
    {
        path: '/system-setting/System-Profile',
        name: 'system-Profile',
        component: SystemProfile,
        meta: {requiresAuth: true, title: '在线接单平台 - 个人中心'}
    },
    {
        path: '/system-setting/help-center',
        name: 'help-center',
        component: HelpCenter,
        meta: {requiresAuth: true, title: '在线接单平台 - 帮助中心'}
    },
    {
        path: '/system-setting/system-config',
        name: 'system-config',
        component: SystemConfig,
        meta: {requiresAuth: true, title: '在线接单平台 - 系统配置'}
    },

    {
        path: '/user-manage/admin-account',
        name: 'admin-account',
        component: AdminAccount,
        meta: {requiresAuth: true, title: '在线接单平台 - 管理员账户'}
    },
]

export default configRouter;