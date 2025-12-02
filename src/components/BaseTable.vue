<script setup lang="ts" generic="T">
import type { Column } from '@/types/table'

defineProps<{
  columns: Column<T>[]
  data: T[]
}>()
</script>

<template>
  <div class="overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="col in columns"
            :key="String(col.key)"
            class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
            :class="{
              'text-left': !col.align || col.align === 'left',
              'text-center': col.align === 'center',
              'text-right': col.align === 'right',
            }"
            :style="{ width: col.width }"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          class="hover:bg-gray-50 transition-colors"
        >
          <td
            v-for="col in columns"
            :key="String(col.key)"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
            :class="{
              'text-left': !col.align || col.align === 'left',
              'text-center': col.align === 'center',
              'text-right': col.align === 'right',
            }"
          >
            <slot v-if="col.slot" :name="`cell-${String(col.key)}`" :row="row">
              {{ row[col.key] }}
            </slot>

            <template v-else>
              {{ row[col.key] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="data.length === 0" class="p-8 text-center text-gray-500">目前沒有資料</div>
  </div>
</template>
