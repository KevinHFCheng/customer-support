// --- 請填入您的 GAS 部署網址 ---
const GAS_WEB_APP_URL = "THE_GAS_URL_PLACEHOLDER";

const regForm = document.getElementById('registrationForm');
const chatToggle = document.getElementById('chat-toggle-btn');
const aiChatWidget = document.getElementById('ai-chat-widget');
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');
const chatBody = document.getElementById('chat-body');

// 1. 處理表單提交
regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerText = '提交中...';

    const formData = {
        companyName: regForm.companyName.value,
        clientContact: regForm.clientContact.value,
        email: regForm.email.value,
        snsAccount: regForm.snsAccount.value,
        productModel: regForm.productModel.value,
        serialNumber: regForm.serialNumber.value,
        reqType: regForm.reqType.value,
        description: regForm.description.value,
        imgUrl: regForm.imgUrl.value
    };

    try {
        const response = await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', // 避免觸發 CORS Preflight
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.result === 'success') {
            alert(`提交成功！您的報告編號為：${result.id}`);
            regForm.reset();
        } else {
            // 這裡改為顯示 GAS 傳回的錯誤訊息
            alert('提交失敗：' + (result.message || '原因不明'));
        }
    } catch (err) {
        console.error(err);
        alert('發生錯誤：' + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = '提交需求';
    }
});

// 2. AI 聊天室邏輯
chatToggle.onclick = () => {
    const isVisible = aiChatWidget.style.display === 'flex';
    aiChatWidget.style.display = isVisible ? 'none' : 'flex';
};

document.getElementById('close-chat').onclick = () => aiChatWidget.style.display = 'none';

sendChat.onclick = async () => {
    const query = chatInput.value.trim();
    if (!query) return;

    addMessage(query, 'user');
    chatInput.value = '';

    // 呼叫 GAS GET 接口進行 AI 諮詢
    try {
        const response = await fetch(`${GAS_WEB_APP_URL}?q=${encodeURIComponent(query)}`);
        const result = await response.json();
        addMessage(result.answer, 'bot');
    } catch (err) {
        addMessage('抱歉，我暫時無法回覆您的問題。', 'bot');
    }
};

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerText = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}
