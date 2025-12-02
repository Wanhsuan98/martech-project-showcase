import { defineStore } from 'pinia'
import liff from '@line/liff'
import { ref } from 'vue'

// User Profile 介面
interface LiffProfile {
  userId: string
  displayName: string
  pictureUrl?: string
  statusMessage?: string
}

export const useLiffStore = defineStore('liff', () => {
  // --- State  ---
  const profile = ref<LiffProfile | null>(null)
  const isInitialized = ref(false)
  const isLoggedIn = ref(false)
  const error = ref<string | null>(null)

  // --- Actions ---
  const initLiff = async () => {
    if (isInitialized.value) return

    try {
      await liff.init({ liffId: import.meta.env.VITE_LIFF_ID })

      isInitialized.value = true
      isLoggedIn.value = liff.isLoggedIn()

      if (isLoggedIn.value) {
        await fetchProfile()
      } else {
        // 如果是外部瀏覽器且未登入，這裡可以選擇是否自動跳轉登入頁
        // liff.login()
      }
    } catch (err: any) {
      console.error('LIFF 初始化失敗:', err)
      error.value = '無法連接 LINE 服務，請稍後再試。'
    }
  }

  // 取得使用者資料
  const fetchProfile = async () => {
    try {
      const user = await liff.getProfile()
      profile.value = {
        userId: user.userId,
        displayName: user.displayName,
        pictureUrl: user.pictureUrl,
        statusMessage: user.statusMessage,
      }
      console.log('LINE Profile:', profile.value)
    } catch (err) {
      console.error('取得個人資料失敗', err)
    }
  }

  // 登入功能
  const login = () => {
    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri: window.location.href })
    }
  }

  // 登出功能
  const logout = () => {
    liff.logout()
    isLoggedIn.value = false
    profile.value = null
    window.location.reload()
  }

  return {
    // State
    profile,
    isInitialized,
    isLoggedIn,
    error,
    // Actions
    initLiff,
    login,
    logout,
  }
})
