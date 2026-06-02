<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const activeTab = ref<'login' | 'register'>('login')

const close = () => {
  emit('update:modelValue', false)
}

const showRoleSelect = ref(false)
const selectContainer = ref<HTMLElement | null>(null)

const closeDropdown = (e: MouseEvent) => {
  if (showRoleSelect.value && selectContainer.value && !selectContainer.value.contains(e.target as Node)) {
    showRoleSelect.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

interface loginFormInter {
  nickname: string;
  password: string;
}
interface registerFormInter {
  nickname: string;
  password: string;
  role: 'user' | 'admin';
  adminKey?: string;
}

const loginForm = ref<loginFormInter>({
  nickname: '',
  password: ''
})

const registerForm = ref<registerFormInter>({
  nickname: '',
  password: '',
  role: 'user',
})

const handleRoleSelect = (role: 'user' | 'admin') => {
  registerForm.value.role = role
  showRoleSelect.value = false
}

const handleSubmit = () => {
  if (activeTab.value === 'login') {
    console.log('Login:', loginForm.value)
  } else {
    console.log('Register:', registerForm.value)
  }
  // Implement actual login/register logic here
}
</script>

<template>
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay">
        <!-- Overlay Click -->
        <div class="modal-backdrop" @click="close"></div>
        
        <!-- Modal Container -->
        <div class="glass-panel modal-content animate-fade-in-up">
          
          <!-- Close Button -->
          <button @click="close" class="close-btn">
            <svg class="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Left Side: Branding -->
          <div class="modal-left">
            <!-- Decorative Blobs -->
            <div class="blob blob-1 animate-blob"></div>
            <div class="blob blob-2 animate-blob animation-delay-2000"></div>
            <div class="blob blob-3 animate-blob animation-delay-4000"></div>
            
            <!-- Content -->
            <div class="brand-content">
              <div class="brand-logo-container">
                <svg
                  class="brand-logo-icon"
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
                <span class="font-serif font-bold text-3xl tracking-wider text-surface">Lumina</span>
              </div>
              
              <h2 class="font-serif brand-title">
                探索您的<br/>专属数字衣橱
              </h2>
              <p class="font-sans brand-desc">
                体验全新 AI 虚拟试穿技术，发现最适合您的完美穿搭。
              </p>
            </div>

            <!-- Optional: Bottom graphic or illustration -->
            <div class="brand-footer">
              <div class="glass-nav tech-tag">
                <span class="pulse-dot animate-pulse-pink"></span>
                <span class="font-sans tech-text">全新 AI 技术</span>
              </div>
            </div>
          </div>

          <!-- Right Side: Form -->
          <div class="modal-right">
            
            <!-- Tabs -->
            <div class="tabs-container">
              <button 
                @click="activeTab = 'login'"
                :class="['tab-btn font-sans', activeTab === 'login' ? 'tab-btn-active' : 'tab-btn-inactive']"
              >
                登录
                <span v-if="activeTab === 'login'" class="tab-indicator"></span>
              </button>
              <button 
                @click="activeTab = 'register'"
                :class="['tab-btn font-sans', activeTab === 'register' ? 'tab-btn-active' : 'tab-btn-inactive']"
              >
                注册
                <span v-if="activeTab === 'register'" class="tab-indicator"></span>
              </button>
            </div>

            <!-- Scrollable Content Area -->
            <div class="scrollable-content">
              <!-- Forms -->
              <Transition name="fade" mode="out-in">
                <form v-if="activeTab === 'login'" @submit.prevent="handleSubmit" class="form-container">
                  <div class="form-group">
                    <label class="form-label font-sans">昵称</label>
                    <input 
                      v-model="loginForm.nickname" 
                      type="email" 
                      placeholder="请输入您的昵称" 
                      class="form-input font-sans"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <div class="label-row">
                      <label class="form-label font-sans">密码</label>
                    </div>
                    <input 
                      v-model="loginForm.password" 
                      type="password" 
                      placeholder="请输入密码" 
                      class="form-input font-sans"
                      required
                    />
                  </div>
                  <button type="submit" class="submit-btn submit-btn-login font-sans">
                    登 录
                  </button>
                </form>
  
                <form v-else @submit.prevent="handleSubmit" class="form-container">
                  <div class="form-group">
                    <label class="form-label font-sans">昵称</label>
                    <input 
                      v-model="registerForm.nickname" 
                      placeholder="请输入有效的昵称" 
                      class="form-input font-sans"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label font-sans">密码</label>
                    <input 
                      v-model="registerForm.password" 
                      type="password" 
                      placeholder="至少6位字符" 
                      class="form-input font-sans"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label font-sans">账户类型</label>
                    <div class="custom-select-container" ref="selectContainer">
                      <div 
                        class="form-input form-select font-sans" 
                        @click="showRoleSelect = !showRoleSelect"
                      >
                        {{ registerForm.role === 'admin' ? '管理员' : '普通用户' }}
                      </div>
                      <Transition name="dropdown">
                        <ul v-if="showRoleSelect" class="custom-options">
                          <li 
                            :class="['custom-option', registerForm.role === 'user' ? 'active' : '']" 
                            @click="handleRoleSelect('user')"
                          >
                            普通用户
                          </li>
                          <li 
                            :class="['custom-option', registerForm.role === 'admin' ? 'active' : '']" 
                            @click="handleRoleSelect('admin')"
                          >
                            管理员
                          </li>
                        </ul>
                      </Transition>
                    </div>
                  </div>
                   <div v-if="registerForm.role === 'admin'" class="form-group">
                    <label class="form-label font-sans">管理员密钥</label>
                    <input 
                      v-model="registerForm.adminKey" 
                      placeholder="请输入有效的管理员密钥" 
                      class="form-input font-sans"
                      required
                    />
                  </div>
                  <button type="submit" class="submit-btn submit-btn-register font-sans">
                    创建账户
                  </button>
                </form>
              </Transition>
            </div>
            
          </div>
        </div>
      </div>
    </Transition>
</template>

<style scoped>
/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.modal-content {
  position: relative;
  display: flex;
  overflow: hidden;
  width: 900px;
  height: 550px;
  max-width: 95vw;
  z-index: 10;
}

/* Glass Panel Base styles */
.glass-panel {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px 0 rgba(21, 128, 61, 0.05), 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border-radius: 2.5rem;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 20;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #1f2937;
}

.close-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* Left Side */
.modal-left {
  position: relative;
  width: 40%;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background-color: #f0fdf4;
}

/* Decorative Blobs */
.blob {
  position: absolute;
  width: 16rem;
  height: 16rem;
  border-radius: 50%;
  mix-blend-mode: multiply;
  filter: blur(64px);
  opacity: 0.7;
}

.blob-1 {
  top: 0;
  left: 0;
  background-color: #dcfce7;
}

.blob-2 {
  bottom: 0;
  right: 0;
  background-color: #fce7f3;
}

.blob-3 {
  bottom: -2rem;
  left: 5rem;
  background-color: #ffffff;
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 10s infinite alternate;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}

.brand-content {
  position: relative;
  z-index: 10;
}

.brand-logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
}

.brand-logo-icon {
  width: 2rem;
  height: 2rem;
  color: #15803d;
}

.text-surface {
  color: #14532d;
}

.brand-title {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
  color: #14532d;
  margin-bottom: 1rem;
}

.brand-desc {
  font-size: 1rem;
  font-weight: 300;
  color: rgba(21, 128, 61, 0.8);
}

.brand-footer {
  position: relative;
  z-index: 10;
  margin-top: auto;
}

.glass-nav {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 24px -1px rgba(21, 128, 61, 0.08);
  border-radius: 9999px;
}

.tech-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
}

