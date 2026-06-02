<script setup lang="ts">
import { ref } from 'vue'

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

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

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
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md"  style="position: fixed; top: 50%; left: 50%; translate: -50% -50%;">
        <!-- Overlay Click -->
        <div class="absolute inset-0" @click="close"></div>
        
        <!-- Modal Container -->
        <div class="glass-panel relative flex overflow-hidden rounded-[2.5rem] w-[900px] h-[550px] max-w-[95vw] shadow-2xl z-10 animate-fade-in-up">
          
          <!-- Close Button -->
          <button @click="close" class="absolute top-6 right-6 z-20 text-gray-500 hover:text-gray-800 transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Left Side: Branding -->
          <div class="relative w-2/5 p-10 flex flex-col justify-between overflow-hidden bg-[#F0FDF4]">
            <!-- Decorative Blobs -->
            <div class="absolute top-0 left-0 w-64 h-64 bg-[#DCFCE7] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div class="absolute bottom-0 right-0 w-64 h-64 bg-[#FCE7F3] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div class="absolute -bottom-8 left-20 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            
            <!-- Content -->
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-12">
                <svg
                  class="w-8 h-8 text-[#15803D]"
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
                <span class="font-serif font-bold text-3xl tracking-wide text-[#14532D]">Lumina</span>
              </div>
              
              <h2 class="font-serif text-4xl font-bold leading-[1.2] text-[#14532D] mb-4">
                探索您的<br/>专属数字衣橱
              </h2>
              <p class="font-sans text-base font-light text-[#15803D]/80">
                体验全新 AI 虚拟试穿技术，发现最适合您的完美穿搭。
              </p>
            </div>

            <!-- Optional: Bottom graphic or illustration -->
            <div class="relative z-10 mt-auto">
              <div class="glass-nav inline-flex items-center gap-2 px-4 py-2 rounded-full">
                <span class="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse-pink"></span>
                <span class="text-xs font-semibold uppercase tracking-wider text-[#14532D]">全新 AI 技术</span>
              </div>
            </div>
          </div>

          <!-- Right Side: Form -->
          <div class="w-3/5 p-12 bg-white/60 flex flex-col justify-center">
            
            <!-- Tabs -->
            <div class="flex gap-8 mb-8 border-b border-gray-200/50">
              <button 
                @click="activeTab = 'login'"
                :class="[
                  'pb-4 font-sans text-lg transition-all duration-300 relative',
                  activeTab === 'login' ? 'text-[#14532D] font-bold' : 'text-gray-400 font-medium hover:text-gray-600'
                ]"
              >
                登录
                <span v-if="activeTab === 'login'" class="absolute bottom-0 left-0 w-full h-0.5 bg-[#EC4899]"></span>
              </button>
              <button 
                @click="activeTab = 'register'"
                :class="[
                  'pb-4 font-sans text-lg transition-all duration-300 relative',
                  activeTab === 'register' ? 'text-[#14532D] font-bold' : 'text-gray-400 font-medium hover:text-gray-600'
                ]"
              >
                注册
                <span v-if="activeTab === 'register'" class="absolute bottom-0 left-0 w-full h-0.5 bg-[#EC4899]"></span>
              </button>
            </div>

            <!-- Forms -->
            <Transition name="fade" mode="out-in">
              <form v-if="activeTab === 'login'" @submit.prevent="handleSubmit" class="flex flex-col gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-[#14532D]/70 ml-1">邮箱地址</label>
                  <input 
                    v-model="loginForm.email" 
                    type="email" 
                    placeholder="请输入您的邮箱" 
                    class="w-full bg-white/50 border border-white/80 rounded-2xl px-5 py-3.5 text-sm font-sans text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/50 focus:bg-white/80 transition-all"
                    required
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <div class="flex justify-between items-center ml-1">
                    <label class="text-xs font-semibold uppercase tracking-wider text-[#14532D]/70">密码</label>
                    <a href="#" class="text-xs text-[#15803D] hover:text-[#22C55E] transition-colors">忘记密码?</a>
                  </div>
                  <input 
                    v-model="loginForm.password" 
                    type="password" 
                    placeholder="请输入密码" 
                    class="w-full bg-white/50 border border-white/80 rounded-2xl px-5 py-3.5 text-sm font-sans text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/50 focus:bg-white/80 transition-all"
                    required
                  />
                </div>
                <button type="submit" class="mt-4 w-full rounded-full bg-[#EC4899] text-white font-medium py-3.5 px-6 shadow-[0_4px_14px_0_rgba(236,72,153,0.39)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.23)] hover:-translate-y-0.5 transition-all duration-300">
                  登 录
                </button>
              </form>

              <form v-else @submit.prevent="handleSubmit" class="flex flex-col gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-[#14532D]/70 ml-1">邮箱地址</label>
                  <input 
                    v-model="registerForm.email" 
                    type="email" 
                    placeholder="请输入有效的邮箱地址" 
                    class="w-full bg-white/50 border border-white/80 rounded-2xl px-5 py-3.5 text-sm font-sans text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/50 focus:bg-white/80 transition-all"
                    required
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-[#14532D]/70 ml-1">密码</label>
                  <input 
                    v-model="registerForm.password" 
                    type="password" 
                    placeholder="至少 8 位字符" 
                    class="w-full bg-white/50 border border-white/80 rounded-2xl px-5 py-3.5 text-sm font-sans text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/50 focus:bg-white/80 transition-all"
                    required
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-[#14532D]/70 ml-1">确认密码</label>
                  <input 
                    v-model="registerForm.confirmPassword" 
                    type="password" 
                    placeholder="再次输入密码" 
                    class="w-full bg-white/50 border border-white/80 rounded-2xl px-5 py-3.5 text-sm font-sans text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/50 focus:bg-white/80 transition-all"
                    required
                  />
                </div>
                <button type="submit" class="mt-4 w-full rounded-full bg-[#15803D] text-white font-medium py-3.5 px-6 shadow-[0_4px_14px_0_rgba(21,128,61,0.39)] hover:shadow-[0_6px_20px_rgba(21,128,61,0.23)] hover:-translate-y-0.5 transition-all duration-300">
                  创建账户
                </button>
              </form>
            </Transition>

            <!-- Social Login / Alternate -->
            <div class="mt-8 text-center">
              <p class="text-xs text-gray-400 mb-4">或者使用以下方式继续</p>
              <div class="flex justify-center gap-4">
                <button class="w-12 h-12 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-md transition-all">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </button>
                <button class="w-12 h-12 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-md transition-all">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
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

/* Glass Panel Base styles */
.glass-panel {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px 0 rgba(21, 128, 61, 0.05);
}

.glass-nav {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 24px -1px rgba(21, 128, 61, 0.08);
}

/* Blob Animation */
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

/* Pulse Pink */
@keyframes pulse-pink {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(236, 72, 153, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
}
.animate-pulse-pink {
  animation: pulse-pink 2s infinite;
}

/* Slide Up */
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
