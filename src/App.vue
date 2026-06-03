<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
// import { User, Check, RefreshRight, Plus } from '@element-plus/icons-vue'
import LoginModal from './components/LoginModal.vue'
import { useUserStore } from './stores/userModal.ts';
import { useUserInfoStore } from './stores/userInfo.ts';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const DEFAULT_AVATAR_URL = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
const userStore = useUserStore();
const userInfoStore = useUserInfoStore();
const userInfo = computed(() => userInfoStore.userInfo)
onMounted(() => {
  userInfoStore.fetchUserInfo();
})
onUnmounted(() => {
  userInfoStore.clearUserInfo();
})
const handleLogOut = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_role');
  userInfoStore.clearUserInfo();
  ElMessage({
    message: '退出登录',
    type: 'info',
  })
  userStore.setUserModalVisible(true);
}
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
          <router-link active-class="active" to="/" class="nav-link font-sans text-sm font-medium">主页</router-link>
          <router-link active-class="active" to="/tryOnHistory" class="nav-link font-sans text-sm font-medium">试穿历史</router-link>
          <router-link active-class="active" to="/userCenter" class="nav-link font-sans text-sm font-medium">个人中心</router-link>
          <a target="_blank" href="https://github.com/wozhaonue?tab=repositories" class="nav-link font-sans text-sm font-medium">关于我们</a>
        </div>
        <!-- 设置trigger为click以抵消默认焦点样式触发 -->
        <el-dropdown trigger="click" v-if="userInfo" style="cursor: pointer;" popper-class="lumina-dropdown-popper">
          <div class="userInfo">
            <el-avatar  :src="userInfo.avatar_url || DEFAULT_AVATAR_URL"/>
            <span>{{ userInfo?.nickname ?? "user"}}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
            <el-dropdown-item @click="() => {router.push('userCenter')}">个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLogOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
          </template>
        </el-dropdown>
        <button v-else  class="btn-login font-sans text-sm font-medium" @click="() => {userStore.setUserModalVisible(true)}">登录 / 注册</button>
        <!-- 放置在Teleport下，防止css样式复杂 -->
          <Teleport to="body"><LoginModal /></Teleport>
      </nav>
    </el-header>

    <!-- 主内容区 -->
    <el-main class="flex justify-center" >
      <div class="flex items-center justify-between w-full" style="max-width: 1200px; gap: 4rem;">
        <router-view></router-view>
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

/* 导航栏样式 */
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

/* logo hover样式 */
.logo-group:hover .logo-icon {
  transform: rotate(12deg);
}

/* 用户信息按钮  */
.userInfo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.3s ease-in-out;
}
.userInfo:hover {
  transform: scale(1.03);
}

/* 登录按钮 */
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

/* 拟态玻璃样式 */
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


.thumb-inactive:hover {
  opacity: 1 !important;
}

/* 底部链接样式*/
.footer-link {
  transition: color 0.3s;
}
.footer-link:hover {
  color: var(--lumina-surface);
}
</style>

<style>
/* 重写下拉菜单样式 */
.lumina-dropdown-popper {
  background: rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 4px 24px -1px rgba(21, 128, 61, 0.08) !important;
  border-radius: 0.7rem !important;
  padding: 0.5rem !important;
}

/* 隐藏箭头使界面更干净（Lumina风格偏好） */
.lumina-dropdown-popper .el-popper__arrow {
  display: none !important; 
}

.lumina-dropdown-popper .el-dropdown-menu {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.lumina-dropdown-popper .el-dropdown-menu__item {
  color: var(--lumina-primary, #15803D) !important;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  border-radius: 0.5rem !important;
  margin: 0.2rem 0;
  transition: all 0.3s ease;
}

.lumina-dropdown-popper .el-dropdown-menu__item:hover,
.lumina-dropdown-popper .el-dropdown-menu__item:focus {
  background-color: rgba(21, 128, 61, 0.1) !important;
  color: var(--lumina-accent, #EC4899) !important;
  transform: scale(0.95)
}
</style>
