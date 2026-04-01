/**
 * 設定 Google Apps Script (GAS) 的部署網址
 * 該網址用於接收表單數據並處理 AI 聊天請求
 */
const GAS_WEB_APP_URL = "THE_GAS_URL_PLACEHOLDER";

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
    submitBtn.innerText = '提交中...';

    // 獲取檔案
    const fileInput = regForm.imageFile;
    let fileData = null;
    let fileName = "";

    // 如果有選取檔案，則讀取為 Base64
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        fileName = file.name;
        fileData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
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
        fileData: fileData, // 圖片 Base64 數據
        fileName: fileName  // 圖片檔名
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
            alert(`提交成功！您的報告編號為：${result.id}`);
            regForm.reset(); // 提交成功後清空表單
        } else {
            alert('提交失敗：' + (result.message || '原因不明'));
        }
    } catch (err) {
        console.error('Submission Error:', err);
        alert('發生系統錯誤：' + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = '提交需求';
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
        const response = await fetch(`${GAS_WEB_APP_URL}?q=${encodeURIComponent(query)}`);
        const result = await response.json();
        addMessage(result.answer, 'bot'); // 顯示 AI 的回覆內容
    } catch (err) {
        console.error('Chat Error:', err);
        addMessage('抱歉，我暫時無法回覆您的問題，請稍後再試。', 'bot');
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
