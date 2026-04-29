/**
 * 設定 Google Apps Script (GAS) 的部署網址 (v1.1 - 支援檔案上傳功能)
 * 該網址用於接收表單數據並處理 AI 聊天請求
 */
const GAS_WEB_APP_URL = "THE_GAS_URL_PLACEHOLDER";

/**
 * --- 多國語言設定 (i18n) ---
 */
const i18n = {
    'zh-TW': {
        pageTitle: '客戶需求與問題登記',
        pageSubtitle: '請填寫以下資訊，我們將儘速為您處理',
        labelCompany: '公司名稱',
        placeholderCompany: '請輸入您的公司名稱',
        labelContact: '客戶窗口',
        placeholderContact: '聯絡人姓名',
        labelEmail: '聯繫郵件',
        labelSNSType: '社群軟體類型',
        labelSNSID: '通訊帳號 (ID)',
        placeholderSNSID: '請輸入帳號 ID',
        labelProduct: '產品型號',
        labelSN: '產品序號 (S/N)',
        placeholderSN: '請輸入序號後五碼',
        labelType: '需求類型',
        optDefault: '請選擇類型',
        optSpec: '產品規格與選型',
        optTech: '技術諮詢',
        labelDesc: '問題描述',
        placeholderDesc: '請詳細描述您的需求或遇到的問題...',
        labelUpload: '附件上傳 (可以上傳文件或圖檔，最多 5 個附件)',
        uploadHint: '您可以選取多個附件進行上報，檔案將自動存入雲端案件資料夾',
        btnSubmit: '提交需求',
        chatTitle: 'AI 智能客服',
        chatWelcome: '您好！我是您的智能助手。有任何關於技術規格或 FAQ 的問題都可以問我喔！',
        chatPlaceholder: '請輸入問題...',
        chatSend: '傳送',
        alertExceedLimit: '抱歉，每次提交最多僅限 5 個附件喔！',
        btnSubmitting: '提交中...',
        submitSuccess: '需求提交成功！報告編號：',
        submitFail: '發生系統錯誤：',
        modalTitle: '系統提示',
        btnOk: '確定',
        btnSpecLink: '波長範圍與解析度',
        specTitle: '波長範圍與解析度',
        specSubtitle: '請輸入產品型號以查詢對應的感測器資訊',
        labelModel: '1. 產品型號',
        labelStartW: '2. 起始波長 (nm)',
        labelEndW: '3. 結束波長 (nm)',
        labelReso: '4. 光學分辨率需求 (nm)',
        phModel: '例如: SE2030',
        phWave: '例如: 200',
        phReso: '例如: 1.0',
        btnSearch: '搜尋',
        resHeader: '🔍 感測器查詢結果',
        resModelCode: '機型代碼',
        resSensorCode: '感測器代碼',
        resSensorInfo: '感測器資訊',
        resSheetLoc: '試算表定位',
        btnBackHome: '返回主頁',
        specLoading: '正在搜尋中，請稍候...'
    },
    'zh-CN': {
        pageTitle: '客户需求与问题登记',
        pageSubtitle: '请填写以下信息，我们将儘速为您处理',
        labelCompany: '公司名称',
        placeholderCompany: '请输入您的公司名称',
        labelContact: '客户窗口',
        placeholderContact: '联系人姓名',
        labelEmail: '联系邮件',
        labelSNSType: '社交平台类型',
        labelSNSID: '通讯账号 (ID)',
        placeholderSNSID: '请输入账号 ID',
        labelProduct: '产品型号',
        labelSN: '产品序号 (S/N)',
        placeholderSN: '请输入序号后五码',
        labelType: '需求类型',
        optDefault: '请选择类型',
        optSpec: '产品规格与选型',
        optTech: '技术咨询',
        labelDesc: '问题描述',
        placeholderDesc: '请详细描述您的需求或遇到的问题...',
        labelUpload: '附件上传 (可以上传文件或图档，最多 5 個附件)',
        uploadHint: '您可以选取多个附件进行上報，文件將自动存入云端案件文件夹',
        btnSubmit: '提交需求',
        chatTitle: 'AI 智能客服',
        chatWelcome: '您好！我是您的智能助手。有任何关于技术规格或 FAQ 的问题都可以問我喔！',
        chatPlaceholder: '请输入问题...',
        chatSend: '发送',
        alertExceedLimit: '抱歉，每次提交最多仅限 5 個附件喔！',
        btnSubmitting: '提交中...',
        submitSuccess: '需求提交成功！报告编号：',
        submitFail: '发生系统错误：',
        modalTitle: '系统提示',
        btnOk: '确定',
        btnSpecLink: '波长范围与解析度',
        specTitle: '波长范围与解析度',
        specSubtitle: '请输入产品型号以查询对应的感測器信息',
        labelModel: '1. 产品型号',
        labelStartW: '2. 起始波长 (nm)',
        labelEndW: '3. 结束波长 (nm)',
        labelReso: '4. 光学分辨率需求 (nm)',
        phModel: '例如: SE2030',
        phWave: '例如: 200',
        phReso: '例如: 1.0',
        btnSearch: '搜尋',
        resHeader: '🔍 感测器查询结果',
        resModelCode: '机型代码',
        resSensorCode: '感测器代码',
        resSensorInfo: '感测器信息',
        resSheetLoc: '试算表定位',
        btnBackHome: '返回主页',
        specLoading: '正在搜尋中，請稍候...'
    },
    'en': {
        pageTitle: 'Customer Requirement & Issue Log',
        pageSubtitle: 'Please fill in the information below, we will handle it as soon as possible.',
        labelCompany: 'Company Name',
        placeholderCompany: 'Enter your company name',
        labelContact: 'Contact Person',
        placeholderContact: 'Your name',
        labelEmail: 'Email Address',
        labelSNSType: 'Social Platform',
        labelSNSID: 'Account ID',
        placeholderSNSID: 'Enter your ID',
        labelProduct: 'Product Model',
        labelSN: 'Serial Number (S/N)',
        placeholderSN: 'Last 5 digits of SN',
        labelType: 'Inquiry Type',
        optDefault: 'Select type',
        optSpec: 'Specs & Selection',
        optTech: 'Technical Inquiry',
        labelDesc: 'Description',
        placeholderDesc: 'Please describe your requirement or issue in detail...',
        labelUpload: 'Upload Attachments (Documents or images, max 5)',
        uploadHint: 'You can select multiple attachments. Files will be saved to your case folder.',
        btnSubmit: 'Submit Request',
        chatTitle: 'AI Support',
        chatWelcome: 'Hello! I am your AI assistant. Ask me anything about specs or FAQ!',
        chatPlaceholder: 'Type your question...',
        chatSend: 'Send',
        alertExceedLimit: 'Sorry, max 5 attachments per submission!',
        btnSubmitting: 'Submitting...',
        submitSuccess: 'Form submitted successfully! ID: ',
        submitFail: 'System Error: ',
        modalTitle: 'System Alert',
        btnOk: 'OK',
        btnSpecLink: 'Range & Resolution',
        specTitle: 'Range & Resolution',
        specSubtitle: 'Please enter product model to search for sensor info',
        labelModel: '1. Product Model',
        labelStartW: '2. Start Wavelength (nm)',
        labelEndW: '3. End Wavelength (nm)',
        labelReso: '4. Resolution Req (nm)',
        phModel: 'e.g. SE2030',
        phWave: 'e.g. 200',
        phReso: 'e.g. 1.0',
        btnSearch: 'Search',
        resHeader: '🔍 Sensor Search Result',
        resModelCode: 'Model Code',
        resSensorCode: 'Sensor Code',
        resSensorInfo: 'Sensor Info',
        resSheetLoc: 'Sheet Location',
        btnBackHome: 'Back to Home',
        specLoading: 'Searching, please wait...'
    }
};

