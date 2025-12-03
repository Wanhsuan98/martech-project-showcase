<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'
import BaseTable from '@/components/BaseTable.vue'
import BaseChart from '@/components/BaseChart.vue'
import BaseModal from '@/components/BaseModal.vue'
import type { Column } from '@/types/table'
import type { ChartData, ChartOptions } from 'chart.js'

const authStore = useAuthStore()

// 定義資料結構
interface Project {
  id: string
  name: string
  status: 'Active' | 'Completed' | 'Pending'
  tech: string
  createdAt?: any
}

const tableColumns: Column<Project>[] = [
  { key: 'name', label: '專案名稱' },
  { key: 'tech', label: '使用技術' },
  { key: 'status', label: '狀態', slot: true, align: 'center' },
]

const projects = ref<Project[]>([])
const isModalOpen = ref(false)
const isSubmitting = ref(false)

// 表單
const form = ref({
  name: '',
  tech: '',
  status: 'Active' as const,
})

// 即時讀取 Firebase 資料
onMounted(() => {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))

  onSnapshot(q, (snapshot) => {
    projects.value = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Project,
    )
  })
})

// --- 專案邏輯 ---
const handleAddProject = async () => {
  if (!form.value.name || !form.value.tech) return alert('請填寫完整資訊')

  isSubmitting.value = true
  try {
    await addDoc(collection(db, 'projects'), {
      name: form.value.name,
      tech: form.value.tech,
      status: form.value.status,
      createdAt: serverTimestamp(),
    })

    isModalOpen.value = false
    form.value = { name: '', tech: '', status: 'Active' }
  } catch (error) {
    console.error('新增失敗', error)
    alert('新增失敗，權限不足或是網路錯誤')
  } finally {
    isSubmitting.value = false
  }
}

// 圖表資料
const chartData = computed<ChartData<'bar'>>(() => {
  const active = projects.value.filter((p) => p.status === 'Active').length
  const completed = projects.value.filter((p) => p.status === 'Completed').length
  const pending = projects.value.filter((p) => p.status === 'Pending').length

  return {
    labels: ['Active', 'Completed', 'Pending'],
    datasets: [
      {
        label: '專案狀態統計',
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
        data: [active, completed, pending],
        borderRadius: 4,
      },
    ],
  }
})

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">專案總覽</h1>
        <p class="text-gray-500 mt-1">管理您的所有 MarTech 專案進度。</p>
      </div>

      <button
        v-if="authStore.isAdmin"
        @click="isModalOpen = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
      >
        <span>+</span> 新增專案
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseChart :chart-data="chartData" :chart-options="chartOptions" />
      <div
        class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white shadow-md flex flex-col justify-between"
      >
        <div>
          <h3 class="text-lg font-medium opacity-90">總專案數</h3>
          <p class="text-4xl font-bold mt-2">{{ projects.length }}</p>
        </div>
        <div class="text-sm opacity-75">資料來自 Firestore</div>
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

    <BaseModal :is-open="isModalOpen" title="新增專案" @close="isModalOpen = false">
      <form @submit.prevent="handleAddProject" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">專案名稱</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="例如：企業形象官網"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">使用技術</label>
          <input
            v-model="form.tech"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="例如：Vue3, Tailwind"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">目前狀態</label>
          <select
            v-model="form.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="Active">進行中 (Active)</option>
            <option value="Pending">排程中 (Pending)</option>
            <option value="Completed">已完成 (Completed)</option>
          </select>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
            type="button"
            @click="isModalOpen = false"
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center"
          >
            <span v-if="isSubmitting" class="animate-spin mr-2">⚪</span>
            {{ isSubmitting ? '儲存中...' : '確認新增' }}
          </button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>
