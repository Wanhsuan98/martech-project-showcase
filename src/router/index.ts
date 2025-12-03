import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'activity',
          name: 'activity',
          component: () => import('@/views/ActivityView.vue'),
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
        },
      ],
    },
    {
      path: '/liff',
      name: 'liff',
      component: () => import('@/views/LiffView.vue'),
    },
  ],
})

const waitForAuthInit = () => {
  return new Promise<void>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      unsubscribe()
      resolve()
    })
  })
}

// 全域路由守衛
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthReady) {
    await waitForAuthInit()
    authStore.isAuthReady = true
    if (auth.currentUser) {
      authStore.user = auth.currentUser
    }
  }

  // 檢查該頁面是否需要登入
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !authStore.user) {
    next('/login')
  } else {
    next()
  }
})

export default router
