<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { useProject } from '@/composables/useProject'
import { formatDate } from '@/utils/date'
import StatusBadge from '@/components/StatusBadge.vue'
import ProjectForm from '@/components/ProjectForm.vue'
import BaseLoading from '@/components/BaseLoading.vue'
import type { Project } from '@/types/project'
import { Monitor, Database, Cloud, Package, ChevronLeft, Edit2, Trash2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const projectId = route.params.id as string

const { project, isLoading, errorMsg, fetchProject, updateProject, deleteProject } = useProject()

const isDeleting = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

onMounted(() => {
  fetchProject(projectId)
})

const handleUpdate = async (formData: Project) => {
  if (!authStore.isAdmin) return toast.error('權限不足')

  isSaving.value = true
  try {
    await updateProject(projectId, formData)
    toast.success('更新成功！')
    isEditing.value = false
  } catch (error) {
    console.error(error)
    toast.error('更新失敗')
  } finally {
    isSaving.value = false
  }
}

const handleDelete = async () => {
  if (!authStore.isAdmin) return

  const confirmed = await toast.confirm(
    `確定要刪除專案「${project.value?.name}」嗎？此動作無法復原。`,
    '危險操作',
  )

  if (!confirmed) return

  isDeleting.value = true
  try {
    await deleteProject(projectId)
    toast.success('專案已成功刪除')
    router.push('/')
  } catch (error) {
    console.error(error)
    toast.error('刪除失敗')
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto space-y-6 animate-in">
    <div class="flex items-center justify-between">
      <button
        @click="router.push('/dashboard')"
        class="flex items-center gap-1 text-slate-500 hover:text-primary-600 transition-colors"
      >
        <ChevronLeft class="w-4 h-4" />
        <span>返回列表</span>
      </button>

      <div v-if="authStore.isAdmin && !isEditing" class="flex gap-2">
        <button @click="isEditing = true" class="btn btn-secondary py-1.5 px-3">
          <Edit2 class="w-4 h-4 mr-2" /> 編輯
        </button>
        <button @click="handleDelete" :disabled="isDeleting" class="btn btn-danger py-1.5 px-3">
          <Trash2 class="w-4 h-4 mr-2" /> 刪除
        </button>
      </div>
    </div>

    <BaseLoading v-if="isLoading" message="正在取得專案詳情資料..." />
    <div v-else-if="errorMsg" class="card p-12 text-center">
      <div class="text-red-500 text-lg mb-4">{{ errorMsg }}</div>
      <button @click="router.push('/dashboard')" class="btn btn-primary">回到列表</button>
    </div>

    <template v-else>
      <div v-if="isEditing" class="card p-8">
        <h2 class="page-title mb-6">編輯專案內容</h2>
        <ProjectForm
          v-if="project"
          :initial-data="project"
          :loading="isSaving"
          @submit="handleUpdate"
          @cancel="isEditing = false"
        />
      </div>

      <div v-else class="space-y-6">
        <div class="card overflow-hidden">
          <div class="card-header flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div class="flex items-center gap-3 mb-3">
                <StatusBadge :status="project?.status || 'Active'" />
                <span class="text-meta">ID: {{ projectId }}</span>
              </div>
              <h1 class="page-title text-4xl">{{ project?.name }}</h1>
              <p class="text-meta mt-2">建立時間：{{ formatDate(project?.createdAt) }}</p>
            </div>
          </div>

          <div class="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div
              class="lg:col-span-1 space-y-8 border-r border-slate-100 dark:border-slate-700 pr-8"
            >
              <div>
                <h3 class="detail-label">技術棧 Stack</h3>
                <div class="space-y-4">
                  <div class="tech-stack-item">
                    <Monitor class="tech-icon text-blue-500" />
                    <div>
                      <p class="tech-category-label">Frontend</p>
                      <p class="tech-content-text">{{ project?.techFrontend }}</p>
                    </div>
                  </div>
                  <div class="tech-stack-item">
                    <Database class="tech-icon text-green-500" />
                    <div>
                      <p class="tech-category-label">Database</p>
                      <p class="tech-content-text">{{ project?.techDatabase }}</p>
                    </div>
                  </div>
                  <div class="tech-stack-item">
                    <Cloud class="tech-icon text-indigo-500" />
                    <div>
                      <p class="tech-category-label">Deployment</p>
                      <p class="tech-content-text">{{ project?.techDeployment }}</p>
                    </div>
                  </div>
                  <div v-if="project?.techCore" class="tech-stack-item">
                    <Package class="tech-icon text-orange-500" />
                    <div>
                      <p class="tech-category-label">Key Packages</p>
                      <p class="tech-content-text">{{ project?.techCore }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="lg:col-span-2 space-y-8">
              <div>
                <h3 class="detail-label">成果展示 Screenshots</h3>
                <div
                  v-if="project?.screenshots?.length"
                  class="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div v-for="(imgUrl, index) in project.screenshots" :key="index">
                    <a :href="imgUrl" target="_blank" class="screenshot-card group">
                      <img :src="imgUrl" class="screenshot-img" alt="screenshot" />
                      <div class="screenshot-overlay">
                        <span class="screenshot-overlay-text">點擊查看全圖</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
