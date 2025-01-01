import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // 需要创建这个 store

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/chat/index.vue'),
          meta: { requireAuth: true }// 需要认证的路由
        },
        {
          path: 'chat/:chat_id',
          name: 'chat',
          component: () => import('@/views/chat/index.vue'),
          meta: { requireAuth: true }
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/settings/index.vue'),
          meta: { requireAuth: true }
        },
        {
          path: 'draw',
          name: 'draw',
          component: () => import('@/views/draw/MjView.vue'),
          meta: { requireAuth: true }
        },
        {
          path: 'chats',
          name: 'allChats',
          component: () => import('@/views/chat/index.vue'),
          meta: { requireAuth: true }
        }
        // 其他需要布局的路由...
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/user/LoginView.vue'),
      meta: { requiresAuth: false }
    }
  ]
})

// 全局路由守卫
router.beforeEach(async (to: RouteLocationNormalized) => {
  const authStore = useAuthStore()
  
  // 如果系统配置为不需要登录
  if (!import.meta.env.VITE_REQUIRES_AUTH) {
    // 如果试图访问登录页，直接重定向到首页
    if (to.name === 'login') {
      return { name: 'home' }
    }
    return true
  }

  // 系统需要登录的情况
  if (to.meta.requiresAuth) {
    // 检查是否已登录
    if (!authStore.isLoggedIn) {
      // 保存尝试访问的页面，登录后跳转
      return {
        name: 'login',
        query: { redirect: to.fullPath }
      }
    }
  }
  
  // 如果已登录还访问登录页，重定向到首页
  if (to.name === 'login' && authStore.isLoggedIn) {
    return { name: 'home' }
  }
})

export default router