let currentLang = 'zh-TW';
let selectedFiles = []; // 用於存放準備提交的檔案物件 [{name, data}, ...]

/**
 * 切換語系函式
 */
function setLanguage(lang) {
    currentLang = lang;
    
    // 更新所有具有 data-i18n 屬性的元素文字
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang][key]) {
            el.innerHTML = i18n[lang][key];
        }
    });

    // 更新 Placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (i18n[lang][key]) {
            el.placeholder = i18n[lang][key];
        }
    });

    // 動態更新前往 spec.html 的連結，帶上語系參數
    const specLink = document.getElementById('btn-spec-link');
    if (specLink) {
        specLink.href = `spec.html?lang=${lang}`;
    }

    // 切換按鈕激活狀態
    document.querySelectorAll('.oto-lang-btn').forEach(btn => btn.classList.remove('active'));
    if (lang === 'zh-TW' && document.getElementById('lang-zh-tw')) document.getElementById('lang-zh-tw').classList.add('active');
    if (lang === 'zh-CN' && document.getElementById('lang-zh-cn')) document.getElementById('lang-zh-cn').classList.add('active');
    if (lang === 'en' && document.getElementById('lang-en')) document.getElementById('lang-en').classList.add('active');
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    // 優先檢查 URL 參數中的 lang
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    if (urlLang && i18n[urlLang]) {
        setLanguage(urlLang);
    } else {
        // 若無參數，則根據瀏覽器語系自動偵測
        const userLang = navigator.language || navigator.userLanguage;
        let lang = 'en';
        if (userLang.includes('zh-TW') || userLang.includes('zh-HK')) lang = 'zh-TW';
        else if (userLang.includes('zh')) lang = 'zh-CN';
        setLanguage(lang);
    }
});

