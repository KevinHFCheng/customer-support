# 客戶需求與問題登記系統 (Customer Support Portal)

這是一個專為客戶技術諮詢與產品規格需求設計的網頁系統。開發目標是透過自動化流程，將客戶提交的需求存入 Google Sheets 進行管理，並提供即時 AI 智能客服。

---

## 🚀 系統功能與特點

- **線上表單登記**：提供直觀的介面供客戶填寫公司資訊、聯絡窗口及詳細問題描述。
- **直接圖片上傳**：支援圖片檔案直接上傳，系統會自動在 Google Drive 建立案件專屬資料夾並儲存。
- **Google Sheets 整合**：利用 Google Apps Script (GAS) 將提交的表單內容與附件連結自動存入指定的 Google 試算表。
- **自動郵件通知**：當表單提交成功後，系統會自動寄出包含附件內容的通知信至管理員信箱，標題包含案件編號。
- **AI 智能客服**：整合 Gemini AI 透過 RAG (檢索增強生成) 提供即時的規格與技術諮詢，並具備自動修復機制與快取優化。
- **安全防護機制**：後端實作 LockService 防止併發編號重複，並具備 Sanitize 機制過濾 HTML 注入攻擊。
- **現代化設計**：基於毛玻璃效果 (Glassmorphism) 的極簡科技感介面，支援行動裝置與暗色模式視覺優化。
- **自動化部署**：透過 GitHub Actions 實現靜態網站的自動部署 (GitHub Pages)。

---

## 🛠️ 技術架構 (Tech Stack)

### 前端 (Frontend)
- **HTML5 / CSS3**：自訂 Vanilla CSS 樣式與系統架構，使用 CSS Variables 管理品牌色與設計權限。
- **JavaScript (Vanilla)**：處理表單提交、圖片轉 Base64 編碼、彈窗邏輯與 Fetch API 與後端交互。
- **Google Fonts**：使用 *Barlow* 與 *Noto Sans TC* 達成中英文和諧排版。

### 後端與資源 (Backend & Resources)
- **Google Apps Script (GAS)**：充當中間層 API，處理資料寫入、Drive 資料夾建立與檔案上傳。
- **Google Sheets**：作為主資料庫儲存所有客戶案件。
- **Google Drive**：用於存放每個案件專屬的子資料夾與客戶上傳的截圖檔案。
- **Gemini 1.5 Flash API**：提供聊天室底層 AI 邏輯。

---

## ⚙️ 開發與部署指南

### 1. Google Apps Script 部署 (後端)
1. 建立一個新的 Google 試算表，並記下 `Sheet ID`。
2. 建立一個 Google Drive 資料夾作為存放附件的母資料夾，記下 `Folder ID`。
3. 進入「擴充功能」 -> 「Apps Script」：
   - 實作 `doPost(e)` 用於接收 Base64 數據、建立子資料夾並寫入試算表。
   - 實作 `doGet(e)` 用於調用 Gemini API 回應聊天請求。
4. **部署設定**：
   - 部署為「Web 應用程式」。
   - **執行身分**：選「Me」。
   - **存取權限**：選「Anyone」。
5. 取得「部署網址 (Web App URL)」。

### 2. 本地開發設定
1. 在 `script.js` 中，將 `GAS_WEB_APP_URL` 佔位符替換為您的部署網址（或使用 CI/CD Secrets 注入）。
2. 在本地啟動靜態伺服器 (如 Live Server) 進行調試。

### 3. GitHub Actions & Pages 部署
1. 前往 GitHub Repo -> Settings -> Secrets and variables -> Actions。
2. 新增以下 Secrets：
   - `GAS_WEB_APP_URL`：上一步取得的 GAS 部署網址。
3. 每次 `push` 到 `main` 分支時，GitHub Actions 會自動將 `script.js` 中的佔位符替換為 Secrets 值並部署。

---

## 📂 專案目錄結構

- `index.html`：網頁架構、SEO 標籤與組件容器。
- `style.css`：設計系統、CSS 變數、毛玻璃效果與動畫。
- `script.js`：核心邏輯處理 (包含圖片轉 Base64 邏輯)、GAS API 串接。
- `.github/workflows/deploy.yml`：GitHub Actions 自動化部署流程設定。

---

## 📝 安全與權限備註

- **圖片上傳**：圖片會先在前端編碼為 Base64 字串後發送，建議單次上傳檔案大小控制在 10MB 以內以確保傳輸穩定。
- **雲端權限**：母資料夾建議設為限制 (Restricted)，僅內部團隊可存取。GAS 腳本會自動處理對外接收與寫入權利。

---
*Developed by Kevin Cheng*