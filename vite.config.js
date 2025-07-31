import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],

  //配置 @
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  // 配置代理
  server: {
    // 修改关口
    host: '0.0.0.0',
    port: 7070,
    proxy: {
      // 将 /api 开头的请求转发到后端
      '/api': {
        target: 'http://localhost:3000', // 后端地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 去掉 /api 前缀
      }
    }
  }
})
