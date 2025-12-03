/** * 專案表單元件 */
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Project } from '@/types/project'

const props = defineProps<{
  loading: boolean
  initialData?: Project
}>()

const emit = defineEmits<{
  (e: 'submit', payload: Project): void
  (e: 'cancel'): void
}>()

const isEditMode = computed(() => !!props.initialData)

const form = ref({
  name: '',
  tech: '',
  status: 'Active' as 'Active' | 'Pending' | 'Completed',
  screenshots: [] as string[],
  description: '',
})

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        name: newData.name || '',
        tech: newData.tech || '',
        status: newData.status as 'Active' | 'Pending' | 'Completed',
        // 確保陣列是複製的，避免參照污染
        screenshots: [...(newData.screenshots || [])],
        description: newData.description || '',
      }
    }
  },
  { immediate: true },
)

// 暫存圖片網址
const tempImageUrl = ref('')

const addScreenshot = () => {
  if (!tempImageUrl.value.trim()) return
  form.value.screenshots.push(tempImageUrl.value.trim())
  tempImageUrl.value = ''
}

const removeScreenshot = (index: number) => {
  form.value.screenshots.splice(index, 1)
}

// 送出表單
const handleSubmit = () => {
  if (!form.value.name || !form.value.tech) {
    alert('請填寫完整資訊')
    return
  }
  emit('submit', { ...form.value })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >專案名稱</label
      >
      <input
        v-model="form.name"
        type="text"
        required
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
        placeholder="例如：後台管理系統"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >使用技術</label
      >
      <input
        v-model="form.tech"
        type="text"
        required
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
        placeholder="例如：Vue3, Tailwind"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >目前狀態</label
      >
      <select
        v-model="form.status"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
      >
        <option value="Active">進行中 (Active)</option>
        <option value="Pending">排程中 (Pending)</option>
        <option value="Completed">已完成 (Completed)</option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >專案描述</label
      >
      <textarea
        v-model="form.description"
        rows="5"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
        placeholder="請輸入專案詳細介紹、亮點功能..."
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >專案截圖連結 (Imgur 網址)</label
      >

      <div class="flex gap-2 mb-2">
        <input
          v-model="tempImageUrl"
          type="url"
          class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          placeholder="https://i.imgur.com/..."
          @keypress.enter.prevent="addScreenshot"
        />
        <button
          type="button"
          @click="addScreenshot"
          class="bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
        >
          新增
        </button>
      </div>

      <div v-if="form.screenshots.length > 0" class="space-y-2">
        <div
          v-for="(url, index) in form.screenshots"
          :key="index"
          class="flex items-center justify-between bg-gray-50 dark:bg-gray-600 p-2 rounded border border-gray-100 dark:border-gray-500 text-sm"
        >
          <a
            :href="url"
            target="_blank"
            class="flex items-center gap-2 overflow-hidden flex-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-500 p-1 rounded transition"
            title="點擊預覽圖片"
          >
            <img :src="url" class="w-8 h-8 object-cover rounded border bg-white dark:bg-gray-800" />
            <span class="truncate text-blue-600 dark:text-blue-300 underline decoration-blue-300">{{
              url
            }}</span>
          </a>

          <button
            type="button"
            @click="removeScreenshot(index)"
            class="text-red-500 hover:text-red-700 dark:hover:text-red-400 px-3 py-1 hover:bg-red-50 dark:hover:bg-gray-700 rounded ml-2 transition"
            title="移除此圖片"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-6">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
      >
        取消
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center"
      >
        <span v-if="loading" class="animate-spin mr-2">⚪</span>
        {{ loading ? '儲存中...' : isEditMode ? '確認更新' : '確認新增' }}
      </button>
    </div>
  </form>
</template>
