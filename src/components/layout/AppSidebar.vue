<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { RouterLink, useRoute } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()

const navItems = [
  { name: '專案總覽', path: '/' },
  { name: '活動監控 (Live)', path: '/activity' },
  { name: '個人履歷', path: '/about' },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside
    class="w-64 bg-slate-900 dark:bg-gray-800 text-white flex flex-col shadow-xl z-20 shrink-0 transition-colors duration-300"
  >
    <div class="h-16 flex items-center justify-center border-b border-slate-700 bg-slate-800">
      <span class="text-xl font-bold tracking-wider">Frontend Hub</span>
    </div>

    <nav class="flex-1 px-2 py-4 space-y-2">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center px-4 py-3 rounded-lg transition-colors duration-200"
        :class="[
          isActive(item.path)
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white',
        ]"
      >
        <span class="font-medium">{{ item.name }}</span>
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
</template>
