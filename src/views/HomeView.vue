<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseChart from '@/components/BaseChart.vue'
import type { Column } from '@/types/table'
import type { ChartData, ChartOptions } from 'chart.js'

interface Project {
  id: number
  name: string
  status: 'Active' | 'Completed' | 'Pending'
  tech: string
}

const tableColumns: Column<Project>[] = [
  { key: 'id', label: 'ID', width: '80px', align: 'center' },
  { key: 'name', label: '專案名稱' },
  { key: 'tech', label: '使用技術' },
  { key: 'status', label: '狀態', slot: true, align: 'center' },
]

const projects = ref<Project[]>([
  { id: 1, name: '個人形象網站', status: 'Completed', tech: 'Vue3, Tailwind' },
  { id: 2, name: 'LINE CRM 系統', status: 'Active', tech: 'Vue3, LIFF, Pinia' },
  { id: 3, name: '後台管理介面', status: 'Pending', tech: 'TypeScript, Vite' },
  { id: 4, name: '活動報名 API', status: 'Active', tech: 'Node.js, Firebase' },
])

// 圖表資料
const chartData = computed<ChartData<'bar'>>(() => ({
  labels: ['Vue3', 'TypeScript', 'Node.js', 'React'],
  datasets: [
    {
      label: '專案技術統計',
      backgroundColor: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b'],
      data: [2, 1, 1, 0],
      borderRadius: 4,
    },
  ],
}))

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
  },
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">專案總覽</h1>
        <p class="text-gray-500 mt-1">即時監控所有專案的開發進度與技術分佈。</p>
      </div>
      <button
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
      >
        新增專案
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseChart :chart-data="chartData" :chart-options="chartOptions" />

      <div
        class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white shadow-md flex flex-col justify-between"
      >
        <div>
          <h3 class="text-lg font-medium opacity-90">本月完成專案</h3>
          <p class="text-4xl font-bold mt-2">3</p>
        </div>
        <div class="text-sm opacity-75">比上個月成長 +20%</div>
      </div>
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
