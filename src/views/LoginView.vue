<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

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
    router.push('/')
  } catch (error) {
    console.error('登入失敗:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="layout-login">
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
