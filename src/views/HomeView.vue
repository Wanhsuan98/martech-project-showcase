<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'
import BaseTable from '@/components/BaseTable.vue'
import BaseChart from '@/components/BaseChart.vue'
import type { Column } from '@/types/table'
import type { ChartData, ChartOptions } from 'chart.js'

const authStore = useAuthStore()

interface Project {
  id: string
  name: string
  status: 'Active' | 'Completed' | 'Pending'
  tech: string
}

const tableColumns: Column<Project>[] = [
  { key: 'id', label: 'ID', width: '150px', align: 'center' },
  { key: 'name', label: '專案名稱' },
  { key: 'tech', label: '使用技術' },
  { key: 'status', label: '狀態', slot: true, align: 'center' },
]

const projects = ref<Project[]>([])

// 獲取專案資料
const fetchProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'projects'))

    const tempProjects: Project[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Project, 'id'>
      tempProjects.push({
        id: doc.id,
        ...data,
      })
    })

    // 更新畫面
    projects.value = tempProjects
    console.log('成功抓取資料:', tempProjects)
  } catch (error) {
    console.error('抓取資料失敗:', error)
    alert('連線失敗，請檢查 Console')
  }
}

onMounted(() => {
  fetchProjects()
})

// 圖表資料
const chartData = computed<ChartData<'bar'>>(() => {
  const vueCount = projects.value.filter((p) => p.tech.includes('Vue3')).length
  const nodeCount = projects.value.filter((p) => p.tech.includes('Node.js')).length
  const tsCount = projects.value.filter((p) => p.tech.includes('TypeScript')).length
  const nuxtCount = projects.value.filter((p) => p.tech.includes('Nuxt3')).length

  return {
    labels: ['Vue3', 'Node.js', 'TypeScript', 'Nuxt3'],
    datasets: [
      {
        label: '技術使用統計',
        backgroundColor: ['#6366f1', '#10b981', '#3b82f6', '#f59e0b'],
        data: [vueCount, nodeCount, tsCount, nuxtCount],
        borderRadius: 4,
      },
    ],
  }
})

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
        v-if="authStore.isAdmin"
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
