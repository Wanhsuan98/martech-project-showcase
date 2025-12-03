import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth, db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from 'firebase/auth'
import { useRouter } from 'vue-router'

// 登入角色型別
export type UserRole = 'admin' | 'observer' | 'user'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const role = ref<UserRole | null>(null)
  const isAuthReady = ref(false)
  const router = useRouter()

  const fetchUserRole = async (email: string) => {
    try {
      const docRef = doc(db, 'users', email)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        role.value = docSnap.data().role as UserRole
      } else {
        role.value = 'user'
      }
      console.log(`權限載入完成: ${email} -> ${role.value}`)
    } catch (error) {
      console.error('獲取使用者權限失敗:', error)
      role.value = 'user'
    }
  }

  // 監聽登入狀態變化
  const initAuth = () => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        user.value = currentUser
        if (currentUser.email) {
          await fetchUserRole(currentUser.email)
        }
      } else {
        user.value = null
        role.value = null // 登出時清空權限
      }
      isAuthReady.value = true
    })
  }

  // 登入功能
  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass)
    } catch (error: unknown) {
      console.error('登入失敗:', error)
      throw new Error('帳號或密碼錯誤')
    }
  }

  // 3. 登出功能
  const logout = async () => {
    await signOut(auth)
    user.value = null
    role.value = null
    router.push('/login')
  }

  const isAdmin = computed(() => role.value === 'admin')
  const isObserver = computed(() => role.value === 'observer')

  return {
    user,
    role,
    isAdmin,
    isObserver,
    isAuthReady,
    initAuth,
    login,
    logout,
  }
})
