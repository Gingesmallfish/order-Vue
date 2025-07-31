import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
// 倒入路由文件
import router from "@/router/index.js";
import store from "@/store/index.js";
// 引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(store)
app.use(ElementPlus)
app.mount('#app')
