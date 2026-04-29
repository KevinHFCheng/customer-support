/**
 * 波長範圍與解析度查詢邏輯 (spec.js)
 * 使用 Google Visualization API 以解決直接 fetch 可能產生的 CORS 跨網域問題
 */

const SPREADSHEET_ID = '1aVrXJw50Zbrt--n5dFAmCb7i55je_ZFx';
const SHEET_NAME = '光譜儀_命名規則';
const RANGE = 'AC65:AD108';

const specSearchForm = document.getElementById('specSearchForm');
const resultCard = document.getElementById('resultCard');
const resultContent = document.getElementById('resultContent');
const specLoading = document.getElementById('spec-loading');

// 載入 Google Visualization 函式庫
google.charts.load('current', { 'packages': ['corechart'] });

// 增加 i18n 支援
if (typeof i18n !== 'undefined') {
    i18n['zh-TW'].specTitle = '波長範圍與解析度';
    i18n['zh-TW'].specSubtitle = '請輸入產品型號以查詢對應的感測器資訊';
    i18n['zh-CN'].specTitle = '波长范围与解析度';
    i18n['zh-CN'].specSubtitle = '请输入产品型号以查询对应的感測器信息';
    i18n['en'].specTitle = 'Range & Resolution';
    i18n['en'].specSubtitle = 'Please enter product model to search for sensor info';
}

specSearchForm.addEventListener('submit', (e) => {
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

    // 使用 google.visualization.Query 進行查詢
    // 這種方式會自動處理使用者的 Google 登入狀態 (Session)
    const queryUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?sheet=${encodeURIComponent(SHEET_NAME)}&range=${RANGE}`;
    const query = new google.visualization.Query(queryUrl);

    query.send((response) => {
        specLoading.style.display = 'none';

        if (response.isError()) {
            console.error('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
            showGlobalAlert(currentLang === 'en' ? 
                'Access Denied. Please ensure you are logged in to Google.' : 
                '存取失敗。請確保您已登入 Google 帳號 (kevin.cheng@otophotonics.com) 並具備權限。');
            return;
        }

        const data = response.getDataTable();
        const numRows = data.getNumberOfRows();
        
        let matchRow = null;
        let modelMatched = false;

        // 搜尋邏輯: 先匹配機型代碼，再向下搜尋感測器代碼
        for (let i = 0; i < numRows; i++) {
            const acValue = (data.getValue(i, 0) || "").toString().trim().toUpperCase();
            
            if (acValue === modelCode) {
                modelMatched = true;
                continue;
            }

            if (modelMatched) {
                // 如果遇到下一個機型 (2碼純英文)，跳出區塊
                if (acValue.length === 2 && /^[A-Z]+$/.test(acValue) && isNaN(acValue)) {
                    modelMatched = false;
                    continue;
                }

                const targetSensorInt = parseInt(sensorCode, 10);
                const currentAcInt = parseInt(acValue, 10);

                if (!isNaN(targetSensorInt) && !isNaN(currentAcInt) && targetSensorInt === currentAcInt) {
                    // 找到匹配行，獲取 AC 與 AD 欄位
                    matchRow = {
                        ac: acValue,
                        ad: data.getValue(i, 1) || ""
                    };
                    break;
                }
            }
        }

        if (matchRow) {
            displayResult(modelCode, sensorCode, matchRow);
        } else {
            showGlobalAlert(currentLang === 'en' ? `Sensor not found (${modelCode}-${sensorCode})` : `找不到對應感測器 (${modelCode}-${sensorCode})`);
        }
    });
});

function displayResult(modelCode, sensorCode, matchRow) {
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
            <span class="result-label">${currentLang === 'en' ? 'Sensor Info' : '感測器資訊'}:</span>
            <span class="result-value" style="color: var(--primary); font-weight: 700;">${matchRow.ad || "符合資格"}</span>
        </div>
        <div class="result-item">
             <span class="result-label">試算表欄位:</span>
             <span class="result-value">AC=${matchRow.ac}, AD=${matchRow.ad}</span>
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
