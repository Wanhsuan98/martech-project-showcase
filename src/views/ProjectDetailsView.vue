<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, getDoc, deleteDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'
import StatusBadge from '@/components/StatusBadge.vue'
import ProjectForm from '@/components/ProjectForm.vue'
import type { Project } from '@/types/project'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const projectId = route.params.id as string

const project = ref<Project | null>(null)
const isLoading = ref(true)
const errorMsg = ref('')

const isDeleting = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

onMounted(async () => {
  try {
    const docRef = doc(db, 'projects', projectId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      project.value = { id: docSnap.id, ...docSnap.data() } as Project
    } else {
      errorMsg.value = '找不到此專案，可能已被刪除。'
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = '讀取資料失敗'
  } finally {
    isLoading.value = false
  }
})

// 處理圖片載入錯誤
const handleImgError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.style.display = 'none'
}

// 儲存修改
const handleUpdate = async (formData: Project) => {
  if (!authStore.isAdmin) return alert('權限不足')

  isSaving.value = true
  try {
    const docRef = doc(db, 'projects', projectId)

    await updateDoc(docRef, {
      name: formData.name,
      tech: formData.tech,
      status: formData.status,
      description: formData.description,
      screenshots: formData.screenshots,
    })

    // 更新本地顯示資料
    if (project.value) {
      project.value = {
        ...project.value,
        ...formData,
      }
    }

    alert('✅ 更新成功！')
    isEditing.value = false
  } catch (error) {
    console.error(error)
    alert('❌ 更新失敗')
  } finally {
    isSaving.value = false
  }
}

// 刪除專案
const handleDelete = async () => {
  if (!authStore.isAdmin) return
  if (!confirm('確定要刪除這個專案嗎？此動作無法復原。')) return

  isDeleting.value = true
  try {
    await deleteDoc(doc(db, 'projects', projectId))
    alert('專案已刪除')
    router.push('/')
  } catch (error) {
    console.error(error)
    alert('刪除失敗')
  } finally {
    isDeleting.value = false
  }
}

// 時間格式化
const formatDate = (ts: Timestamp) => {
  if (!ts || !ts.toDate) return '-'
  return ts.toDate().toLocaleString('zh-TW')
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="errorMsg" class="text-center py-12">
      <div class="text-red-500 text-xl mb-4">⚠️ {{ errorMsg }}</div>
      <button @click="router.push('/')" class="text-indigo-600 hover:underline">← 回到列表</button>
    </div>

    <div v-else class="space-y-6">
      <div class="flex items-center justify-between">
        <button
          @click="router.push('/')"
          class="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          ← 返回專案列表
        </button>

        <div v-if="authStore.isAdmin" class="flex gap-3">
          <template v-if="!isEditing">
            <button
              @click="isEditing = true"
              class="bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-600 transition font-medium"
            >
              ✏️ 編輯
            </button>
            <button
              @click="handleDelete"
              :disabled="isDeleting"
              class="bg-red-50 dark:bg-gray-700 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-gray-600 transition font-medium"
            >
              {{ isDeleting ? '刪除中...' : '🗑️ 刪除' }}
            </button>
          </template>
        </div>
      </div>

      <div
        v-if="isEditing"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-indigo-100 dark:border-gray-700 p-8 space-y-6 transition-colors"
      >
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">編輯專案內容</h2>

        <ProjectForm
          v-if="project"
          :initial-data="project"
          :loading="isSaving"
          @submit="handleUpdate"
          @cancel="isEditing = false"
        />
      </div>

      <div
        v-else
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors"
      >
        <div
          class="p-8 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800"
        >
          <div class="flex items-center gap-4 mb-4">
            <StatusBadge :status="project?.status || 'Active'" />
            <span class="text-gray-400 dark:text-gray-400 text-sm">
              建立於：{{ formatDate(project?.createdAt as Timestamp) }}
            </span>
          </div>
          <h1 class="text-4xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
            {{ project?.name }}
          </h1>
        </div>

        <div class="p-8 space-y-8">
          <div>
            <h3
              class="text-sm font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider mb-3"
            >
              使用技術 Stack
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in project?.tech?.split(',') ?? []"
                :key="tech"
                class="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md text-sm font-medium"
              >
                {{ tech.trim() }}
              </span>
            </div>
          </div>

          <div>
            <h3
              class="text-sm font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider mb-3"
            >
              專案描述 Description
            </h3>
            <div
              class="prose max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"
            >
              {{ project?.description || '此專案尚無詳細描述...' }}
            </div>
          </div>

          <div>
            <h3
              class="text-sm font-semibold text-gray-400 dark:text-gray-200 uppercase tracking-wider mb-3"
            >
              專案截圖 Screenshots
            </h3>
            <div
              v-if="project?.screenshots && project?.screenshots.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div
                v-for="(imgUrl, index) in project?.screenshots"
                :key="index"
                class="group relative rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
              >
                <a
                  :href="imgUrl"
                  target="_blank"
                  class="flex items-center gap-2 overflow-hidden flex-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded transition"
                  title="點擊預覽圖片"
                >
                  <img
                    :src="imgUrl"
                    @error="handleImgError"
                    class="w-8 h-8 object-cover rounded border bg-white dark:bg-gray-800"
                  />
                  <span
                    class="truncate text-blue-600 dark:text-blue-300 underline decoration-blue-300"
                    >{{ imgUrl }}</span
                  >
                </a>
              </div>
            </div>
            <div
              v-else
              class="bg-gray-50 rounded-lg p-6 text-center border border-dashed border-gray-300"
            >
              <span class="text-gray-400">此專案尚未上傳截圖</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
