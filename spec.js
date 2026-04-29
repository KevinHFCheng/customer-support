/**
 * 波長範圍與解析度查詢邏輯 (spec.js)
 */

const SPREADSHEET_ID = '1aVrXJw50Zbrt--n5dFAmCb7i55je_ZFx';
const SHEET_NAME = '光譜儀_命名規則';
const RANGE = 'AC65:AD108';

const specSearchForm = document.getElementById('specSearchForm');
const resultCard = document.getElementById('resultCard');
const resultContent = document.getElementById('resultContent');
const specLoading = document.getElementById('spec-loading');

// 增加 i18n 支援
if (typeof i18n !== 'undefined') {
    i18n['zh-TW'].specTitle = '波長範圍與解析度';
    i18n['zh-TW'].specSubtitle = '請輸入產品型號以查詢對應的感測器資訊';
    i18n['zh-CN'].specTitle = '波长范围与解析度';
    i18n['zh-CN'].specSubtitle = '请输入产品型号以查询对应的感測器信息';
    i18n['en'].specTitle = 'Range & Resolution';
    i18n['en'].specSubtitle = 'Please enter product model to search for sensor info';
}

specSearchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productModel = document.getElementById('productModel').value.trim().toUpperCase();
    
    // 邏輯拆解: SE2030 -> Model Code: SE, Sensor Code: 03
    // 前兩碼為機型代碼
    const modelCode = productModel.substring(0, 2);
    // 後四碼取中間兩碼為感測器代碼 (例如 SE2030 -> 2030 的中間是 03)
    const digitsPart = productModel.substring(2, 6);
    const sensorCode = digitsPart.substring(1, 3); // 取得第 2, 3 位數字 (index 1, 2)

    if (!modelCode || sensorCode.length !== 2 || isNaN(sensorCode)) {
        showGlobalAlert(currentLang === 'en' ? 'Invalid format (e.g. SE2030)' : '型號格式錯誤 (例: SE2030)');
        return;
    }

    specLoading.style.display = 'block';
    resultCard.classList.remove('active');

    try {
        // 使用 Google Sheets Gviz API 取得 CSV 格式數據
        // 注意: 這需要使用者在瀏覽器中具備該試算表的讀取權限 (使用 kevin.cheng@otophotonics.com)
        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}&range=${RANGE}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(currentLang === 'en' ? 'Access denied. Please ensure you are logged in to kevin.cheng@otophotonics.com' : '存取被拒。請確保您已登入 kevin.cheng@otophotonics.com 並具備權限。');
        
        const csvData = await response.text();
        const rows = parseCSV(csvData);

        // 搜尋邏輯: 先匹配機型代碼 (如 SE)，再往下搜尋感測器代碼 (如 03)
        let match = null;
        let modelMatched = false;

        for (const row of rows) {
            const acValue = row[0] ? row[0].trim().toUpperCase() : '';
            
            // 1. 尋找機型代碼區塊
            if (acValue === modelCode) {
                modelMatched = true;
                continue; 
            }

            // 2. 在匹配的機型區塊內尋找感測器代碼
            if (modelMatched) {
                // 如果遇到下一個機型代碼 (長度為 2 的純英文)，則跳出該區塊
                if (acValue.length === 2 && /^[A-Z]+$/.test(acValue) && isNaN(acValue)) {
                    modelMatched = false;
                    continue;
                }

                // 感測器代碼模糊匹配 (比如 03 可以找 3)
                const targetSensorInt = parseInt(sensorCode, 10);
                const currentAcInt = parseInt(acValue, 10);

                if (!isNaN(targetSensorInt) && !isNaN(currentAcInt) && targetSensorInt === currentAcInt) {
                    match = row;
                    break;
                }
            }
        }

        if (match) {
            displayResult(modelCode, sensorCode, match);
        } else {
            showGlobalAlert(currentLang === 'en' ? `Sensor not found (${modelCode}-${sensorCode})` : `找不到對應感測器 (${modelCode}-${sensorCode})`);
        }
    } catch (err) {
        console.error(err);
        showGlobalAlert(err.message);
    } finally {
        specLoading.style.display = 'none';
    }
});

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    return lines.map(line => {
        return line.split(',').map(cell => cell.replace(/^"(.*)"$/, '$1').trim());
    });
}

function displayResult(modelCode, sensorCode, rowData) {
    resultContent.innerHTML = `
        <div class="result-item">
            <span class="result-label">${currentLang === 'en' ? 'Model Code' : '機型代碼'}:</span>
            <span class="result-value">${modelCode}</span>
        </div>
        <div class="result-item">
            <span class="result-label">${currentLang === 'en' ? 'Sensor Code' : '感測器代碼'}:</span>
            <span class="result-value">${sensorCode}</span>
        </div>
        <div class="result-item" style="margin-top: 15px; border-top: 1px dashed #ccc; padding-top: 10px;">
            <span class="result-label">${currentLang === 'en' ? 'Sensor Info' : '感測器資訊'}:</span>
            <span class="result-value" style="color: var(--primary); font-weight: 700;">Matched: AC=${rowData[0]}, AD=${rowData[1]}</span>
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
