# MarTech Project Showcase 🚀

這是一個集成了現代化前端技術與 MarTech 應用場景的展示平台。
本專案不僅是一個作品集 Dashboard，更包含了一個完整的 **OMO (Online Merge Offline) LINE 數位簽到系統** 實作，展現了從行動端互動到後台即時監控的完整閉環。

## 🌟 專案亮點 (Key Features)

### 1. LINE 數位簽到系統 (Live Check-in System)
整合 **LINE LIFF** 與 **Firebase Realtime** 技術，實現「零下載、即時同步」的活動體驗。
- **行動端 (User)**：透過 LINE 掃碼即可開啟 LIFF 頁面，自動獲取使用者 Profile 並完成簽到。
- **管理端 (Admin)**：後台「活動監控」頁面透過 WebSocket (Firestore Snapshot) 即時跳出新簽到者資訊，無需重新整理。
- **即時回饋**：介面設有即時呼吸燈號 (Live Indicator)，強化即時互動感。

### 2. 專業級後台管理 (Admin Dashboard)
- **響應式側邊欄 (Responsive Sidebar)**：
  - 針對電腦版與手機版實作不同的收合邏輯。
  - 電腦版採用「推擠式」佈局，保留最大操作空間；手機版採用「覆蓋式」遮罩，符合行動操作直覺。
- **資料視覺化**：整合 **Chart.js** 展示專案狀態分佈統計。
- **CRUD 管理**：完整的專案新增、編輯、刪除流程，並支援圖片連結預覽。

### 3. 架構與工程化 (Architecture & Engineering)
- **關注點分離 (Separation of Concerns)**：將 Firebase 資料獲取邏輯抽離至 `composables` (e.g., `useProjects`)，讓 View 層專注於 UI 渲染。
- **強型別安全 (Type Safety)**：全面導入 TypeScript Interface，並針對技術棧欄位進行細分 (Frontend, Database, Deployment, Key Packages)，確保資料結構嚴謹。
- **效能優化 (Performance)**：針對 Sidebar 動畫使用 `will-change-transform` 與獨立合成層，並限制 CSS Transition 屬性，確保 60fps 的流暢體驗。

## 🛠 技術棧 (Tech Stack)

### Frontend Core
- **Vue 3**: Composition API, Script Setup
- **TypeScript**: Strict Typing
- **Vite**: Next Generation Frontend Tooling

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Vue Next**: Modern & consistent icon set
- **Chart.js**: Flexible charting library for data visualization

### Backend & Services
- **Firebase**: Authentication, Firestore Database
- **LINE LIFF SDK**: Ver. 2 integration for LINE Login

## 📂 專案架構 (Project Structure)

```bash
src/
├── assets/          # 靜態資源與全域樣式 (main.css - 採用 Component-based 樣式管理)
├── components/      # 共用元件 (BaseTable, BaseModal, StatusBadge...)
├── composables/     # 邏輯複用 (useProjects, useActivity...)
├── layouts/         # 佈局元件 (DashboardLayout - 處理響應式與側邊欄邏輯)
├── stores/          # 狀態管理 (Auth, Toast, Liff)
├── types/           # TypeScript 型別定義 (Project, Column...)
├── views/           # 頁面元件
│   ├── HomeView.vue         # 儀表板首頁 (資料概覽)
│   ├── ActivityView.vue     # 活動監控 (MarTech 實驗室)
│   ├── ProjectDetailsView.vue # 專案詳情 (結構化技術欄位展示)
│   └── LiffView.vue         # LINE 簽到前端
└── firebase.ts      # Firebase 初始化設定
```

## 快速開始 (Getting Started)

### 1. 安裝依賴 (Project Setup)

```sh
npm install
```

### 2. 設定環境變數 (Environment Variables)

#### 請在根目錄建立 .env 檔案，並填入您的 Firebase 與 LINE LIFF 設定：

```sh
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_LIFF_ID=your_liff_id
```

### 3. 啟動開發伺服器 (Compile and Hot-Reload for Development)

```sh
npm run dev
```

### 4. 建置生產版本 (Type-Check, Compile and Minify for Production)

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Author

Jenny (WanHsuan) Frontend Developer

### Deployed on Vercel