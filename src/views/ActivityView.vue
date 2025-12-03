<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'
import BaseTable from '@/components/BaseTable.vue'
import BaseChart from '@/components/BaseChart.vue'
import type { Column } from '@/types/table'
import type { ChartData, ChartOptions } from 'chart.js'

const authStore = useAuthStore()

// 定義資料介面
interface Attendee {
  id: string
  userId: string
  displayName: string
  pictureUrl: string
  status: string
  checkInTime: Timestamp | null
}

const tableColumns: Column<Attendee>[] = [
  { key: 'pictureUrl', label: '用戶', slot: true, width: '80px', align: 'center' },
  { key: 'displayName', label: '暱稱', slot: true },
  { key: 'status', label: '狀態', slot: true, align: 'center' },
  { key: 'checkInTime', label: '簽到時間', slot: true, align: 'right' },
]

const attendees = ref<Attendee[]>([])

onMounted(() => {
  const q = query(collection(db, 'attendees'), orderBy('checkInTime', 'desc'))
  onSnapshot(q, (snapshot) => {
    const tempAttendees: Attendee[] = []
    snapshot.forEach((doc) => {
      tempAttendees.push({
        id: doc.id,
        ...doc.data(),
      } as Attendee)
    })
    attendees.value = tempAttendees
  })
})

// 時間格式化
const formatDate = (ts: Timestamp | null) => {
  if (!ts) return '-'
  const date = ts.toDate()
  return date.toLocaleString('zh-TW', {
    hour12: false,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// 名字模糊處理函式
const maskName = (name: string) => {
  if (authStore.isAdmin) return name
  if (authStore.isObserver) {
    if (!name) return '***'
    if (name.length <= 2) return name[0] + '*'
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
  }
  return name
}

// 圖表資料
const chartData = computed<ChartData<'bar'>>(() => {
  const checkedInCount = attendees.value.length
  const targetCount = 10
  return {
    labels: ['已簽到人數', '目標人數'],
    datasets: [
      {
        label: '活動參與狀況',
        backgroundColor: ['#10b981', '#cbd5e1'],
        data: [checkedInCount, targetCount],
        borderRadius: 4,
        barThickness: 50,
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
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">活動即時監控</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">即時同步 LINE 用戶的簽到狀況。</p>
      </div>
      <div
        class="bg-indigo-50 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg font-medium"
      >
        目前人數：{{ attendees.length }} 人
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseChart :chart-data="chartData" :chart-options="chartOptions" />
      <div
        class="bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-700 dark:to-emerald-800 rounded-lg p-6 text-white shadow-md flex flex-col justify-between dark:text-gray-100"
      >
        <div>
          <h3 class="text-lg font-medium opacity-90">最新簽到</h3>
          <p class="text-3xl font-bold mt-2 truncate">
            {{ attendees[0] ? maskName(attendees[0].displayName) : '尚無人簽到' }}
          </p>
        </div>
        <div class="text-sm opacity-75">系統運作正常</div>
      </div>
    </div>

    <BaseTable :columns="tableColumns" :data="attendees">
      <template #cell-pictureUrl="{ row }">
        <div class="flex justify-center">
          <img
            v-if="row.pictureUrl"
            :src="row.pictureUrl"
            class="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600 object-cover transition-all duration-300"
            :class="{ 'blur-[3px]': authStore.isObserver }"
            alt="Avatar"
            title="個資已受保護 (觀察者模式)"
          />
          <div
            v-else
            class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300"
          >
            ?
          </div>
        </div>
      </template>

      <template #cell-displayName="{ row }">
        <span :class="{ 'text-gray-500 dark:text-gray-300 italic': authStore.isObserver }">
          {{ maskName(row.displayName) }}
        </span>
      </template>

      <template #cell-status="{ row }">
        <span
          class="px-3 py-1 rounded-full te xt-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
        >
          {{ row.status }}
        </span>
      </template>

      <template #cell-checkInTime="{ row }">
        <span class="text-gray-500 dark:text-gray-300 font-mono text-sm">
          {{ formatDate(row.checkInTime) }}
        </span>
      </template>
    </BaseTable>
  </div>
</template>
