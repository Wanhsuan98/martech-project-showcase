<script setup lang="ts">
import { ref } from 'vue';
import BaseTable from '@/components/BaseTable.vue';
import type { Column } from '@/types/table';

interface Project {
  id: number;
  name: string;
  status: 'Active' | 'Completed' | 'Pending';
  tech: string;
}

const tableColumns: Column<Project>[] = [
  { key: 'id', label: 'ID', width: '80px', align: 'center' },
  { key: 'name', label: '專案名稱' },
  { key: 'tech', label: '使用技術' },
  { key: 'status', label: '狀態', slot: true, align: 'center' },
];

const projects = ref<Project[]>([
  { id: 1, name: '個人形象網站', status: 'Completed', tech: 'Vue3, Tailwind' },
  { id: 2, name: 'LINE CRM 系統', status: 'Active', tech: 'Vue3, LIFF, Pinia' },
  { id: 3, name: '後台管理介面', status: 'Pending', tech: 'TypeScript, Vite' },
  { id: 4, name: '活動報名 API', status: 'Active', tech: 'Node.js, Firebase' },
]);
</script>

<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">專案總覽</h1>
        <p class="text-gray-500 mt-1">即時監控所有專案的開發進度與系統狀態</p>
      </div>
      <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm">
        新增專案
      </button>
    </div>

    <BaseTable :columns="tableColumns" :data="projects">
      
      <template #cell-status="{ row }">
        <span 
          class="px-3 py-1 rounded-full text-xs font-medium"
          :class="{
            'bg-green-100 text-green-700': row.status === 'Active',
            'bg-blue-100 text-blue-700': row.status === 'Completed',
            'bg-yellow-100 text-yellow-700': row.status === 'Pending',
          }"
        >
          {{ row.status }}
        </span>
      </template>

      </BaseTable>
  </div>
</template>