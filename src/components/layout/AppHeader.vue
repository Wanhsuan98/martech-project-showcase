<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Menu, Moon, Sun } from 'lucide-vue-next'

const emit = defineEmits(['toggle-sidebar'])
const authStore = useAuthStore()

// --- 使用者資訊 ---
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

// --- 暗色模式 ---
const isDark = ref(false)

const toggleDark = () => {
  isDark.value = !isDark.value
  updateTheme()
}

const updateTheme = () => {
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
  isDark.value = userTheme === 'dark' || (!userTheme && systemDark)
  updateTheme()
})
</script>

<template>
  <header class="layout-header">
    <div class="flex items-center gap-4">
      <button @click="emit('toggle-sidebar')" class="btn-mode-toggle">
        <Menu class="h-6 w-6" />
      </button>

      <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200 md:hidden">控制台</h2>
    </div>

    <div class="flex items-center space-x-4">
      <button
        @click="toggleDark"
        class="btn-mode-toggle"
        :title="isDark ? '切換為亮色' : '切換為暗色'"
      >
        <Moon v-if="isDark" class="h-6 w-6" />
        <Sun v-else class="h-6 w-6" />
      </button>

      <span class="text-sm text-gray-500 dark:text-gray-300 hidden sm:inline-block">
        {{ authStore.user?.email }} ({{ displayRole }})
      </span>

      <div class="avatar-header">
        {{ avatarLetter }}
      </div>
    </div>
  </header>
</template>
