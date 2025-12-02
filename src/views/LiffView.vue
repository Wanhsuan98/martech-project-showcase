<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLiffStore } from '@/stores/liff'
import { db } from '@/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import liff from '@line/liff'

const liffStore = useLiffStore()
const isSigningIn = ref(false)
const isFinished = ref(false)

onMounted(() => {
  liffStore.initLiff()
})

const handleCheckIn = async () => {
  // 防止重複點擊
  if (isSigningIn.value) return

  isSigningIn.value = true

  try {
    // 1. 確保使用者已登入
    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri: window.location.href })
      return
    }

    // 2. 獲取使用者資料
    const profile = await liff.getProfile()

    // 3. 準備寫入資料
    const checkInData = {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl || '',
      checkInTime: serverTimestamp(),
      status: 'Checked In',
    }

    // 4. 寫入 Firebase
    await addDoc(collection(db, 'attendees'), checkInData)

    // 5. 更新 UI 狀態
    isFinished.value = true
    alert('簽到成功！資料已同步至後台 Dashboard')
  } catch (error: any) {
    console.error('簽到失敗:', error)
    alert('簽到發生錯誤，請稍後再試')
  } finally {
    isSigningIn.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
    <div v-if="!liffStore.isInitialized" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
      <p class="mt-4 text-gray-500">正在連接 LINE 服務...</p>
    </div>

    <div
      v-else-if="liffStore.isLoggedIn && liffStore.profile"
      class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center"
    >
      <img
        v-if="liffStore.profile.pictureUrl"
        :src="liffStore.profile.pictureUrl"
        alt="User Profile"
        class="w-24 h-24 rounded-full mx-auto border-4 border-green-100 mb-4"
      />
      <div
        v-else
        class="w-24 h-24 rounded-full mx-auto bg-gray-200 flex items-center justify-center mb-4 text-3xl"
      >
        👤
      </div>

      <h2 class="text-xl font-bold text-gray-800">{{ liffStore.profile.displayName }}</h2>
      <p class="text-sm text-gray-500 mt-1">歡迎來到活動報名系統</p>

      <div class="mt-8 space-y-3">
        <button
          @click="handleCheckIn"
          :disabled="isSigningIn || isFinished"
          class="w-full bg-green-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-green-600 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <span v-if="isSigningIn">處理中...</span>
          <span v-else-if="isFinished">✅ 已完成簽到</span>
          <span v-else>📝 立即簽到</span>
        </button>

        <button
          @click="liffStore.logout"
          class="w-full text-gray-400 text-sm hover:text-gray-600 underline"
        >
          登出
        </button>
      </div>
    </div>

    <div v-else class="text-center">
      <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">請先登入</h1>
        <p class="text-gray-500 mb-6 text-sm">需要登入 LINE 帳號才能進行報名</p>

        <button
          @click="liffStore.login"
          class="w-full bg-[#06C755] text-white py-3 rounded-xl font-bold shadow-md hover:bg-[#05b34c] transition flex items-center justify-center gap-2"
        >
          使用 LINE 登入
        </button>
      </div>
    </div>
  </div>
</template>
