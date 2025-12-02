/**
 * Firebase 設定
 */
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyC7GUS-q_5y4RGKtvje16FZdmQhvWZ0dbs',
  authDomain: 'martech-line-crm.firebaseapp.com',
  projectId: 'martech-line-crm',
  storageBucket: 'martech-line-crm.firebasestorage.app',
  messagingSenderId: '382795265020',
  appId: '1:382795265020:web:cc4dbd594224c8e8423879',
}

// 1. 初始化 Firebase App
const app = initializeApp(firebaseConfig)

// 2. 取得 Firestore 資料庫實體
const db = getFirestore(app)

// 3. 匯出 db 讓其他檔案使用
export { db }
