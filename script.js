/**
 * 客戶需求與問題登記系統 - 主要邏輯腳本 (script.js)
 */

const GAS_WEB_APP_URL = "THE_GAS_URL_PLACEHOLDER";

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
        labelUpload: '附件上傳 (最多 5 個)',
        uploadHint: '檔案將自動存入雲端資料夾',
        btnSubmit: '提交需求',
        chatTitle: 'AI 智能客服',
        chatWelcome: '您好！我是您的智能助手。有任何關於技術規格或 FAQ 的問題都可以問我喔！',
        chatPlaceholder: '請輸入問題...',
        chatSend: '傳送',
        alertExceedLimit: '最多僅限 5 個附件！',
        btnSubmitting: '提交中...',
        alertSuccess: '提交成功！編號：',
        alertError: '發生錯誤，請稍後再試。',
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
        labelUpload: '附件上传 (最多 5 個)',
        uploadHint: '文件將自动存入云端文件夹',
        btnSubmit: '提交需求',
        chatTitle: 'AI 智能客服',
        chatWelcome: '您好！我是您的智能助手。有任何关于技术规格或 FAQ 的问题都可以問我喔！',
        chatPlaceholder: '请输入问题...',
        chatSend: '发送',
        alertExceedLimit: '最多仅限 5 個附件！',
        btnSubmitting: '提交中...',
        alertSuccess: '提交成功！编号：',
        alertError: '发生错误，请稍后再试。',
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
        pageTitle: 'Customer Support System',
        pageSubtitle: 'Please fill in the information below',
        labelCompany: 'Company Name',
        placeholderCompany: 'Enter company name',
        labelContact: 'Contact Person',
        placeholderContact: 'Contact name',
        labelEmail: 'Email Address',
        labelSNSType: 'Platform',
        labelSNSID: 'Account ID',
        placeholderSNSID: 'Enter ID',
        labelProduct: 'Product Model',
        labelSN: 'Serial Number (S/N)',
        placeholderSN: 'Last 5 digits',
        labelType: 'Inquiry Type',
        optDefault: 'Select type',
        optSpec: 'Specs & Selection',
        optTech: 'Technical Inquiry',
        labelDesc: 'Description',
        placeholderDesc: 'Describe your issues...',
        labelUpload: 'Attachments (Max 5)',
        uploadHint: 'Files saved to cloud folder',
        btnSubmit: 'Submit Request',
        chatTitle: 'AI Support',
        chatWelcome: 'Hello! I am your AI assistant. Ask me anything!',
        chatPlaceholder: 'Type question...',
        chatSend: 'Send',
        alertExceedLimit: 'Max 5 attachments!',
        btnSubmitting: 'Submitting...',
        alertSuccess: 'Submitted! ID: ',
        alertError: 'Error occurred.',
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
let selectedFiles = [];

function setLanguage(lang) {
    if (!i18n[lang]) return;
    currentLang = lang;
    console.log('Setting language to:', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang][key]) {
            el.innerHTML = i18n[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (i18n[lang][key]) {
            el.placeholder = i18n[lang][key];
        }
    });

    const specLink = document.getElementById('btn-spec-link');
    if (specLink) specLink.href = `spec.html?lang=${lang}`;

    document.querySelectorAll('.oto-lang-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`lang-${lang.toLowerCase()}`) || document.getElementById(`lang-${lang.replace('-', '').toLowerCase()}`);
    if (activeBtn) activeBtn.classList.add('active');
}

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    let lang = 'zh-TW';
    if (urlLang && i18n[urlLang]) {
        lang = urlLang;
    } else {
        const userLang = navigator.language || navigator.userLanguage;
        if (userLang.includes('zh-TW') || userLang.includes('zh-HK')) lang = 'zh-TW';
        else if (userLang.includes('zh')) lang = 'zh-CN';
        else lang = 'en';
    }
    setLanguage(lang);
});

// DOM Elements
const regForm = document.getElementById('registrationForm');
const aiChatWidget = document.getElementById('ai-chat-widget');
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');
const chatBody = document.getElementById('chat-body');
const imagePreview = document.getElementById('image-preview');
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const closeChatBtn = document.getElementById('close-chat');

// File Upload
const imageFilesInput = document.getElementById('imageFiles');
if (imageFilesInput) {
    imageFilesInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (selectedFiles.length + files.length > 5) {
            showAlert(i18n[currentLang].alertExceedLimit);
            e.target.value = '';
            return;
        }
        for (const file of files) {
            const fileObj = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (ev) => resolve({ name: file.name, data: ev.target.result });
                reader.readAsDataURL(file);
            });
            selectedFiles.push(fileObj);
        }
        e.target.value = '';
        renderPreviews();
    });
}

function renderPreviews() {
    if (!imagePreview) return;
    imagePreview.innerHTML = '';
    selectedFiles.forEach((file, index) => {
        const div = document.createElement('div');
        div.className = 'preview-item';
        div.innerHTML = file.data.startsWith('data:image') ? `<img src="${file.data}">` : `📄`;
        const removeBtn = document.createElement('div');
        removeBtn.className = 'remove-file';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => { selectedFiles.splice(index, 1); renderPreviews(); };
        div.appendChild(removeBtn);
        imagePreview.appendChild(div);
    });
}

// Form Submission
if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loading = document.getElementById('loading');
        loading.classList.remove('hidden');
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
            const response = await fetch(GAS_WEB_APP_URL, { method: 'POST', body: JSON.stringify(formData) });
            const result = await response.json();
            loading.classList.add('hidden');
            if (result.result === 'success') {
                showAlert(i18n[currentLang].alertSuccess + result.id);
                regForm.reset();
                selectedFiles = [];
                renderPreviews();
            } else { showAlert(i18n[currentLang].alertError); }
        } catch (error) {
            loading.classList.add('hidden');
            showAlert(i18n[currentLang].alertError);
        }
    });
}

// Modal
function showAlert(message) {
    const modal = document.getElementById('custom-modal');
    const modalMsg = document.getElementById('modal-message');
    if (modalMsg) modalMsg.innerText = message;
    if (modal) modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('custom-modal');
    if (modal) modal.style.display = 'none';
}

// Chat
if (chatToggleBtn && aiChatWidget) {
    chatToggleBtn.onclick = () => aiChatWidget.classList.toggle('chat-closed');
}
if (closeChatBtn && aiChatWidget) {
    closeChatBtn.onclick = (e) => { e.stopPropagation(); aiChatWidget.classList.add('chat-closed'); };
}

const handleChatSubmit = async () => {
    const query = chatInput ? chatInput.value.trim() : "";
    if (!query) return;
    addMessage(query, 'user');
    if (chatInput) chatInput.value = '';
    try {
        const response = await fetch(`${GAS_WEB_APP_URL}?q=${encodeURIComponent(query)}&lang=${currentLang}`);
        const result = await response.json();
        addMessage(result.answer, 'bot');
    } catch (err) {
        addMessage(i18n[currentLang].chatError || 'Service Error', 'bot');
    }
};

if (sendChat) sendChat.onclick = handleChatSubmit;
if (chatInput) chatInput.onkeypress = (e) => { if (e.key === 'Enter') handleChatSubmit(); };

function addMessage(text, sender) {
    if (!chatBody) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerText = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}
