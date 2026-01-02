<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Menu, Moon, Sun, LogIn, LayoutDashboard } from 'lucide-vue-next'

const emit = defineEmits(['toggle-sidebar'])
const authStore = useAuthStore()
const route = useRoute()

// --- 滾動功能 ---
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const headerOffset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
}

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
    <div class="flex items-center gap-4 z-10">
      <button
        v-if="route.name !== 'landing'"
        @click="emit('toggle-sidebar')"
        class="btn-mode-toggle"
      >
        <Menu class="h-6 w-6" />
      </button>

      <h2
        class="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-100"
        :class="{ 'md:hidden': route.name !== 'landing' }"
      >
        <template v-if="authStore.user && route.name !== 'landing'"> 控制台 </template>

        <template v-else>
          Jenny Lin .<span class="text-indigo-600 dark:text-indigo-400"> Dev</span>
        </template>
      </h2>
    </div>

    <nav v-if="route.name === 'landing'" class="header-nav">
      <button @click="scrollToSection('about')" class="header-nav-item">個人簡介</button>
      <button @click="scrollToSection('skills')" class="header-nav-item">技能</button>
      <button @click="scrollToSection('experience')" class="header-nav-item">經歷</button>
    </nav>

    <div class="flex items-center space-x-3 sm:space-x-4 z-10">
      <button
        @click="toggleDark"
        class="btn-mode-toggle"
        :title="isDark ? '切換為亮色' : '切換為暗色'"
      >
        <Moon v-if="isDark" class="h-6 w-6" />
        <Sun v-else class="h-6 w-6" />
      </button>

      <div class="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

      <template v-if="authStore.user">
        <RouterLink v-if="route.name === 'landing'" to="/dashboard" class="btn-action">
          <LayoutDashboard class="w-4 h-4" /> <span class="pt-[1px]">控制台</span>
        </RouterLink>

        <div v-else class="flex items-center gap-3">
          <span class="text-sm text-gray-500 dark:text-gray-300 hidden sm:inline-block">
            {{ authStore.user?.email }}
          </span>
          <div class="avatar-header" :title="authStore.user.email || ''">
            {{ avatarLetter }}
          </div>
        </div>
      </template>

      <template v-else>
        <RouterLink to="/login" class="btn-action">
          <LogIn class="w-4 h-4" />
          <span class="pt-[1px]">登入</span>
        </RouterLink>
      </template>
    </div>
  </header>
</template>
