/**
 * 波長範圍與解析度查詢邏輯 (spec.js)
 */

const specSearchForm = document.getElementById('specSearchForm');
const resultCard = document.getElementById('resultCard');
const resultContent = document.getElementById('resultContent');
const specLoading = document.getElementById('spec-loading');

console.log('[Diagnostic] spec.js v1.8 loaded.');

if (specSearchForm) {
    specSearchForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        console.log('[Diagnostic] Search submitted.');

        const productModel = document.getElementById('productModel').value.trim().toUpperCase();
        
        if (productModel.length < 6) {
            const errorMsg = (typeof currentLang !== 'undefined' && currentLang === 'en') ? 
                'Invalid format (e.g. SE2030)' : '型號格式錯誤 (例: SE2030)';
            if (typeof showAlert === 'function') showAlert(errorMsg); else alert(errorMsg);
            return;
        }

        const sensorCode = productModel.substring(4, 6).substring(0, 1); 

        specLoading.style.display = 'block';
        if (resultCard) resultCard.classList.remove('active');

        try {
            const baseUrl = (typeof GAS_WEB_APP_URL !== 'undefined') ? GAS_WEB_APP_URL.trim() : '';
            
            const params = new URLSearchParams({
                action: 'querySpec',
                productModel: productModel,
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
                const displayModel = productModel.substring(0, 2);
                const displaySensor = Number(sensorCode).toString();
                displayResult(displayModel, displaySensor, result.data);
            } else {
                const failMsg = (typeof currentLang !== 'undefined' && currentLang === 'en') ? 
                    (result.message || 'Sensor not found') : 
                    (result.message || '找不到對應感測器資訊');
                if (typeof showAlert === 'function') showAlert(failMsg); else alert(failMsg);
            }
        } catch (err) {
            console.error('GAS Connection Error:', err);
            const errorMsg = (typeof currentLang !== 'undefined' && currentLang === 'en') ? 
                `System Error: (${err.message})` : 
                `系統錯誤：(${err.message})`;
            if (typeof showAlert === 'function') showAlert(errorMsg); else alert(errorMsg);
        } finally {
            specLoading.style.display = 'none';
        }
    });
}

/**
 * 增強版解析：支援解析包含多組資料的字串
 */
function parseMultipleSensorData(info) {
    const sections = info.split(/------------------/);
    const results = [];
    
    sections.forEach(sec => {
        try {
            const parenMatch = sec.match(/\(([^)]+)\)/);
            if (parenMatch) {
                const content = parenMatch[1];
                const sizeMatch = content.match(/(\d+)x/);
                const countMatch = content.match(/,\s*(\d+)/);
                
                if (sizeMatch && countMatch) {
                    const size = parseFloat(sizeMatch[1]);
                    const count = parseFloat(countMatch[1]);
                    results.push({
                        length: ((size * count) / 1000).toFixed(3),
                        pixels: count
                    });
                }
            }
        } catch (e) {}
    });
    return results;
}

function displayResult(modelCode, sensorCode, data) {
    if (!resultContent || !resultCard) return;
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'zh-TW';
    const dict = (typeof i18n !== 'undefined' && i18n[lang]) ? i18n[lang] : {};

    const sensorResults = parseMultipleSensorData(data);
    
    let extraHtml = '';
    if (sensorResults.length > 0) {
        // 如果有多組結果，以清單方式顯示
        extraHtml = sensorResults.map((res, idx) => `
            <div style="margin-top: 10px; padding: 10px; border: 1px dashed #ccc; border-radius: 6px; background: #fff;">
                <div style="font-size: 0.85em; color: #666; margin-bottom: 5px;">Result #${idx + 1}</div>
                <div class="result-item" style="border:none; padding:0; margin:0;">
                    <span class="result-label">${dict.resSensorLength || '感測器長度'}:</span>
                    <span class="result-value" style="color: #004494; font-weight: bold;">${res.length} mm</span>
                </div>
                <div class="result-item" style="border:none; padding:0; margin:0;">
                    <span class="result-label">${dict.resPixels || '像素'}:</span>
                    <span class="result-value" style="color: #004494; font-weight: bold;">${res.pixels}</span>
                </div>
            </div>
        `).join('');
    }

    resultContent.innerHTML = `
        <div class="result-item">
            <span class="result-label">${dict.resModelCode || '機型代碼'}:</span>
            <span class="result-value">${modelCode}</span>
        </div>
        <div class="result-item">
            <span class="result-label">${dict.resSensorCode || '感測器代碼'}:</span>
            <span class="result-value">${sensorCode}</span>
        </div>
        ${extraHtml}
        <div class="result-item" style="flex-direction: column; align-items: flex-start; gap: 5px; margin-top: 15px;">
            <span class="result-label">${dict.resSensorInfo || '感測器資訊'}:</span>
            <span class="result-value" style="background: #f8f9fa; padding: 10px; border-radius: 8px; width: 100%; white-space: pre-wrap; font-family: monospace; font-size: 0.9em;">${data}</span>
        </div>
    `;
    resultCard.classList.add('active');
    resultCard.scrollIntoView({ behavior: 'smooth' });
}
