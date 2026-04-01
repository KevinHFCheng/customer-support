# 客戶需求與問題登記系統 (Customer Support Portal)

這是一個專為客戶技術諮詢與產品規格需求設計的網頁系統。開發目標是透過自動化流程，將客戶提交的需求存入 Google Sheets 進行管理，並提供即時 AI 智能客服。

---

## 🚀 系統功能與特點

- **線上表單登記**：提供直觀的介面供客戶填寫公司資訊、聯絡窗口及詳細問題描述。
- **Google Sheets 整合**：利用 Google Apps Script (GAS) 將提交的表單內容自動存入指定的 Google 試算表。
- **AI 智能客服**：整合 Gemini AI 透過 RAG (檢索增強生成) 提供即時的規格與技術諮詢。
- **現代化設計**：基於毛玻璃效果 (Glassmorphism) 的極簡科技感介面，完全回應式設計支援行動裝置。
- **自動化部署**：透過 GitHub Actions 實現靜態網站的自動部署 (GitHub Pages)。

---

## 🛠️ 技術架構 (Tech Stack)

### 前端 (Frontend)
- **HTML5 / CSS3**：自訂 Vanilla CSS 樣式與系統架構。
- **JavaScript (Vanilla)**：處理表單提交、彈窗邏輯與 Fetch API 與後端交互。
- **Google Fonts**：使用 *Barlow* 與 *Noto Sans TC* 達成中英文和諧排版。

### 後端與資源 (Backend & Resources)
- **Google Apps Script (GAS)**：充當中間層 API，處理 POST 客戶資料與 GET AI 諮詢。
- **Google Sheets**：作為主資料庫儲存所有客戶案件。
- **Gemini 1.5 Flash API**：提供聊天室底層 AI 邏輯。

---

## ⚙️ 開發與部署指南

### 1. Google Apps Script 部署 (後端)
1. 建立一個新的 Google 試算表，並記下 `Sheet ID`。
2. 進入「擴充功能」 -> 「Apps Script」：
   - 實作 `doPost(e)` 用於接收與寫入表單數據。
   - 實作 `doGet(e)` 用於調用 Gemini API 回應聊天請求。
3. 部署為「Web 應用程式」，存取權限設為「所有人」。
4. 取得「部署網址 (Web App URL)」。

### 2. 本地開發設定
1. 在 `script.js` 中，將 `GAS_WEB_APP_URL` 佔位符替換為您的部署網址（或使用 CI/CD Secrets 注入）。
2. 在本地啟動靜態伺服器 (如 Live Server) 進行調試。

### 3. GitHub Actions & Pages 部署
1. 前往 GitHub Repo -> Settings -> Secrets and variables -> Actions。
2. 新增以下 Secrets：
   - `GAS_WEB_APP_URL`：上一步取得的 GAS 部署網址。
   - `GEMINI_API_KEY`：Google AI Studio 獲取的 API 金鑰。
3. 每次 `push` 到 `main` 分支時，GitHub Actions 會自動將 `script.js` 中的佔位符替換為 Secrets 值並部署。

---

## 📂 專案目錄結構

- `index.html`：網頁架構、SEO 標籤與組件容器。
- `style.css`：設計系統、自訂 CSS 變數與動畫。
- `script.js`：核心邏輯處理、GAS API 串接。
- `.github/workflows/deploy.yml`：GitHub Actions 自動化部署流程設定。

---

## 📝 備註事項

- 請確保 GAS 的部署權限設定正確，否則可能會導致 CORS 錯誤或無法存取。
- 表單圖片連結功能建議搭配 Google Drive 分享連結或第三方圖床使用。

---
*Developed by Kevin Cheng*