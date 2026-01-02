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
  } finally {
    isLoading.value = false
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
      </form>
    </div>
  </div>
</template>
