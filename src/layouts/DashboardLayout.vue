<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const displayRole = computed(() => {
  if (!authStore.role) return 'Guest'
  return authStore.role.charAt(0).toUpperCase() + authStore.role.slice(1)
})

const avatarLetter = computed(() => {
  if (authStore.user && authStore.user.email) {
    return authStore.user.email.charAt(0).toUpperCase()
  }
  return '?'
})

// --- 暗色模式邏輯 ---
const isDark = ref(false)

const toggleDark = () => {
  isDark.value = !isDark.value

  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  const userTheme = localStorage.getItem('theme')
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (userTheme === 'dark' || (!userTheme && systemDark)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }
})
</script>

<template>
  <div
    class="flex h-screen bg-gray-50 dark:bg-gray-800 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300"
  >
    <aside class="w-64 bg-slate-900 dark:bg-gray-800 text-white flex flex-col shadow-xl z-20">
      <div class="h-16 flex items-center justify-center border-b border-slate-700 bg-slate-800">
        <span class="text-xl font-bold tracking-wider">Frontend Hub</span>
      </div>

      <nav class="flex-1 px-2 py-4 space-y-2">
        <RouterLink
          to="/"
          class="flex items-center px-4 py-3 rounded-lg transition-colors duration-200"
          active-class="bg-indigo-600 text-white shadow-md"
          :class="$route.path === '/' ? '' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
        >
          <span class="font-medium">專案總覽</span>
        </RouterLink>

        <RouterLink
          to="/activity"
          class="flex items-center px-4 py-3 rounded-lg transition-colors duration-200"
          active-class="bg-indigo-600 text-white shadow-md"
          :class="
            $route.path === '/activity' ? '' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          "
        >
          <span class="font-medium">活動監控 (Live)</span>
        </RouterLink>

        <RouterLink
          to="/about"
          class="flex items-center px-4 py-3 rounded-lg transition-colors duration-200"
          active-class="bg-indigo-600 text-white shadow-md"
          :class="
            $route.path === '/about' ? '' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          "
        >
          <span class="font-medium">個人履歷</span>
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-slate-700">
        <div class="flex items-center justify-between">
          <span class="text-xs text-slate-500">© 2025 Jenny</span>
          <button
            @click="authStore.logout"
            class="text-xs text-slate-400 hover:text-white transition-colors"
          >
            登出
          </button>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col overflow-hidden relative">
      <header
        class="h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-6 z-10 transition-colors duration-300"
      >
        <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200">控制台</h2>

        <div class="flex items-center space-x-4">
          <button
            @click="toggleDark"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-yellow-400"
            :title="isDark ? '切換為亮色' : '切換為暗色'"
          >
            <svg
              v-if="isDark"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>

          <span class="text-sm text-gray-500 dark:text-gray-300">
            {{ authStore.user?.email }} ({{ displayRole }})
          </span>

          <div
            class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold"
          >
            {{ avatarLetter }}
          </div>
        </div>
      </header>

      <div
        class="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
      >
        <RouterView />
      </div>
    </main>
  </div>
</template>
