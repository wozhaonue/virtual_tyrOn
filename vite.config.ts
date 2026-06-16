import { fileURLToPath, URL } from 'node:url'
import visualizer from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
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
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    // vueDevTools(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
        // axios 和 lodash 这种工具库单独提出来
          if (id.includes('node_modules/axios') || id.includes('node_modules/lodash')) {
            return 'vendor-utils';
          }
          // 2. 将vue及其生态核心（vue，vue-router，pinia）独立打包成一个vendor-vue chunk （只提取稳定的基础库）
          if(id.includes('node_modules/vue') || id.includes('node_modules/pinia') || id.includes('node_modules/vue-router')){
            return 'vendor-vue';
          }
          // 3. 其余第三方依赖打包成一个vendor chunk
          if(id.includes('node_modules')){
            return 'vendor';
          }
        }
      }
    }
  }
})
