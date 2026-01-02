<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { RouterLink, useRoute } from 'vue-router'
import { LayoutDashboard, User, Activity, LogOut } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])
const authStore = useAuthStore()
const route = useRoute()

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const getLinkClass = (path: string) => {
  return ['nav-item', 'group', isActive(path) ? 'nav-item-active' : 'nav-item-inactive']
}
</script>

<template>
  <aside class="layout-sidebar" :class="isOpen ? 'translate-x-0' : '-translate-x-full'">
    <div class="layout-sidebar-header flex items-center justify-between px-6">
      <div class="flex items-center gap-2">
        <div class="sidebar-logo-container">
          <span class="text-white font-bold text-lg">J</span>
        </div>
        <span class="text-lg font-bold tracking-wide text-slate-100"
          >Jenny Lin . <span class="text-indigo-600 dark:text-indigo-400"> Dev</span></span
        >
      </div>
    </div>

    <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-6">
      <div class="space-y-1">
        <div class="nav-label">個人品牌</div>

        <RouterLink to="/" @click="emit('close')" :class="getLinkClass('/')">
          <User class="w-5 h-5" />
          <span class="font-medium">個人履歷</span>
        </RouterLink>
      </div>

      <div v-if="authStore.user" class="space-y-1">
        <div class="nav-label mt-2">後台管理</div>

        <RouterLink to="/dashboard" @click="emit('close')" :class="getLinkClass('/dashboard')">
          <LayoutDashboard class="w-5 h-5" />
          <span class="font-medium">專案總覽</span>
        </RouterLink>
      </div>

      <div v-if="authStore.user" class="space-y-1">
        <div class="nav-label flex items-center gap-2 mt-2">
          實驗室
          <span class="badge-demo">Demo</span>
        </div>

        <RouterLink to="/activity" @click="emit('close')" :class="getLinkClass('/activity')">
          <div class="relative">
            <Activity
              class="w-5 h-5"
              :class="isActive('/activity') ? 'text-white' : 'text-indigo-400'"
            />
          </div>
          <div class="flex-1 flex items-center justify-between">
            <span class="font-medium">活動監控 (Live)</span>
            <span class="pulse-container">
              <span class="pulse-ping"></span>
              <span class="pulse-dot"></span>
            </span>
          </div>
        </RouterLink>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-xs text-slate-500">© 2025 Jenny</span>
          <span class="text-[10px] text-slate-600">v1.0.0 Dev</span>
        </div>
        <button
          v-if="authStore.user"
          @click="authStore.logout"
          class="flex items-center gap-2 px-2 py-1.5 text-xs font-medium btn-danger"
        >
          <LogOut class="w-3.5 h-3.5" />
          <span>登出</span>
        </button>
      </div>
    </div>
  </aside>
</template>
