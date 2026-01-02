import { ref } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import type { ProfileData } from '@/types/profile'

export function useProfile() {
  const profile = ref<ProfileData | null>(null)
  const loading = ref(true)

  const fetchProfile = async () => {
    loading.value = true
    try {
      const docRef = doc(db, 'profiles', 'aboutme')
      const snap = await getDoc(docRef)

      if (snap.exists()) {
        const data = snap.data()
        profile.value = data as ProfileData
      } else {
        console.error('找不到個人資料文件')
      }
    } catch (err) {
      console.error('讀取 Profile 失敗:', err)
    } finally {
      loading.value = false
    }
  }

  return { profile, loading, fetchProfile }
}
