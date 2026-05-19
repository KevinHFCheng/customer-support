/**
 * 波長範圍與解析度查詢邏輯 (spec.js v2.0)
 */

const specSearchForm = document.getElementById('specSearchForm');
const resultCard     = document.getElementById('resultCard');
const resultContent  = document.getElementById('resultContent');
const specLoading    = document.getElementById('spec-loading');
const searchBtn      = document.getElementById('searchBtn');

console.log('[Diagnostic] spec.js v2.1 loaded.');

if (specSearchForm) {
    specSearchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('[Diagnostic] Search submitted.');

        const productModel = document.getElementById('productModel').value.trim().toUpperCase();

        if (productModel.length < 6) {
            const msg = (typeof currentLang !== 'undefined' && currentLang === 'en')
                ? 'Invalid format (e.g. SE2030)'
                : '型號格式錯誤，需至少 6 碼 (例: SE2030)';
            if (typeof showAlert === 'function') showAlert(msg); else alert(msg);
            return;
        }

        const sensorCode      = productModel.substring(4, 5);
        const startWavelength = document.getElementById('startWavelength').value.trim();
        const endWavelength   = document.getElementById('endWavelength').value.trim();
        const resolutionReq   = document.getElementById('resolutionReq').value.trim();

        // UI: show loading
        specLoading.style.display = 'block';
        if (resultCard) resultCard.classList.remove('active');
        if (searchBtn)  { searchBtn.disabled = true; searchBtn.textContent = '查詢中...'; }

        try {
            const baseUrl = (typeof GAS_WEB_APP_URL !== 'undefined') ? GAS_WEB_APP_URL.trim() : '';

            // === Step 1: 查詢感測器資訊 ===
            const params1 = new URLSearchParams({
                action: 'querySpec',
                productModel: productModel,
                sensorCode: sensorCode,
                lang: (typeof currentLang !== 'undefined' ? currentLang : 'zh-TW')
            });
            const res1 = await fetch(`${baseUrl}?${params1.toString()}`, {
                method: 'GET', mode: 'cors', cache: 'no-cache'
            });
            if (!res1.ok) throw new Error(`HTTP Error: ${res1.status}`);
            const result1 = await res1.json();

            if (result1.status !== 'success' || !result1.data) {
                const msg = result1.message || '找不到對應感測器資訊';
                if (typeof showAlert === 'function') showAlert(msg); else alert(msg);
                return;
            }

            const displayModel  = productModel.substring(0, 2);
            const displaySensor = Number(sensorCode).toString();
            const sensorResults = parseMultipleSensorData(result1.data);

            // === Step 2 (optional): 查詢波長與解析度 ===
            // 只要有起始/結束波長就觸發，RB/SB 機種則強制觸發
            let result2 = null;
            
            if ((startWavelength && endWavelength && sensorResults.length > 0) || displayModel === 'RB' || displayModel === 'SB') {
                // 對於 RB/SB，如果沒有 sensorResults，則給予預設值 0
                const sLength = sensorResults.length > 0 ? sensorResults[0].length : 0;
                const sPixels = sensorResults.length > 0 ? sensorResults[0].pixels : 0;

                const params2 = new URLSearchParams({
                    action: 'queryWavelength',
                    modelCode: displayModel,
                    sensorLength: sLength,
                    sensorPixels: sPixels,
                    startWl: startWavelength || 0,
                    endWl: endWavelength || 0,
                    resolutionReq: resolutionReq,
                    lang: (typeof currentLang !== 'undefined' ? currentLang : 'zh-TW')
                });

                const waveUrl = `${baseUrl}?${params2.toString()}`;
                console.log('[Wave] Calling URL:', waveUrl);

                try {
                    const res2 = await fetch(waveUrl, {
                        method: 'GET', mode: 'cors', cache: 'no-cache'
                    });
                    const rawText = await res2.text();
                    console.log('[Wave] Raw response text:', rawText);
                    result2 = JSON.parse(rawText);
                    console.log('[Wave] Parsed result2:', result2);
                } catch (waveErr) {
                    console.error('[Wave] Query failed:', waveErr);
                    result2 = { status: 'error', message: '前端連線錯誤: ' + waveErr.message };
                }
            } else {
                console.log('[Wave] Condition NOT met - skipping wavelength query.');
            }

            displayResult(displayModel, displaySensor, result1.data, sensorResults, result2, resolutionReq);

        } catch (err) {
            console.error('GAS Connection Error:', err);
            const msg = (typeof currentLang !== 'undefined' && currentLang === 'en')
                ? `System Error: (${err.message})`
                : `系統錯誤：(${err.message})`;
            if (typeof showAlert === 'function') showAlert(msg); else alert(msg);
        } finally {
            specLoading.style.display = 'none';
            if (searchBtn) { searchBtn.disabled = false; searchBtn.textContent = '搜尋'; }
        }
    });
}