.pulse-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: #ec4899;
}

@keyframes pulse-pink {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(236, 72, 153, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
}
.animate-pulse-pink {
  animation: pulse-pink 2s infinite;
}

.tech-text {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #14532d;
}

/* Right Side */
.modal-right {
  width: 60%;
  padding: 3rem;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
}

.tabs-container {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  flex-shrink: 0;
}

.scrollable-content {
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* Custom Scrollbar for form area */
.scrollable-content::-webkit-scrollbar {
  width: 6px;
}
.scrollable-content::-webkit-scrollbar-track {
  background: transparent;
}
.scrollable-content::-webkit-scrollbar-thumb {
  background-color: rgba(21, 128, 61, 0.2);
  border-radius: 10px;
}
.scrollable-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(21, 128, 61, 0.4);
}

.tab-btn {
  padding-bottom: 1rem;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
}

.tab-btn-active {
  color: #14532d;
  font-weight: 700;
}

.tab-btn-inactive {
  color: #9ca3af;
  font-weight: 500;
}

.tab-btn-inactive:hover {
  color: #4b5563;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #ec4899;
}

/* Form Styles */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(20, 83, 45, 0.7);
  margin-left: 0.25rem;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 0.25rem;
}

.forgot-link {
  font-size: 0.75rem;
  color: #15803d;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #22c55e;
}

.form-input {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  padding: 0.875rem 1.25rem;
  font-size: 0.875rem;
  color: #1f2937;
  transition: all 0.3s ease;
  outline: none;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:focus {
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.5);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1.25rem center;
  background-size: 1rem;
  padding-right: 3rem;
  cursor: pointer;
}

.form-select option {
  background-color: rgba(255, 255, 255, 0.95);
  color: #14532d;
  font-weight: 500;
  padding: 12px;
}

/* Custom Select Dropdown */
.custom-select-container {
  position: relative;
  width: 100%;
}

.custom-options {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  padding: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(21, 128, 61, 0.1), 0 8px 10px -6px rgba(21, 128, 61, 0.1);
  z-index: 50;
  list-style: none;
  margin: 0;
}

.custom-option {
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  color: #1f2937;
  cursor: pointer;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  font-family: 'Montserrat', sans-serif;
}

.custom-option:hover {
  background-color: rgba(21, 128, 61, 0.08);
  color: #15803d;
}

.custom-option.active {
  background-color: rgba(21, 128, 61, 0.1);
  color: #15803d;
  font-weight: 600;
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.submit-btn {
  margin-top: 1rem;
  width: 100%;
  border-radius: 9999px;
  color: white;
  font-weight: 500;
  padding: 0.875rem 1.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn-login {
  background-color: #ec4899;
  box-shadow: 0 4px 14px 0 rgba(236, 72, 153, 0.39);
}

.submit-btn-login:hover {
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.23);
  transform: translateY(-2px);
}

.submit-btn-register {
  background-color: #15803d;
  box-shadow: 0 4px 14px 0 rgba(21, 128, 61, 0.39);
}

.submit-btn-register:hover {
  box-shadow: 0 6px 20px rgba(21, 128, 61, 0.23);
  transform: translateY(-2px);
}

/* Social Styles */
.social-container {
  margin-top: 2rem;
  text-align: center;
}

.social-text {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-btn {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.social-btn:hover {
  background-color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.social-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

/* Form transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
