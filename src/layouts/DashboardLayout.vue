<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex h-screen bg-gray-50 font-sans text-gray-900">
    <aside class="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
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

      <div class="p-4 border-t border-slate-700 text-xs text-slate-500 text-center">
        © 2025 Jenny Profile
      </div>
    </aside>

    <main class="flex-1 flex flex-col overflow-hidden">
      <header class="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
        <h2 class="text-lg font-semibold text-gray-700">控制台</h2>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-500">Jenny (Admin)</span>
          <div
            class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold"
          >
            J
          </div>
        </div>
      </header>

      <div class="flex-1 overflow-auto p-6">
        <RouterView />
      </div>
    </main>
  </div>
</template>
