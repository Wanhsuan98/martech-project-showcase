<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, getDoc, deleteDoc, updateDoc, Timestamp } from 'firebase/firestore' // ✨ 新增 updateDoc
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const projectId = route.params.id as string

const project = ref<any>(null)
const isLoading = ref(true)
const errorMsg = ref('')

const isDeleting = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

// 編輯表單
const editForm = ref({
  name: '',
  tech: '',
  status: 'Active',
  description: '',
  screenshots: [] as string[],
})

const tempImageUrl = ref('')

onMounted(async () => {
  try {
    const docRef = doc(db, 'projects', projectId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      project.value = { id: docSnap.id, ...docSnap.data() }
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

// 進入編輯模式
const startEdit = () => {
  // 把目前的資料複製到表單中
  editForm.value = {
    name: project.value.name,
    tech: project.value.tech,
    status: project.value.status,
    description: project.value.description || '',
    screenshots: project.value.screenshots || [],
  }
  tempImageUrl.value = ''
  isEditing.value = true
}

const addScreenshot = () => {
  if (!tempImageUrl.value.trim()) return
  editForm.value.screenshots.push(tempImageUrl.value.trim())
  tempImageUrl.value = ''
}

const removeScreenshot = (index: number) => {
  editForm.value.screenshots.splice(index, 1)
}

const handleImgError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.style.display = 'none'
}

// 儲存修改
const handleUpdate = async () => {
  if (!authStore.isAdmin) return alert('權限不足')

  isSaving.value = true
  try {
    const docRef = doc(db, 'projects', projectId)

    // 寫入 Firebase
    await updateDoc(docRef, {
      name: editForm.value.name,
      tech: editForm.value.tech,
      status: editForm.value.status,
      description: editForm.value.description,
      screenshots: editForm.value.screenshots,
    })

    // 更新本地顯示資料
    project.value = {
      ...project.value,
      ...editForm.value,
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

const formatDate = (ts: Timestamp) => {
  if (!ts) return '-'
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
          class="text-gray-500 dark:text-gray-300 hover:text-indigo-600 transition"
        >
          ← 返回專案列表
        </button>

        <div v-if="authStore.isAdmin" class="flex gap-3">
          <template v-if="!isEditing">
            <button
              @click="startEdit"
              class="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition font-medium"
            >
              ✏️ 編輯
            </button>
            <button
              @click="handleDelete"
              :disabled="isDeleting"
              class="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium"
            >
              {{ isDeleting ? '刪除中...' : '🗑️ 刪除' }}
            </button>
          </template>
          <template v-else>
            <button
              @click="isEditing = false"
              class="text-gray-500 hover:text-gray-700 px-4 py-2 transition"
            >
              取消
            </button>
            <button
              @click="handleUpdate"
              :disabled="isSaving"
              class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium flex items-center"
            >
              <span v-if="isSaving" class="animate-spin mr-2">⚪</span>
              {{ isSaving ? '儲存中...' : '💾 儲存變更' }}
            </button>
          </template>
        </div>
      </div>

      <div
        v-if="isEditing"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-indigo-100 p-8 space-y-6"
      >
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">編輯專案內容</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >專案名稱</label
            >
            <input
              v-model="editForm.name"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >狀態</label
            >
            <select
              v-model="editForm.status"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:text-gray-300"
            >
              <option value="Active">進行中 (Active)</option>
              <option value="Pending">排程中 (Pending)</option>
              <option value="Completed">已完成 (Completed)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >使用技術 (逗號分隔)</label
          >
          <input
            v-model="editForm.tech"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:text-gray-300"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >專案描述</label
          >
          <textarea
            v-model="editForm.description"
            rows="5"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:text-gray-300"
            placeholder="請輸入詳細描述..."
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
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:text-gray-300"
              placeholder="貼上圖片網址 (https://i.imgur.com/...)"
              @keypress.enter.prevent="addScreenshot"
            />
            <button
              type="button"
              @click="addScreenshot"
              class="bg-gray-100 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-200 dark:bg-gray-700"
            >
              新增
            </button>
          </div>

          <div v-if="editForm.screenshots.length > 0" class="space-y-2">
            <div
              v-for="(url, index) in editForm.screenshots"
              :key="index"
              class="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-100 dark:border-gray-600 text-sm"
            >
              <a
                :href="url"
                target="_blank"
                class="flex items-center gap-2 overflow-hidden flex-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded transition"
                title="點擊預覽圖片"
              >
                <img
                  :src="url"
                  @error="handleImgError"
                  class="w-8 h-8 object-cover rounded border bg-white dark:bg-gray-800"
                />
                <span
                  class="truncate text-blue-600 dark:text-blue-300 underline decoration-blue-300"
                  >{{ url }}</span
                >
              </a>

              <button
                type="button"
                @click="removeScreenshot(index)"
                class="text-red-500 dark:text-red-400 hover:text-red-700 px-3 py-1 hover:bg-red-50 rounded ml-2 transition"
                title="移除此圖片"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div
          class="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800"
        >
          <div class="flex items-center gap-4 mb-4">
            <span
              class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              :class="{
                'bg-green-100 text-green-700': project.status === 'Active',
                'bg-blue-100 text-blue-700': project.status === 'Completed',
                'bg-yellow-100 text-yellow-700': project.status === 'Pending',
              }"
            >
              {{ project.status }}
            </span>
            <span class="text-gray-400 text-sm"> 建立於：{{ formatDate(project.createdAt) }} </span>
          </div>
          <h1 class="text-4xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
            {{ project.name }}
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
                v-for="tech in project.tech.split(',')"
                :key="tech"
                class="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md text-sm font-medium"
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
              {{ project.description || '此專案尚無詳細描述...' }}
            </div>
          </div>

          <div>
            <h3
              class="text-sm font-semibold text-gray-400 dark:text-gray-200 uppercase tracking-wider mb-3"
            >
              專案截圖 Screenshots
            </h3>
            <div
              v-if="project.screenshots && project.screenshots.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div
                v-for="(imgUrl, index) in project.screenshots"
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
