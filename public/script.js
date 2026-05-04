/**
 * ГИС ООО «УК «ВСЕ СВОИ» | v8.1.0 TITAN COLOSSUS (FIXED BG)
 */
ymaps.ready(initIndustrialGis);

async function initIndustrialGis() {
    const font = document.createElement('link');
    font.href = 'https://googleapis.com';
    font.rel = 'stylesheet'; document.head.appendChild(font);

    const style = document.createElement('style');
    style.innerHTML = `
        body, button, input, select, div, textarea { font-family: 'Montserrat', sans-serif !important; }
        #map { width: 100vw; height: 100vh; background: #e5e3de; }
        .premium-card { background: rgba(255, 255, 255, 0.98) !important; backdrop-filter: blur(40px); border-radius: 60px; border: 4px solid rgba(0,128,0,0.2); box-shadow: 0 40px 100px rgba(0,0,0,0.25); }
        #eco-panel-root { position: absolute !important; top: 50px !important; right: 50px !important; width: 480px; z-index: 10000; height: 100px; overflow: hidden; border: 6px solid #008000; border-radius: 50px; transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        #eco-panel-root:hover { height: auto; padding-bottom: 40px; box-shadow: 0 40px 100px rgba(0,0,0,0.3); }
        .eco-header { height: 100px; display: flex; align-items: center; justify-content: center; color: #008000; font-weight: 900; font-size: 26px; text-transform: uppercase; cursor: pointer; letter-spacing: 4px; }
        .eco-content { padding: 0 50px; display: flex; flex-direction: column; gap: 20px; opacity: 0; transition: 0.3s; }
        #eco-panel-root:hover .eco-content { opacity: 1; }
        .eco-content label { display: flex; align-items: center; justify-content: space-between; font-size: 24px; font-weight: 800; color: #111; cursor: pointer; }
        .house-card-colossus { width: 860px !important; height: 760px !important; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; }
        .house-main-img { width: 100%; height: 400px; object-fit: cover; border-radius: 35px; border: 5px solid #eee; margin-bottom: 25px; }
        .house-data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; flex-grow: 1; }
        .infra-card { width: 450px; padding: 30px; border-radius: 35px; box-sizing: border-box; }
        .info-row { background: #f9fbf9; padding: 22px 25px; border-radius: 25px; border-left: 12px solid #008000; font-size: 22px; font-weight: 800; margin-bottom: 12px; color: #222; text-align: left; }
        .ui-btn { width: 100%; padding: 25px; border-radius: 30px; border: none; background: #f4f7f4; color: #111; font-weight: 900; font-size: 18px; text-transform: uppercase; border-bottom: 8px solid #dce4de; cursor: pointer; text-align: center; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s; }
        .ui-btn:hover { background: #008000 !important; color: #fff !important; transform: translateY(-5px); }
        .settings-trigger { position: absolute; bottom: 60px; left: 60px; width: 130px; height: 130px; background: #fff; border-radius: 50%; border: 6px solid #008000; display: flex; align-items: center; justify-content: center; font-size: 80px; z-index: 1001; cursor: pointer; transition: 0.6s; }
        .settings-trigger.active { transform: rotate(180deg); background: #008000; color: #fff; }
        .secret-trigger { position: absolute; bottom: 60px; left: 220px; width: 130px; height: 130px; border-radius: 50%; background: #333; color: #fff; border: 5px solid #444; font-size: 24px; font-weight: 900; display: none; align-items: center; justify-content: center; z-index: 1001; cursor: pointer; }
        .secret-trigger.active-mode { background: #000 !important; color: #00ff88 !important; border-color: #00ff88 !important; box-shadow: 0 0 40px rgba(0,255,136,0.6); }
        body.interface-dark .premium-card, body.interface-dark .modal-win, body.interface-dark .sub-modal { background: #080c08 !important; color: #00ff88 !important; border-color: #00ff88 !important; }
        body.interface-dark .eco-content label, body.interface-dark .eco-header { color: #00ff88 !important; }
        body.interface-dark .ui-btn { background: #121a12 !important; color: #00ff88 !important; border-bottom-color: #00ff8844 !important; }
        body.interface-dark .info-row { background: #111d11 !important; color: #fff !important; border-left-color: #00ff88 !important; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 20000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(25px); }
        .modal-win { width: 1300px; background: #fff; border-radius: 80px; padding: 80px; border-top: 40px solid #008000; position: relative; max-height: 95vh; overflow-y: auto; }
        .sub-modal { position: absolute; top: 0; left: 0; width: 100%; height: 100%; min-height: 100%; background: #fff; z-index: 30000 !important; border-radius: 80px; padding: 60px; display: none; box-sizing: border-box; border: 6px solid #008000; }
        .close-icon { position: absolute; top: 40px; right: 50px; cursor: pointer; font-size: 90px; color: #ccc; border:none; background:none; transition: 0.3s; line-height: 1; }
        .close-icon:hover { color: #ff0000; transform: rotate(90deg); }
        .switch { position: relative; display: inline-block; width: 85px; height: 45px; vertical-align: middle; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 50px; }
        .slider:before { position: absolute; content: ""; height: 37px; width: 37px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #008000 !important; }
        input:checked + .slider:before { transform: translateX(40px); }
    `;
    document.head.appendChild(style);
    const map = new ymaps.Map('map', { center: [64.562, 39.82], zoom: 14, controls: ['zoomControl'] });
    const response = await fetch('/api/objects');
    const root = await response.json();
    const db = root.data;
    const layers = { hM: [], hP: [], tB: [], tBZ: [], pl: [], pk: [] };

    window.openCamera = () => {
        window.openModal('🎥 ВИДЕОМОНИТОРИНГ', `<div style="text-align:center; padding: 50px;"><div style="width:150px; height:150px; border:15px solid #f3f3f3; border-top:15px solid #3498db; border-radius:50%; animation:spin 2s linear infinite; margin:auto;"></div><h2 style="font-size:55px; color:#3498db; margin-top:40px;">ПОДКЛЮЧЕНИЕ...</h2><p style="font-size:28px;">Узел Sever_Node_402 Offline.</p></div>`);
    };

    window.openComplaintAction = (addr) => {
        document.getElementById('m-content').innerHTML = `<h1 style="color:#d9534f; font-weight:900; font-size:70px;">🚨 ЖАЛОБА</h1><p style="font-size:35px; margin-bottom:50px;">Объект: <b>${addr}</b></p><input type="text" placeholder="Ваше ФИО" class="premium-card" style="width:100%; padding:40px; margin-bottom:25px; border:4px solid #eee; font-size:26px;"><input type="tel" placeholder="Телефон" class="premium-card" style="width:100%; padding:40px; margin-bottom:25px; border:4px solid #eee; font-size:26px;"><textarea class="premium-card" style="width:100%; height:300px; padding:40px; border:4px solid #eee; font-size:26px;" placeholder="Суть проблемы..."></textarea><button class="ui-btn" style="background:#008000; color:#fff; height:140px; font-size:40px; margin-top:50px;" onclick="alert('Принято!'); window.closeEverything();">ОТПРАВИТЬ</button>`;
        modal.style.display = "flex";
    };

    db.forEach(obj => {
        if (obj.id?.startsWith('h')) {
            const hHtml = `<div class="house-card-colossus"><img src="${obj.photo || ''}" class="house-main-img"><b style="font-size:45px; color:#008000; display:block; margin-bottom:25px; text-align:center;">🏢 ${obj.address}</b><div class="house-data-grid"><div><div class="info-row">🏗️ Год: ${obj.year}</div><div class="info-row">🧱 Стены: Кирпич</div><div class="info-row">📐 Площадь: ${obj.area || '10 882'} м²</div></div><div><div class="info-row">🏢 Этажей: ${obj.floors}</div><div class="info-row">📡 Falcon: Active</div><div class="info-row">🛠️ УК: Все Свои</div></div></div><div style="display:grid; grid-template-columns: 1fr 1fr; gap:25px; margin-top:30px;"><button class="ui-btn" style="background:#3498db; color:#fff;" onclick="window.openCamera()">КАМЕРА 📹</button><button class="ui-btn" style="background:#d9534f; color:#fff;" onclick="window.openComplaintAction('${obj.address}')">ЖАЛОБА 🚨</button></div></div>`;
            const m = new ymaps.Placemark(obj.coords, { balloonContent: hHtml }, { preset: 'islands#greenHomeCircleIcon', iconScale: 2.5, balloonMinWidth: 900, balloonMaxWidth: 900, balloonMinHeight: 800, balloonPanelMaxMapArea: 0 });
            layers.hM.push(m); map.geoObjects.add(m);
            if(obj.boundary) layers.hP.push(new ymaps.Polygon([obj.boundary], {}, { fillColor: '#00800015', strokeColor: '#008000', strokeWidth: 7 }));
            if (obj.infra) obj.infra.forEach(item => {
                const color = item.load < 66 ? '#00cc00' : '#ff3300';
                if (item.type.includes('bin')) {
                    const bHtml = `<div class="infra-card"><b style="font-size:40px; color:${color};">🗑️ ${item.title}</b><div class="info-row" style="border-left-color:${color}; margin-top:30px;">📊 Заполнение: ${item.load}%</div><div class="info-row" style="border-left-color:${color}">📐 1100 Литров</div></div>`;
                    layers.tB.push(new ymaps.Placemark(item.coords, { balloonContent: bHtml }, { preset: 'islands#trashIcon', iconColor: color, iconScale: 2 }));
                    layers.tBZ.push(new ymaps.Circle([item.coords, 3], {}, { fillColor: color + '25', strokeColor: color, strokeWidth: 3 }));
                } else if (item.type === 'parking') {
                    const pHtml = `<div class="infra-card"><b style="color:#00AAFF; font-size:40px;">🅿️ ${item.title}</b><p style="font-size:24px; margin:20px 0;">ИИ-контроль парковки.</p><div class="info-row" style="border-left-color:#00AAFF;">🚗 Мест: ${item.busySpots}/${item.totalSpots}</div></div>`;
                    layers.pk.push(new ymaps.Placemark(item.coords, { balloonContent: pHtml }, { preset: 'islands#parkingIcon', iconColor: '#00AAFF', iconScale: 2.2 }));
                } else if (item.type === 'playground') {
                    const lHtml = `<div class="infra-card"><b style="color:#008000; font-size:40px;">🎡 ${item.title}</b><p style="font-size:24px; margin:20px 0;">Сертификат ГОСТ.</p><div class="info-row">👶 Возраст: 3-12 лет</div></div>`;
                    layers.pl.push(new ymaps.Placemark(item.coords, { balloonContent: lHtml }, { preset: 'islands#greenFamilyIcon', iconScale: 2.2 }));
                }
            });
        }
    });

    const trData = db.find(o => o.type === 'truck_route');
    const truckMarker = new ymaps.Placemark(trData.path, {}, { preset: 'islands#oliveDeliveryIcon', iconScale: 3 });
    const routeLine = new ymaps.Polyline(trData.path, {}, { strokeColor: '#00FF88', strokeWidth: 15, opacity: 0.4 });
    let seg = 0, prog = 0; setInterval(() => {
        prog += 0.005; if (prog >= 1) { prog = 0; seg = (seg + 1) % (trData.path.length - 1); }
        const [lat1, lon1] = trData.path[seg], [lat2, lon2] = trData.path[seg+1];
        truckMarker.geometry.setCoordinates([lat1 + (lat2-lat1)*prog, lon1 + (lon2-lon1)*prog]);
    }, 50);
    const modal = document.createElement('div'); modal.className = "modal-overlay"; 
    modal.innerHTML = `<div class="modal-win premium-card" id="m-win-body"><button class="close-icon" onclick="window.closeEverything()">&times;</button><div id="m-content"></div><div class="sub-modal" id="sub-modal-body"></div></div>`;
    document.body.appendChild(modal);

    window.closeEverything = () => { document.getElementById('sub-modal-body').style.display="none"; modal.style.display="none"; };
    window.openModal = (t, h) => { document.getElementById('m-content').innerHTML = `<h1 style="color:#008000; font-weight:900; font-size:65px; margin-bottom:60px;">${t}</h1>${h}`; modal.style.display = "flex"; };
    window.openSub = (title, text) => {
        const sub = document.getElementById('sub-modal-body');
        sub.innerHTML = `<button class="close-icon" onclick="this.parentElement.style.display='none'">&times;</button><h1 style="color:#008000; font-weight:900; font-size:60px; margin-bottom:45px;">${title}</h1><div style="font-size:32px; line-height:1.9;">${text}</div><button class="ui-btn" style="background:#008000; color:#fff; width:500px; height:120px; margin-top:60px;" onclick="this.parentElement.style.display='none'">ВЕРНУТЬСЯ</button>`;
        sub.style.display = "block";
    };

    window.openEcoGuide = () => {
        const full = `<div class="info-row"><b>💳 1. Секреты Экономии:</b> Сминайте ПЭТ.</div><div class="info-row"><b>🚫 2. Стоп-Лист:</b> Без бетона.</div><div class="info-row"><b>📡 3. Falcon Smart:</b> Датчики 15 мин.</div><div class="info-row"><b>♻️ 4. Рециклинг:</b> Пластик в лавочки.</div><div class="info-row"><b>🚛 5. Логистика:</b> Вывоз 07:30.</div>`;
        window.openModal('🍃 ЭКО-ГИД v8.1', full);
    };

    window.runAction = (act) => {
        if(act === 'sat') map.setType('yandex#hybrid');
        else if(act === 'map') map.setType('yandex#map');
        else if(act === 'reboot') location.reload();
        else if(act === 'theme') document.body.classList.toggle('interface-dark');
        else if(act === 'dev') {
            window.openSub('🔄 ОБНОВЛЕНИЕ', '<div style="text-align:center;"><div class="loader-spin" style="width:100px; height:100px; border:10px solid #f3f3f3; border-top:10px solid #008000; border-radius:50%; animation:spin 1s linear infinite; margin:auto;"></div><p style="font-size:35px;">Загрузка...</p></div>');
            setTimeout(() => window.openSub('✅ ГОТОВО', 'Система актуальна.'), 2000);
        }
    };

    window.refreshL = () => {
        const id = (i) => document.getElementById(i);
        const c = { h: id('l-h').checked, p: id('l-p').checked, t: id('l-t').checked, pl: id('l-pl').checked, pk: id('l-pk').checked, tr: id('l-tr').checked };
        layers.hM.forEach(m => c.h ? map.geoObjects.add(m) : map.geoObjects.remove(m));
        layers.hP.forEach(p => c.p ? map.geoObjects.add(p) : map.geoObjects.remove(p));
        layers.tB.forEach(b => c.t ? map.geoObjects.add(b) : map.geoObjects.remove(b));
        layers.tBZ.forEach(z => c.t ? map.geoObjects.add(z) : map.geoObjects.remove(z));
        layers.pl.forEach(l => c.pl ? map.geoObjects.add(l) : map.geoObjects.remove(l));
        layers.pk.forEach(k => c.pk ? map.geoObjects.add(k) : map.geoObjects.remove(k));
        c.tr ? (map.geoObjects.add(truckMarker), map.geoObjects.add(routeLine)) : (map.geoObjects.remove(truckMarker), map.geoObjects.remove(routeLine));
    };

    const gui = document.createElement('div'); gui.id = "eco-panel-root"; gui.className = "premium-card";
    gui.innerHTML = `<div class="eco-header">🌿 ЭКОСИСТЕМА ДВОРА</div><div class="eco-content"><label>Дома 🏢 <span class="switch"><input type="checkbox" id="l-h" checked onchange="refreshL()"><span class="slider"></span></span></label><label>Границы 📐 <span class="switch"><input type="checkbox" id="l-p" onchange="refreshL()"><span class="slider"></span></span></label><label>Мусорки 🗑️ <span class="switch"><input type="checkbox" id="l-t" onchange="refreshL()"><span class="slider"></span></span></label><label>Площадки 🎡 <span class="switch"><input type="checkbox" id="l-pl" onchange="refreshL()"><span class="slider"></span></span></label><label>Стоянки 🅿️ <span class="switch"><input type="checkbox" id="l-pk" onchange="refreshL()"><span class="slider"></span></span></label><label>Техника 🚛 <span class="switch"><input type="checkbox" id="l-tr" onchange="refreshL()"><span class="slider"></span></span></label></div>`; 
    document.body.appendChild(gui);

    const sBtn = document.createElement('button'); sBtn.className = "settings-trigger"; sBtn.innerHTML = `⚙️`; document.body.appendChild(sBtn);
    const secBtn = document.createElement('button'); secBtn.innerText = "ДОП"; secBtn.className = "secret-trigger"; document.body.appendChild(secBtn);
    
    const tBox = document.createElement('div'); tBox.id = "settings-panel-root"; tBox.className = "premium-card";
    // ФИКС ФОНА: Добавлено background: rgba(255,255,255,0.98)
    Object.assign(tBox.style, { position: "absolute", bottom: "250px", left: "70px", width: "550px", padding: "60px", display: "none", zIndex: "1000", borderTop: "30px solid #008000", background: "rgba(255,255,255,0.98)" });
    tBox.innerHTML = `<button class="ui-btn" onclick="openEcoGuide()">📖 ЭКО-ГИД</button><button class="ui-btn" onclick="runAction('map')">🗺️ КАРТА</button><button class="ui-btn" onclick="runAction('sat')">🛰️ СПУТНИК</button><button class="ui-btn" onclick="runAction('theme')">🌙 ТЕМА</button><label style="display:flex;justify-content:space-between;align-items:center;font-size:22px;font-weight:900;margin-top:40px;color:#666">ENGINEERING <span class="switch"><input type="checkbox" onchange="document.querySelector('.secret-trigger').style.display = this.checked ? 'flex' : 'none'"><span class="slider"></span></span></label>`;
    document.body.appendChild(tBox); 

    sBtn.onclick = () => { const open = tBox.style.display === "block"; tBox.style.display = open ? "none" : "block"; sBtn.classList.toggle('active', !open); };
    secBtn.onclick = () => {
        secBtn.classList.toggle('active-mode');
        document.getElementById('m-content').innerHTML = `
            <h1 style="color:#00ff88; text-align:center; font-size:65px;">STATION CONTROL</h1>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:25px; margin-top:50px;">
                <button class="ui-btn" onclick="window.openSub('📞 УК ВСЕ СВОИ', 'Диспетчерская (24/7):<br><b>+7 (921) 482-85-50</b>')">📞 НОМЕР УК</button>
                <button class="ui-btn" onclick="window.open('https://vk.com')">👨‍💻 РАЗРАБОТЧИК</button>
                <button class="ui-btn" onclick="runAction('dev')">🔄 ОБНОВЛЕНИЯ</button>
                <button class="ui-btn" onclick="window.openSub('🧹 ОЧИСТКА КЭША', 'Системный дамп ГИС очищен.')">🧹 CLEAN КЭШ</button>
                <button class="ui-btn" onclick="window.openSub('🔐 CRYPTO', 'Ключи обновлены.')">🔐 SSL KEY</button>
                <button class="ui-btn" onclick="window.openSub('🚜 TRAFFIC', 'Приоритет мусоровозов подан.')">🚜 TRAFFIC</button>
                <button class="ui-btn" onclick="window.openSub('📊 АНАЛИТИКА', '11 домов передают данные.')">📊 СТАТУС</button>
                <button class="ui-btn" onclick="window.openSub('🔥 ТЕПЛО', 'Карта наложена.')">🔥 HEATMAP</button>
                <button class="ui-btn" onclick="window.openSub('⚡ FORCE SCAN', 'Все датчики: 100% OK.')">⚡ FORCE SCAN</button>
                <button class="ui-btn" onclick="runAction('reboot')">♻️ REBOOT SITE</button>
                <button class="ui-btn" style="background:#d9534f; color:#fff; grid-column: span 2;" onclick="window.closeEverything()">❌ ВЫХОД</button>
            </div>`;
        modal.style.display = "flex";
    };
    refreshL();
}
