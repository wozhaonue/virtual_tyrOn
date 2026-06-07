import { useUserStore } from '@/stores/userModal.ts'
import Home from '@/views/Home.vue'
import NotFound from '@/views/notFound.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        isRequireLogin: true,
      },
      component: Home,
    },
    {
      path: '/userCenter',
      name: 'userCenter',
       meta: {
        isRequireLogin: true,
      },
      component: () => import('../views/UserCenter.vue'),
    },
    {
      path: '/tryOnHistory',
      name: 'tryOnHistory',
       meta: {
        isRequireLogin: true,
      },
      component: () => import('../views/TryonHistory.vue'),
    },
    {
      path: '/notFound',
      name: 'notFound',
      component: NotFound,
    }
  ],
})
router.beforeEach((to,from) => {
  if(to.meta?.isRequireLogin === true){
    if(localStorage.getItem('auth_token') && localStorage.getItem('user_id')){
      return true;
    }
    useUserStore().setUserModalVisible(true);
    return false;
  }
})
export default router
