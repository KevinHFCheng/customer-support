/**
 * 波長範圍與解析度查詢邏輯 (spec.js)
 * 改為透過 Google Apps Script (GAS) 進行後端查詢，確保與 index.html 模式一致
 */

const specSearchForm = document.getElementById('specSearchForm');
const resultCard = document.getElementById('resultCard');
const resultContent = document.getElementById('resultContent');
const specLoading = document.getElementById('spec-loading');

// 增加 i18n 支援
if (typeof i18n !== 'undefined') {
    i18n['zh-TW'].specTitle = '波長範圍與解析度';
    i18n['zh-TW'].specSubtitle = '請輸入產品型號以查詢對應的感測器資訊';
    i18n['zh-CN'].specTitle = '波长范围与解析度';
    i18n['zh-CN'].specSubtitle = '请输入 product 型号以查询对应的感測器信息';
    i18n['en'].specTitle = 'Range & Resolution';
    i18n['en'].specSubtitle = 'Please enter product model to search for sensor info';
}

specSearchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productModel = document.getElementById('productModel').value.trim().toUpperCase();
    
    // 邏輯拆解: SE2030 -> Model Code: SE, Sensor Code: 03
    const modelCode = productModel.substring(0, 2);
    const digitsPart = productModel.substring(2, 6);
    const sensorCode = digitsPart.substring(1, 3); 

    if (!modelCode || sensorCode.length !== 2 || isNaN(sensorCode)) {
        showGlobalAlert(currentLang === 'en' ? 'Invalid format (e.g. SE2030)' : '型號格式錯誤 (例: SE2030)');
        return;
    }

    specLoading.style.display = 'block';
    resultCard.classList.remove('active');

    try {
        // 發送請求到 GAS 後端 (與 index.html 模式一致)
        // 參數說明: 
        // action=querySpec (告訴後端要執行規格查詢)
        // modelCode, sensorCode (搜尋條件)
        const url = `${GAS_WEB_APP_URL}?action=querySpec&modelCode=${encodeURIComponent(modelCode)}&sensorCode=${encodeURIComponent(sensorCode)}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('連線失敗');
        
        const result = await response.json();

        if (result.status === 'success' && result.data) {
            displayResult(modelCode, sensorCode, result.data);
        } else {
            showGlobalAlert(currentLang === 'en' ? 
                (result.message || `Sensor not found (${modelCode}-${sensorCode})`) : 
                (result.message || `找不到對應感測器 (${modelCode}-${sensorCode})`)
            );
        }
    } catch (err) {
        console.error(err);
        showGlobalAlert(currentLang === 'en' ? 'System Error: Cannot connect to GAS.' : '系統錯誤：無法連線至 Google Apps Script 後端。');
    } finally {
        specLoading.style.display = 'none';
    }
});

function displayResult(modelCode, sensorCode, data) {
    resultContent.innerHTML = `
        <div class="result-item">
            <span class="result-label">${currentLang === 'en' ? 'Model Code' : '機型代碼'}:</span>
            <span class="result-value">${modelCode}</span>
        </div>
        <div class="result-item">
            <span class="result-label">${currentLang === 'en' ? 'Sensor Code' : '感測器代碼'}:</span>
            <span class="result-value">${sensorCode}</span>
        </div>
        <div class="result-item" style="margin-top: 15px; border-top: 1px dashed #ccc; padding-bottom: 10px; padding-top: 10px;">
            <span class="result-label">${currentLang === 'en' ? 'Sensor Information' : '感測器資訊'}:</span>
            <span class="result-value" style="color: var(--primary); font-weight: 700;">${data.sensorInfo || "符合資格"}</span>
        </div>
        <div class="result-item">
             <span class="result-label">${currentLang === 'en' ? 'Sheet Row' : '試算表定位'}:</span>
             <span class="result-value">Row ${data.rowNum || "N/A"} (AC=${data.acValue}, AD=${data.adValue})</span>
        </div>
    `;
    resultCard.classList.add('active');
}

/**
 * 統一呼叫 script.js 的 showAlert
 */
function showGlobalAlert(msg) {
    if (typeof showAlert === 'function') {
        showAlert(msg);
    } else {
        alert(msg);
    }
}
