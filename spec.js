/**
 * 波長範圍與解析度查詢邏輯 (spec.js)
 */

const specSearchForm = document.getElementById('specSearchForm');
const resultCard = document.getElementById('resultCard');
const resultContent = document.getElementById('resultContent');
const specLoading = document.getElementById('spec-loading');

console.log('[Diagnostic] spec.js v1.5 loaded.');

if (specSearchForm) {
    specSearchForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        console.log('[Diagnostic] Search submitted.');

        const productModel = document.getElementById('productModel').value.trim().toUpperCase();
        const modelCode = productModel.substring(0, 2);
        const digitsPart = productModel.substring(2, 6);
        const sensorCode = digitsPart.substring(1, 3); 

        if (!modelCode || sensorCode.length !== 2 || isNaN(sensorCode)) {
            const errorMsg = (typeof currentLang !== 'undefined' && currentLang === 'en') ? 
                'Invalid format (e.g. SE2030)' : '型號格式錯誤 (例: SE2030)';
            if (typeof showAlert === 'function') showAlert(errorMsg); else alert(errorMsg);
            return;
        }

        specLoading.style.display = 'block';
        if (resultCard) resultCard.classList.remove('active');

        try {
            const baseUrl = (typeof GAS_WEB_APP_URL !== 'undefined') ? GAS_WEB_APP_URL.trim() : '';
            if (!baseUrl || baseUrl.includes('PLACEHOLDER')) {
                throw new Error('GAS URL not configured');
            }

            const params = new URLSearchParams({
                action: 'querySpec',
                modelCode: modelCode,
                sensorCode: sensorCode,
                lang: (typeof currentLang !== 'undefined' ? currentLang : 'zh-TW')
            });
            
            const url = `${baseUrl}?${params.toString()}`;
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            });

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            const result = await response.json();

            if (result.status === 'success' && result.data) {
                displayResult(modelCode, sensorCode, result.data);
            } else {
                const failMsg = (typeof currentLang !== 'undefined' && currentLang === 'en') ? 
                    (result.message || `Sensor not found (${modelCode}-${sensorCode})`) : 
                    (result.message || `找不到對應感測器 (${modelCode}-${sensorCode})`);
                if (typeof showAlert === 'function') showAlert(failMsg); else alert(failMsg);
            }
        } catch (err) {
            console.error('GAS Connection Error:', err);
            const errorMsg = (typeof currentLang !== 'undefined' && currentLang === 'en') ? 
                `System Error: Cannot connect to GAS (${err.message})` : 
                `系統錯誤：無法連線至 Google Apps Script 後端 (${err.message})`;
            if (typeof showAlert === 'function') showAlert(errorMsg); else alert(errorMsg);
        } finally {
            specLoading.style.display = 'none';
        }
    });
}

/**
 * 解析感測器長度
 * 格式範例: (14x200, 2048) -> 14 * 2048 / 1000 = 28.672
 */
function calculateSensorLength(info) {
    try {
        // 尋找括號內的內容
        const parenMatch = info.match(/\(([^)]+)\)/);
        if (!parenMatch) return null;
        
        const content = parenMatch[1];
        
        // 1. 尋找像素大小 (第一個數字x...)
        const sizeMatch = content.match(/(\d+)x/);
        // 2. 尋找像素數量 (逗號後的數字，可能是單純數字或 NxM 格式)
        const countMatch = content.match(/,\s*(\d+)/);
        
        if (sizeMatch && countMatch) {
            const size = parseFloat(sizeMatch[1]);
            const count = parseFloat(countMatch[1]);
            const length = (size * count) / 1000;
            return length.toFixed(3); // 保留三位小數
        }
    } catch (e) {
        console.error('Error parsing sensor length:', e);
    }
    return null;
}

function displayResult(modelCode, sensorCode, data) {
    if (!resultContent || !resultCard) return;
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'zh-TW';
    const dict = (typeof i18n !== 'undefined' && i18n[lang]) ? i18n[lang] : {};

    const sensorLength = calculateSensorLength(data);
    const lengthHtml = sensorLength ? `
        <div class="result-item">
            <span class="result-label">${dict.resSensorLength || '感測器長度'}:</span>
            <span class="result-value" style="color: #004494; font-weight: bold;">${sensorLength} mm</span>
        </div>
    ` : '';

    resultContent.innerHTML = `
        <div class="result-item">
            <span class="result-label">${dict.resModelCode || '機型代碼'}:</span>
            <span class="result-value">${modelCode}</span>
        </div>
        <div class="result-item">
            <span class="result-label">${dict.resSensorCode || '感測器代碼'}:</span>
            <span class="result-value">${sensorCode}</span>
        </div>
        ${lengthHtml}
        <div class="result-item" style="flex-direction: column; align-items: flex-start; gap: 5px;">
            <span class="result-label">${dict.resSensorInfo || '感測器資訊'}:</span>
            <span class="result-value" style="background: #f8f9fa; padding: 10px; border-radius: 8px; width: 100%; white-space: pre-wrap; font-family: monospace;">${data}</span>
        </div>
    `;
    resultCard.classList.add('active');
    resultCard.scrollIntoView({ behavior: 'smooth' });
}
