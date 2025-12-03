<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

defineProps<{
  chartData: ChartData<'bar'>
  chartOptions?: ChartOptions<'bar'>
}>()
</script>

<template>
  <div
    class="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
  >
    <div class="relative h-64">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
