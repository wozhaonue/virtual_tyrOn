<script setup lang="ts">
import { ref } from 'vue'
// import { User, Check, RefreshRight, Plus } from '@element-plus/icons-vue'
import LoginModal from './components/LoginModal.vue'

const showLoginModal = ref(false)
</script>

<template>
  <el-container class="w-full min-h-screen px-6 py-4">
    <!-- 导航栏 -->
    <el-header height="auto" class="flex justify-center mb-8">
      <nav class="glass-nav flex items-center justify-between px-6 py-4 w-full" style="max-width: 1200px;">
        <div class="logo flex items-center gap-2 cursor-pointer logo-group">
          <svg
            class="logo-icon transition-transform duration-500"
            style="width: 32px; height: 32px; color: var(--lumina-primary);"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
            />
          </svg>
          <span class="font-serif font-bold text-2xl tracking-wide">Lumina</span>
        </div>
        
        <div class="nav-links flex gap-8">
          <a href="#" class="nav-link font-sans text-sm font-medium">发现</a>
          <a href="#" class="nav-link font-sans text-sm font-medium">系列</a>
          <a href="#" class="nav-link active font-sans text-sm font-semibold">虚拟试穿</a>
          <a href="#" class="nav-link font-sans text-sm font-medium">关于我们</a>
        </div>
        <button class="btn-login font-sans text-sm font-medium" @click="showLoginModal = true">登录 / 注册</button>
        <!-- 放置在Teleport下，防止css样式复杂 -->
          <Teleport to="body"><LoginModal v-model="showLoginModal" /></Teleport>
      </nav>
    </el-header>

    <!-- 主内容区 -->
    <el-main class="flex justify-center" >
      <div class="flex items-center justify-between w-full" style="max-width: 1200px; gap: 4rem;">
        
        
        
      </div>
    </el-main>

    <!-- 底部栏 -->
    <el-footer class="flex justify-between items-center mt-auto py-6 relative z-20 w-full" style="position: fixed; bottom: 0; max-width: 1280px; margin-left: auto; margin-right: auto; border-top: 1px solid rgba(21, 128, 61, 0.05); background: rgba(255,255,255,0.1); backdrop-filter: blur(12px);">
      <div class="flex items-center gap-2 px-6 w-full justify-between">
        <div class="flex items-center gap-2">
          <span class="font-serif font-bold text-lg" style="color: var(--lumina-surface);">Lumina</span>
          <span class="text-sm" style="color: rgba(21, 128, 61, 0.6);">© 2026 Virtual Try-On Project. 保留所有权利。</span>
        </div>
        <div class="flex gap-6 text-sm" style="color: rgba(21, 128, 61, 0.7);">
          <a href="#" class="footer-link">隐私政策</a>
          <a href="#" class="footer-link">服务条款</a>
          <a href="#" class="footer-link">联系支持</a>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<style scoped>
@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(236, 72, 153, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
}

@keyframes pulse-green {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

@keyframes scan {
  0% { top: -20%; opacity: 0; }
  50% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

a {
  text-decoration: none;
  color: inherit;
}

/* Nav Links */
.nav-link {
  color: var(--lumina-primary);
  position: relative;
  transition: color 0.2s;
}
.nav-link:hover {
  color: var(--lumina-accent);
}
.nav-link.active {
  color: var(--lumina-surface);
}
.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--lumina-accent);
  transform: scaleX(1);
  transition: transform 0.3s;
}
.logo-group {
  cursor: pointer;
}
.logo-group .logo-icon {
  transition: transform 0.3s;
}

/* Logo Hover */
.logo-group:hover .logo-icon {
  transform: rotate(12deg);
}

/* Login Button */
.btn-login {
  background-color: var(--lumina-surface);
  color: white;
  padding: 0.625rem 1.5rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.btn-login:hover {
  background-color: var(--lumina-primary);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Glass Panel Hover */
.glass-panel:hover {
  transform: scale(1.02);
}
.glass-panel:hover img {
  transform: scale(1.05);
}
.glass-panel:hover .hover-overlay {
  background: rgba(20, 83, 45, 0.2) !important;
}
.glass-panel:hover .refresh-btn {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* Thumbnails */
.thumb-inactive:hover {
  opacity: 1 !important;
}

/* Footer Links */
.footer-link {
  transition: color 0.3s;
}
.footer-link:hover {
  color: var(--lumina-surface);
}
</style>
