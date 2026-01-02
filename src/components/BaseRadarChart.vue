<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Radar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, RadialLinearScale, Filler)

defineProps<{
  chartData: ChartData<'radar'>
  chartOptions?: ChartOptions<'radar'>
}>()
</script>

<template>
  <div class="h-full w-full">
    <Radar :data="chartData" :options="chartOptions" />
  </div>
</template>
