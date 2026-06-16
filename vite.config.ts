import { fileURLToPath, URL } from 'node:url'
import visualizer from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    visualizer({
      open: true, // 构建完成后自动在浏览器打开分析页面
      filename: 'stats.html', // 生成的分析报告文件名
      gzipSize: true, // 收集并显示gzip压缩后的体积
      brotliSize: true, // // 收集并显示brotli压缩后的体积
    })
    // vueDevTools(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://15e176b.r29.cpolar.top',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
