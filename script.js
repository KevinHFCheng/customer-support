/**
 * 設定 Google Apps Script (GAS) 的部署網址 (v1.1 - 支援檔案上傳功能)
 * 該網址用於接收表單數據並處理 AI 聊天請求
 */
const GAS_WEB_APP_URL = "GAS_WEB_APP_URL";
//const GAS_WEB_APP_URL = 
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
        submitFail: '發生系統錯誤：',
        modalTitle: '系統提示',
        btnOk: '確定'
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
        labelUpload: '图片/截图上传 (最多 5 张，支持 JPG/PNG)',
        uploadHint: '您可以选取多张图片进行上报，文件將自动存入云端案件文件夹',
        btnSubmit: '提交需求',
        chatTitle: 'AI 智能客服',
        chatWelcome: '您好！我是您的智能助手。有任何关于技术规格或 FAQ 的问题都可以问我喔！',
        chatPlaceholder: '请输入问题...',
        chatSend: '发送',
        alertExceedLimit: '抱歉，每次提交最多仅限 5 张图片附件喔！',
        btnSubmitting: '提交中...',
        submitSuccess: '需求提交成功！报告编号：',
        submitFail: '发生系统错误：',
        modalTitle: '系统提示',
        btnOk: '确定'
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
        submitFail: 'System Error: ',
        modalTitle: 'System Alert',
        btnOk: 'OK'
    }
};

let currentLang = 'zh-TW';
let selectedFiles = []; // 用於存放準備提交的檔案物件 [{name, data}, ...]

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

    // 更新切換按鈕狀態 (配合 OtO 官網風格按鈕)
    document.querySelectorAll('.oto-lang-btn').forEach(btn => btn.classList.remove('active'));
    if (lang === 'zh-TW') document.getElementById('lang-zh-tw').classList.add('active');
    if (lang === 'zh-CN') document.getElementById('lang-zh-cn').classList.add('active');
    if (lang === 'en') document.getElementById('lang-en').classList.add('active');
}

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

/**
 * 處理檔案選取與預覽
 */
document.getElementById('imageFiles').addEventListener('change', async (e) => {
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

/**
 * 渲染圖片預覽網格
 */
function renderPreviews() {
    imagePreview.innerHTML = '';
    selectedFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'preview-item';

        item.innerHTML = `
            <img src="${file.data}" alt="${file.name}">
            <button type="button" class="remove-btn" onclick="removeFile(${index})">×</button>
        `;
        imagePreview.appendChild(item);
    });
}

/**
 * 刪除已選取檔案
 */
window.removeFile = (index) => {
    selectedFiles.splice(index, 1);
    renderPreviews();
};

/**
 * 1. 處理客戶需求表單提交
 */
regForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerText = i18n[currentLang].btnSubmitting;

    // 彙整表單數據
    const formData = {
        companyName: regForm.companyName.value,
        clientContact: regForm.clientContact.value,
        email: regForm.email.value,
        snsAccount: `${regForm.snsType.value}:${regForm.snsAccount.value}`,
        productModel: regForm.productModel.value,
        serialNumber: regForm.serialNumber.value,
        reqType: regForm.reqType.value,
        description: regForm.description.value,
        files: selectedFiles // 使用我們管理的陣列
    };

    try {
        const response = await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.result === 'success') {
            showAlert(i18n[currentLang].submitSuccess + result.id);
            regForm.reset();
            selectedFiles = []; // 清空檔案陣列
            renderPreviews();
        } else {
            showAlert(i18n[currentLang].submitFail + (result.message || 'Error'));
        }
    } catch (err) {
        showAlert(i18n[currentLang].submitFail + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = i18n[currentLang].btnSubmit;
    }
});

/**
 * 2. AI 聊天室邏輯
 */
// 獲取開啟按鈕
const chatToggleBtn = document.getElementById('chat-toggle-btn');

// 點擊右下角 💬 按鈕開啟/關閉
chatToggleBtn.onclick = () => {
    aiChatWidget.classList.toggle('chat-closed');
};

// 點擊聊天視窗內部的關閉按鈕 (X)
document.getElementById('close-chat').onclick = (e) => {
    e.stopPropagation();
    aiChatWidget.classList.add('chat-closed');
};

// 傳送訊息邏輯
const handleChatSubmit = async () => {
    const query = chatInput.value.trim();
    if (!query) return;

    addMessage(query, 'user');
    chatInput.value = '';

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
sendChat.onclick = handleChatSubmit;

// 支援在輸入框按 Enter 鍵傳送
chatInput.onkeypress = (e) => {
    if (e.key === 'Enter') handleChatSubmit();
};

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerText = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

window.addEventListener('DOMContentLoaded', () => {
    const userLang = navigator.language || navigator.userLanguage;
    let lang = 'en';
    if (userLang.includes('zh-TW') || userLang.includes('zh-HK')) lang = 'zh-TW';
    else if (userLang.includes('zh')) lang = 'zh-CN';
    setLanguage(lang);
});

/**
 * 自訂彈窗顯示控制
 */
function showAlert(message) {
    if (!message) return; // ✅ 增加防呆：無訊息則不顯示
    const modal = document.getElementById('custom-modal');
    const msgEl = document.getElementById('modal-message');
    msgEl.innerText = message;
    modal.style.display = 'flex'; // ✅ 使用直接 style 控制更穩定
}

function closeModal() {
    const modal = document.getElementById('custom-modal');
    modal.style.display = 'none'; // ✅ 隱藏
}
