<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProfile } from '@/composables/useProfile'
import { useProjects } from '@/composables/useProjects'
import BaseRadarChart from '@/components/BaseRadarChart.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import BaseLoading from '@/components/BaseLoading.vue'
import type { Project } from '@/types/project'
import {
  Github,
  Linkedin,
  Mail,
  Briefcase,
  Code2,
  Cpu,
  Globe,
  MapPin,
  Calendar,
} from 'lucide-vue-next'
import type { ChartData, ChartOptions } from 'chart.js'

const { profile, loading, fetchProfile } = useProfile()
const { projects, initProjectsListener } = useProjects()

onMounted(() => {
  fetchProfile()
  initProjectsListener()
})

const techHighlights = computed(() => {
  // 預設
  const defaultFrontend = ['Vue 3, TypeScript, Vite, Tailwind CSS']
  const defaultBackend = ['Firebase, Vercel, Git']

  if (projects.value.length === 0) {
    return [
      {
        label: 'Tech Stack',
        tags: defaultFrontend,
        icon: Cpu,
        color: 'text-indigo-500',
        bg: 'bg-indigo-50 dark:bg-indigo-500/10',
        tagBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
      },
      {
        label: 'Deployment & Tools',
        tags: defaultBackend,
        icon: Globe,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        tagBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
      },
    ]
  }

  // --- 輔助函式：提取並去重 ---
  const getUniqueTags = (fields: (keyof Project)[]) => {
    const tags = new Set<string>()
    projects.value.forEach((p) => {
      fields.forEach((key) => {
        const val = p[key]
        if (typeof val === 'string' && val) {
          val.split(/[,、]/).forEach((t) => {
            const cleanTag = t.trim()
            if (cleanTag) tags.add(cleanTag)
          })
        }
      })
    })
    return Array.from(tags)
  }

  const frontendTags = getUniqueTags(['techFrontend', 'techCore'])

  const backendTags = getUniqueTags(['techDeployment', 'techDatabase'])

  return [
    {
      label: 'Tech Stack',
      tags: frontendTags.length ? frontendTags : defaultFrontend, // 使用陣列
      icon: Cpu,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      tagBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    },
    {
      label: 'Deployment & Tools',
      tags: backendTags.length ? backendTags : defaultBackend,
      icon: Globe,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      tagBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    },
  ]
})

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/Wanhsuan98',
    icon: Github,
    hoverClass: 'hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: Linkedin,
    hoverClass: 'hover:bg-[#0077b5] hover:text-white',
  },
  {
    name: 'Email',
    url: 'mailto:wanhsuan98@gmail.com',
    icon: Mail,
    hoverClass: 'hover:bg-red-400 hover:text-white',
  },
]

// --- 圖表設定 ---
const skillData = computed<ChartData<'radar'> | null>(() => {
  if (!profile.value || !profile.value.skills) return null

  return {
    labels: profile.value.skills.map((s) => s.label),
    datasets: [
      {
        label: '能力評分',
        data: profile.value.skills.map((s) => s.value),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366f1',
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1',
        borderWidth: 2,
      },
    ],
  }
})

const skillOptions: ChartOptions<'radar'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: { display: true, color: 'rgba(148, 163, 184, 0.1)' },
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
      suggestedMin: 0,
      suggestedMax: 100,
      ticks: { display: false },
      pointLabels: {
        font: { size: 12, weight: 'bold', family: "'Inter', sans-serif" },
        color: '#94a3b8', // slate-400
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      cornerRadius: 8,
      titleColor: '#fff',
      bodyColor: '#cbd5e1',
    },
  },
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
    <AppHeader />

    <div class="pt-2 pb-16">
      <div class="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <BaseLoading v-if="loading" message="正在從 Firebase 載入個人資料..." />

        <template v-else-if="profile">
          <section id="about" class="layout-about-top">
            <div class="relative group">
              <img src="/public/avatar.jpg" class="avatar-about" alt="Avatar" />
            </div>
            <div class="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 class="page-title">
                  {{ profile.basicInfo.name }}
                </h1>
                <p class="title-about">
                  {{ profile.basicInfo.title }}
                </p>
              </div>

              <p class="page-subtitle">
                {{ profile.basicInfo.bio }}
              </p>

              <div class="social-links-container">
                <a
                  v-for="link in socialLinks"
                  :key="link.name"
                  :href="link.url"
                  target="_blank"
                  class="social-links-items group"
                  :class="link.hoverClass"
                >
                  <component
                    :is="link.icon"
                    class="w-4 h-4 transition-transform group-hover:scale-110"
                  />
                  {{ link.name }}
                </a>
              </div>
            </div>
          </section>

          <div class="layout-about-bottom">
            <section id="skills" class="skills-exp-section flex flex-col">
              <div class="skille-exp-title-outter">
                <div
                  class="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400"
                >
                  <Code2 class="w-6 h-6" />
                </div>
                <h2 class="skills-exp-title font-bold">核心技能</h2>
              </div>

              <div class="flex-1 min-h-[300px] relative">
                <BaseRadarChart
                  v-if="skillData"
                  :chart-data="skillData"
                  :chart-options="skillOptions"
                />
              </div>

              <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="(tech, idx) in techHighlights" :key="idx" class="skille-bottom-outter">
                  <div
                    class="p-2.5 rounded-lg shadow-sm bg-white dark:bg-slate-800"
                    :class="tech.color"
                  >
                    <component :is="tech.icon" class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="tech-category-label mb-2">
                      {{ tech.label }}
                    </p>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="tag in tech.tags"
                        :key="tag"
                        class="px-2.5 py-1 text-xs font-medium rounded-md transition-colors"
                        :class="tech.tagBg"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="experience" class="skills-exp-section">
              <div class="skille-exp-title-outter">
                <div
                  class="p-2 bg-pink-50 dark:bg-pink-500/10 rounded-lg text-pink-600 dark:text-pink-400"
                >
                  <Briefcase class="w-6 h-6" />
                </div>
                <h2 class="skills-exp-title font-bold">經歷旅程</h2>
              </div>

              <div class="relative pl-2 space-y-8">
                <div
                  class="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700"
                ></div>

                <div
                  v-for="(item, index) in profile.experiences"
                  :key="index"
                  class="relative pl-10 group"
                >
                  <div class="absolute left-0 top-1.5 w-[40px] flex justify-center">
                    <div class="exp-dot"></div>
                  </div>

                  <div class="space-y-2">
                    <div class="exp-date">
                      <Calendar class="w-3 h-3" />
                      {{ item.date }}
                    </div>

                    <div>
                      <h3 class="skills-exp-title">
                        {{ item.title }}
                      </h3>
                      <div class="text-meta flex items-center gap-1 m-1.5">
                        <MapPin class="w-3.5 h-3.5" />
                        {{ item.company }}
                      </div>
                    </div>

                    <p class="exp-desc">
                      {{ item.desc }}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </template>
        <p v-else class="text-error">無法載入個人資料，請確認 Firebase 資料。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-mt-28 {
  scroll-margin-top: 7rem;
}
</style>