// ============================================================
//  解析感測器資料
// ============================================================
function parseMultipleSensorData(info) {
    const sections = info.split(/------------------/);
    const results  = [];

    sections.forEach(sec => {
        try {
            const allParens = sec.match(/\(([^)]+)\)/g);
            if (!allParens) return;

            for (let p of allParens) {
                const content    = p.replace(/[()]/g, '');
                const sizeMatch  = content.match(/(\d+)x/);
                const commaParts = content.split(',');

                if (sizeMatch && commaParts.length > 1) {
                    const pixelMatch = commaParts[1].match(/(\d+)/);
                    if (!pixelMatch) continue;

                    const pixelSize  = parseFloat(sizeMatch[1]);
                    const pixelCount = parseFloat(pixelMatch[1]);

                    results.push({
                        length:   ((pixelSize * pixelCount) / 1000).toFixed(3),
                        pixels:   pixelCount,
                        rawLabel: sec.match(/【(.*?)】/)?.[1] || 'Match'
                    });
                    break; // 取第一組有效規格即停止
                }
            }
        } catch (e) {
            console.error('Parsing error:', e);
        }
    });

    return results;
}

// ============================================================
//  渲染結果
// ============================================================
function displayResult(modelCode, sensorCode, rawData, sensorResults, wavelengthResult, resolutionReq) {
    if (!resultContent || !resultCard) return;
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'zh-TW';
    const dict = (typeof i18n !== 'undefined' && i18n[lang]) ? i18n[lang] : {};
    const reqVal = parseFloat(resolutionReq);

    let html = '';

    // ── Section 1: 感測器基本資訊 (配合需求暫不顯示感測器結果與資訊) ──────────────────────────────
    /* 
    let sensorBodyHtml = `
        <div class="info-row">
            <span class="info-label">${dict.resModelCode  || '機型代碼'}</span>
            <span class="info-value">${modelCode}</span>
        </div>
        <div class="info-row">
            <span class="info-label">${dict.resSensorCode || '感測器代碼'}</span>
            <span class="info-value">${sensorCode}</span>
        </div>`;

    if (sensorResults && sensorResults.length > 0) {
        sensorResults.forEach(res => {
            const pixelSize = Math.round((parseFloat(res.length) * 1000) / parseFloat(res.pixels));
            sensorBodyHtml += `
                <div style="margin-top:14px;">
                    <div class="sensor-chip">${res.rawLabel}</div>
                    <div class="info-row">
                        <span class="info-label">${dict.resSensorLength || '感測器長度'}</span>
                        <span class="info-value highlight">${res.length} mm</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">${dict.resPixels || '像素'}</span>
                        <span class="info-value" style="font-family:'JetBrains Mono',monospace;font-weight:700;">${res.pixels.toLocaleString()} px</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">像素大小</span>
                        <span class="info-value">${pixelSize} um</span>
                    </div>
                </div>`;
        });
    }

    html += `
        <div class="result-section">
            <div class="result-section-header blue">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                感測器查詢結果
            </div>
            <div class="result-section-body">${sensorBodyHtml}</div>
        </div>`;
    */

    // ── Section 2: 波段與解析度 ────────────────────────────────
    if (wavelengthResult) {
        if (wavelengthResult.status === 'full_table') {
            let tableData = wavelengthResult.data;
            let tableRows = '';
            
            tableData.forEach((row, index) => {
                let rowHtml = row.map(cell => `<td>${cell !== undefined && cell !== null ? cell : ''}</td>`).join('');
                if (index === 0) {
                    tableRows += `<thead><tr>${row.map(cell => `<th>${cell !== undefined && cell !== null ? cell : ''}</th>`).join('')}</tr></thead><tbody>`;
                } else {
                    tableRows += `<tr>${rowHtml}</tr>`;
                }
            });
            tableRows += `</tbody>`;

            html += `
                <div class="result-section">
                    <div class="result-section-header green">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                        規格表完整資料
                    </div>
                    <div class="result-section-body" style="padding: 0; border: none; background: transparent;">
                        <div style="overflow-x: auto; max-height: 600px; overflow-y: auto;">
                            <table class="slit-table" style="white-space: nowrap; width: 100%;">
                                ${tableRows}
                            </table>
                        </div>
                    </div>
                </div>`;
        } else if (wavelengthResult.status === 'success' && wavelengthResult.data && wavelengthResult.data.length > 0) {
            let slitHeaders = "";
            if (wavelengthResult.data[0] && wavelengthResult.data[0].slits) {
                slitHeaders = wavelengthResult.data[0].slits.map(s => `<th>${s.slit}</th>`).join('');
            } else {
                slitHeaders = `<th>10um</th><th>25um</th><th>50um</th><th>100um</th><th>200um</th>`;
            }

            let tableRows = '';
            wavelengthResult.data.forEach(item => {
                let resCells = item.slits.map(s => {
                    const rv         = parseFloat(s.resolution);
                    const isMeet     = !isNaN(rv) && !isNaN(reqVal) && rv <= reqVal;
                    const cls        = isMeet ? 'res-meet' : 'res-normal';
                    const badge      = isMeet ? '<div style="margin-top:4px;"><span class="badge-meet">符合</span></div>' : '';
                    return `<td><span class="${cls}">${s.resolution} nm</span>${badge}</td>`;
                }).join('');

                let rawBand = item.rawBandName || item.waveband.split(" (")[0];
                let range = item.bandRange || item.waveband.replace(rawBand, "").trim();
                
                tableRows += `
                    <tr>
                        <td style="font-weight: 600; text-align: center;">${rawBand} <br><span class="grating-tag" style="margin-top:4px;">${item.grating}</span></td>
                        <td style="text-align: center;">${range}</td>
                        ${resCells}
                    </tr>`;
            });

            let waveBands = `
                <div class="waveband-block" style="padding: 0; border: none; background: transparent;">
                    <div style="overflow-x: auto;">
                        <table class="slit-table" style="white-space: nowrap; width: 100%;">
                            <thead>
                                <tr>
                                    <th>波段名</th>
                                    <th>波段範圍</th>
                                    ${slitHeaders}
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                </div>`;

            html += `
                <div class="result-section">
                    <div class="result-section-header green">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                        滿足波長條件的波段與解析度
                    </div>
                    <div class="result-section-body">${waveBands}</div>
                </div>`;
        } else {
            html += `
                <div class="result-section">
                    <div class="result-section-header amber">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        波段查詢提示
                    </div>
                    <div class="result-section-body">
                        <div class="notice-block warn">
                            <span class="notice-icon">⚠</span>
                            <span>${wavelengthResult.message || '在波長範圍內查無符合的波段與解析度資料'}</span>
                            ${wavelengthResult.debugLogs ? '<br><br><div style="font-family: monospace; font-size: 12px; line-height: 1.4; color: #666; background: #fff3cd; padding: 10px; border-radius: 4px; text-align: left; max-height: 200px; overflow-y: auto;"><b>[Debug Logs]</b><br>' + wavelengthResult.debugLogs.join('<br>') + '</div>' : ''}
                        </div>
                    </div>
                </div>`;
        }
    }

    // ── Section 3: 感測器原始資訊 ──────────────────────────────
    html += `
        <div class="result-section">
            <div class="result-section-header blue">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                ${dict.resSensorInfo || '感測器原始資訊'}
            </div>
            <div class="result-section-body">
                <div class="raw-info-block">${rawData}</div>
            </div>
        </div>`;

    resultContent.innerHTML = html;
    resultCard.classList.add('active');
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
