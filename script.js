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
        labelSNS: 'Line / Wechat / WhatsApp',
        placeholderSNS: '社群軟體帳號',
        labelProduct: '產品型號',
        labelSN: '產品序號 (S/N)',
        placeholderSN: '請輸入序號後五碼',
        labelType: '需求類型',
        optDefault: '請選擇類型',
        optSpec: '產品規格與選型',
        optTech: '技術諮詢',
        labelDesc: '問題描述',
        placeholderDesc: '請詳細描述您的需求或遇到的問題...',
        labelUpload: '圖片/截圖上傳 (最多 5 張，支援 JPG/PNG)',
        uploadHint: '您可以選取多張圖片進行上報，檔案將自動存入雲端案件資料夾',
        btnSubmit: '提交需求',
        chatTitle: 'AI 智能客服',
        chatWelcome: '您好！我是您的智能助手。有任何關於技術規格或 FAQ 的問題都可以問我喔！',
        chatPlaceholder: '請輸入問題...',
        chatSend: '傳送',
        alertExceedLimit: '抱歉，每次提交最多僅限 5 張圖片附件喔！',
        btnSubmitting: '提交中...',
        submitSuccess: '需求提交成功！報告編號：',
        submitFail: '發生系統錯誤：'
    },
    'en': {
        pageTitle: 'Customer Requirement & Issue Log',
        pageSubtitle: 'Please fill in the information below, we will handle it as soon as possible.',
        labelCompany: 'Company Name',
        placeholderCompany: 'Enter your company name',
        labelContact: 'Contact Person',
        placeholderContact: 'Your name',
        labelEmail: 'Email Address',
        labelSNS: 'Social Media (Line/Wechat/WA)',
        placeholderSNS: 'Social account id',
        labelProduct: 'Product Model',
        labelSN: 'Serial Number (S/N)',
        placeholderSN: 'Last 5 digits of SN',
        labelType: 'Inquiry Type',
        optDefault: 'Select type',
        optSpec: 'Specs & Selection',
        optTech: 'Technical Inquiry',
        labelDesc: 'Description',
        placeholderDesc: 'Please describe your requirement or issue in detail...',
        labelUpload: 'Images Upload (Max 5, JPG/PNG supported)',
        uploadHint: 'You can select multiple images. Files will be saved to your case folder.',
        btnSubmit: 'Submit Request',
        chatTitle: 'AI Support',
        chatWelcome: 'Hello! I am your AI assistant. Ask me anything about specs or FAQ!',
        chatPlaceholder: 'Type your question...',
        chatSend: 'Send',
        alertExceedLimit: 'Sorry, max 5 images per submission!',
        btnSubmitting: 'Submitting...',
        submitSuccess: 'Form submitted successfully! ID: ',
        submitFail: 'System Error: '
    }
};

let currentLang = 'zh-TW';

/**
 * 切換語系函式
 */
function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang][key]) el.innerText = i18n[lang][key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (i18n[lang][key]) el.setAttribute('placeholder', i18n[lang][key]);
    });

    // 更新切換按鈕狀態
    document.getElementById('lang-zh').classList.toggle('active', lang === 'zh-TW');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
}

// 獲取 DOM 元素
const regForm = document.getElementById('registrationForm');
const chatToggle = document.getElementById('chat-toggle-btn');
const aiChatWidget = document.getElementById('ai-chat-widget');
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');
const chatBody = document.getElementById('chat-body');

/**
 * 1. 處理客戶需求表單提交
 * 使用監聽器處理 submit 事件，並以異步 fetch 發送到 GAS
 */
regForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // 阻止表單預設提交行為

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true; // 提交期間禁用按鈕，防止重複提交
    submitBtn.innerText = i18n[currentLang].btnSubmitting;

    // 獲取與驗證檔案
    const fileInput = regForm.imageFiles;
    let filesData = [];

    // 若選取檔案超過上限則阻斷提交
    if (fileInput.files.length > 5) {
        alert(i18n[currentLang].alertExceedLimit);
        submitBtn.disabled = false;
        submitBtn.innerText = i18n[currentLang].btnSubmit;
        return;
    }

    // 將所有選取的檔案轉換為 Base64 (使用 Promise.all 異步處理)
    if (fileInput.files.length > 0) {
        filesData = await Promise.all(Array.from(fileInput.files).map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve({
                    name: file.name,
                    data: e.target.result
                });
                reader.readAsDataURL(file);
            });
        }));
    }

    // 彙整表單數據
    const formData = {
        companyName: regForm.companyName.value,
        clientContact: regForm.clientContact.value,
        email: regForm.email.value,
        snsAccount: regForm.snsAccount.value,
        productModel: regForm.productModel.value,
        serialNumber: regForm.serialNumber.value,
        reqType: regForm.reqType.value,
        description: regForm.description.value,
        files: filesData // 傳送包含多個檔案物件的陣列
    };

    try {
        // 使用 POST 方法發送數據到 GAS
        const response = await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.result === 'success') {
            alert(i18n[currentLang].submitSuccess + result.id);
            regForm.reset(); // 提交成功後清空表單
        } else {
            alert(i18n[currentLang].submitFail + (result.message || 'Error'));
        }
    } catch (err) {
        console.error('Submission Error:', err);
        alert(i18n[currentLang].submitFail + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = i18n[currentLang].btnSubmit;
    }
});

/**
 * 2. AI 聊天室邏輯
 * 包含切換顯示、關閉視窗與發送訊息等功能
 */

// 切換聊天視窗顯示/隱藏
chatToggle.onclick = () => {
    const isVisible = aiChatWidget.style.display === 'flex';
    aiChatWidget.style.display = isVisible ? 'none' : 'flex';
};

// 點擊關閉按鈕隱藏視窗
document.getElementById('close-chat').onclick = () => aiChatWidget.style.display = 'none';

// 處理發送訊息邏輯
sendChat.onclick = async () => {
    const query = chatInput.value.trim();
    if (!query) return; // 若無輸入內容則不處理

    addMessage(query, 'user'); // 將使用者訊息加入視窗
    chatInput.value = ''; // 清空輸入框

    try {
        // 呼叫 GAS GET 接口進行 AI 諮詢處理
        const response = await fetch(`${GAS_WEB_APP_URL}?q=${encodeURIComponent(query)}&lang=${currentLang}`);
        const result = await response.json();
        addMessage(result.answer, 'bot'); // 顯示 AI 的回覆內容
    } catch (err) {
        console.error('Chat Error:', err);
        addMessage(currentLang === 'zh-TW' ? '抱歉，暫時無法回覆。' : 'Sorry, I cannot reply right now.', 'bot');
    }
};

/**
 * 輔助函式：將訊息加入聊天介面
 * @param {string} text - 訊息內容
 * @param {string} sender - 發送者類型 ('user' 或 'bot')
 */
function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerText = text;
    chatBody.appendChild(msgDiv);

    // 自動滾動到最底部以查看最新訊息
    chatBody.scrollTop = chatBody.scrollHeight;
}

/**
 * 網頁初始化：自動偵測語系
 */
window.addEventListener('DOMContentLoaded', () => {
    // 優先順序：瀏覽器語系 > 預設 (zh-TW)
    const userLang = navigator.language || navigator.userLanguage;
    const lang = userLang.includes('zh') ? 'zh-TW' : 'en';
    setLanguage(lang);
});
