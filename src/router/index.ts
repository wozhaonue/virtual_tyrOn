import Home from '@/views/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/userCenter',
      name: 'userCenter',
      component: () => import('../views/UserCenter.vue'),
    },
    {
      path: '/tryOnHistory',
      name: 'tryOnHistory',
      component: () => import('../views/TryonHistory.vue'),
    },
  ],
})

export default router