// 獲取 DOM 元素
const regForm = document.getElementById('registrationForm');
const aiChatWidget = document.getElementById('ai-chat-widget');
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');
const chatBody = document.getElementById('chat-body');
const imagePreview = document.getElementById('image-preview');

/**
 * 處理檔案選取與預覽
 */
const imageFilesInput = document.getElementById('imageFiles');
if (imageFilesInput) {
    imageFilesInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);

        // 檢查加上新檔案後是否超過 5 張
        if (selectedFiles.length + files.length > 5) {
            showAlert(i18n[currentLang].alertExceedLimit);
            e.target.value = ''; // 清空 input 以便下次觸發
            return;
        }

        // 轉換為 Base64 並存入陣列
        for (const file of files) {
            const fileObj = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (ev) => resolve({ name: file.name, data: ev.target.result });
                reader.readAsDataURL(file);
            });
            selectedFiles.push(fileObj);
        }

        e.target.value = ''; // 重置 input
        renderPreviews();
    });
}

/**
 * 渲染圖片預覽網格
 */
function renderPreviews() {
    if (!imagePreview) return;
    imagePreview.innerHTML = '';
    selectedFiles.forEach((file, index) => {
        const div = document.createElement('div');
        div.className = 'preview-item';
        
        // 如果是圖檔則顯示縮圖，否則顯示檔案圖示
        if (file.data.startsWith('data:image')) {
            div.innerHTML = `<img src="${file.data}" alt="preview">`;
        } else {
            div.innerHTML = `<div style="height:100%; display:flex; align-items:center; justify-content:center; color:#666;">📄</div>`;
        }

        // 刪除按鈕
        const removeBtn = document.createElement('div');
        removeBtn.className = 'remove-file';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => {
            selectedFiles.splice(index, 1);
            renderPreviews();
        };

        div.appendChild(removeBtn);
        imagePreview.appendChild(div);
    });
}

/**
 * 表單提交邏輯
 */
if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const loading = document.getElementById('loading');
        loading.classList.remove('hidden');

        // 收集表單數據
        const formData = {
            companyName: document.getElementById('companyName').value,
            clientContact: document.getElementById('clientContact').value,
            email: document.getElementById('email').value,
            snsAccount: document.getElementById('snsAccount').value,
            productModel: document.getElementById('productModel').value,
            serialNumber: document.getElementById('serialNumber').value,
            reqType: document.getElementById('reqType').value,
            description: document.getElementById('description').value,
            files: selectedFiles
        };

        try {
            const response = await fetch(GAS_WEB_APP_URL, {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            loading.classList.add('hidden');

            if (result.result === 'success') {
                showAlert(i18n[currentLang].alertSuccess + result.id);
                regForm.reset();
                selectedFiles = [];
                renderPreviews();
            } else {
                showAlert(i18n[currentLang].alertError);
            }
        } catch (error) {
            console.error('Submission Error:', error);
            loading.classList.add('hidden');
            showAlert(i18n[currentLang].alertError);
        }
    });
}

/**
 * 專業彈窗邏輯
 */
function showAlert(message) {
    const modal = document.getElementById('custom-modal');
    const modalMsg = document.getElementById('modal-message');
    modalMsg.innerText = message;
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('custom-modal');
    modal.style.display = 'none';
}

// 獲取開啟按鈕
const chatToggleBtn = document.getElementById('chat-toggle-btn');

// 點擊右下角 💬 按鈕開啟/關閉
if (chatToggleBtn && aiChatWidget) {
    chatToggleBtn.onclick = () => {
        aiChatWidget.classList.toggle('chat-closed');
    };
}

// 點擊聊天視窗內部的關閉按鈕 (X)
const closeChatBtn = document.getElementById('close-chat');
if (closeChatBtn && aiChatWidget) {
    closeChatBtn.onclick = (e) => {
        e.stopPropagation();
        aiChatWidget.classList.add('chat-closed');
    };
}

// 傳送訊息邏輯
const handleChatSubmit = async () => {
    const query = chatInput ? chatInput.value.trim() : "";
    if (!query) return;

    addMessage(query, 'user');
    if (chatInput) chatInput.value = '';

    try {
        // 發送請求到 GAS，帶上當前語系
        const response = await fetch(`${GAS_WEB_APP_URL}?q=${encodeURIComponent(query)}&lang=${currentLang}`);
        const result = await response.json();
        addMessage(result.answer, 'bot');
    } catch (err) {
        console.error('Chat Error:', err);
        addMessage(currentLang === 'en' ? 'Service currently unavailable.' : '抱歉，暫時無法回覆。', 'bot');
    }
};

// 點擊傳送按鈕
if (sendChat) {
    sendChat.onclick = handleChatSubmit;
}

// 支援在輸入框按 Enter 鍵傳送
if (chatInput) {
    chatInput.onkeypress = (e) => {
        if (e.key === 'Enter') handleChatSubmit();
    };
}

function addMessage(text, sender) {
    if (!chatBody) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerText = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}
