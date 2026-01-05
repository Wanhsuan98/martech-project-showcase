<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { FirebaseError } from 'firebase/app'

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  isLoading.value = true
  errorMsg.value = ''

  try {
    await authStore.login(email.value, password.value)
    router.push({ name: 'dashboard' })
  } catch (error) {
    handleAuthError(error)
  } finally {
    isLoading.value = false
  }
}

const handleDemoLogin = async () => {
  isLoading.value = true
  errorMsg.value = ''

  // 這裡填入你在 Firebase 建立的 Demo 帳號
  const demoEmail = import.meta.env.VITE_DEMO_EMAIL
  const demoPwd = import.meta.env.VITE_DEMO_PASSWORD

  try {
    await authStore.login(demoEmail, demoPwd)
    router.push({ name: 'dashboard' })
  } catch (error) {
    handleAuthError(error)
  } finally {
    isLoading.value = false
  }
}

const handleAuthError = (error: unknown) => {
  console.error('登入失敗:', error)
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMsg.value = '帳號或密碼錯誤'
        break
      case 'auth/too-many-requests':
        errorMsg.value = '登入失敗次數過多，請稍後再試'
        break
      default:
        errorMsg.value = `登入失敗 (${error.code})`
    }
  } else if (error instanceof Error) {
    errorMsg.value = error.message
  } else {
    errorMsg.value = '發生未知錯誤'
  }
}
</script>

<template>
  <div class="layout-login animate-in">
    <div class="card max-w-md w-full p-8 shadow-xl">
      <div class="text-center mb-8">
        <h1 class="page-title text-3xl">Frontend Hub</h1>
        <p class="page-subtitle mt-2">請登入以管理活動</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="form-label">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="input-base"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label class="form-label">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="input-base"
            placeholder="••••••••"
          />
        </div>

        <div v-if="errorMsg" class="text-error bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">
          {{ errorMsg }}
        </div>

        <div class="space-y-3">
          <button
            type="submit"
            :disabled="isLoading"
            class="btn-primary w-full py-2.5 font-semibold text-lg shadow-md"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <span class="animate-spin">⚪</span> 登入中...
            </span>
            <span v-else>登入</span>
          </button>

          <div class="relative flex py-2 items-center">
            <div class="divider-line"></div>
            <span class="text-meta mx-4">或</span>
            <div class="divider-line"></div>
          </div>

          <button
            type="button"
            @click="handleDemoLogin"
            :disabled="isLoading"
            class="btn-demo-login"
          >
            <UserCheck class="w-5 h-5" />
            Demo 帳號一鍵登入
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
