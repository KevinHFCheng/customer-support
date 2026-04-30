/**
 * 波長範圍與解析度查詢邏輯 (spec.js)
 */

const specSearchForm = document.getElementById('specSearchForm');
const resultCard = document.getElementById('resultCard');
const resultContent = document.getElementById('resultContent');
const specLoading = document.getElementById('spec-loading');

console.log('[Diagnostic] spec.js v1.9 loaded.');

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
 * 進階解析：掃描所有括號，找出包含規格參數 (AxB, C) 的那一組
 */
function parseMultipleSensorData(info) {
    const sections = info.split(/------------------/);
    const results = [];
    
    sections.forEach(sec => {
        try {
            // 取得所有括號內容
            const allParens = sec.match(/\(([^)]+)\)/g);
            if (allParens) {
                for (let p of allParens) {
                    const content = p.replace(/[()]/g, '');
                    const sizeMatch = content.match(/(\d+)x/);
                    const countMatch = content.match(/,?\s*(\d+)/); // 寬鬆比對像素數量
                    
                    if (sizeMatch && countMatch) {
                        // 針對 countMatch 做優化，避免抓到 50x250 中的 250
                        // 邏輯：取第一個逗號後的數字
                        const commaParts = content.split(',');
                        if (commaParts.length > 1) {
                            const pixelSize = parseFloat(sizeMatch[1]);
                            const pixelCount = parseFloat(commaParts[1].match(/(\d+)/)[1]);
                            results.push({
                                length: ((pixelSize * pixelCount) / 1000).toFixed(3),
                                pixels: pixelCount,
                                rawLabel: sec.match(/【(.*?)】/)?.[1] || "Match"
                            });
                            break; // 找到正確的規格組後跳出
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Parsing error in section:', e);
        }
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
        extraHtml = sensorResults.map((res) => `
            <div style="margin-top: 10px; padding: 12px; border: 1px solid #004494; border-left: 5px solid #004494; border-radius: 6px; background: #f0f7ff;">
                <div style="font-size: 0.9em; color: #004494; font-weight: bold; margin-bottom: 8px;">🔹 ${res.rawLabel}</div>
                <div class="result-item" style="border:none; padding:0; margin:0 0 5px 0;">
                    <span class="result-label" style="font-size: 0.95em;">${dict.resSensorLength || '感測器長度'}:</span>
                    <span class="result-value" style="color: #d9534f; font-weight: bold; font-size: 1.1em;">${res.length} mm</span>
                </div>
                <div class="result-item" style="border:none; padding:0; margin:0;">
                    <span class="result-label" style="font-size: 0.95em;">${dict.resPixels || '像素'}:</span>
                    <span class="result-value" style="color: #333; font-weight: bold;">${res.pixels}</span>
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
        <div class="result-item" style="flex-direction: column; align-items: flex-start; gap: 5px; margin-top: 20px;">
            <span class="result-label" style="border-bottom: 2px solid #ddd; width: 100%; padding-bottom: 5px; margin-bottom: 5px;">${dict.resSensorInfo || '詳細感測器資訊'}:</span>
            <span class="result-value" style="background: #f8f9fa; padding: 12px; border-radius: 8px; width: 100%; white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 0.85em; color: #444; border: 1px solid #eee;">${data}</span>
        </div>
    `;
    resultCard.classList.add('active');
    resultCard.scrollIntoView({ behavior: 'smooth' });
}
