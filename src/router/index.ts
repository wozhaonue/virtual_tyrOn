import { useUserStore } from '@/stores/userModal.ts'
import Home from '@/views/Home.vue'
import NotFound from '@/views/notFound.vue'
// import { ElMessage } from 'element-plus'
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
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Any',
      redirect: '/notFound',
    }
  ],
})
router.beforeEach((to,from) => {
  if(to.meta?.isRequireLogin === true){
    if(localStorage.getItem('auth_token') && localStorage.getItem('user_id')){
      return true;
    }
    // ElMessage({
    //         message: '请先登录后再进行操作',
    //         type: 'info',
    //       })
    useUserStore().setUserModalVisible(true);
    
    // 处理用户首次直接输入 URL 访问受保护页面时的白屏问题
    if (!from.name && to.path !== '/') {
      return '/';
    }
    return false;
  }
  return true;
})
export default router
