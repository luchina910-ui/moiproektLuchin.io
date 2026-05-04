/**
 * ГИС ООО «УК «ВСЕ СВОИ» | Luchin Ivan 1.6.0 PLATINUM FINAL
 * UPDATED: Unified Guide, Fixed Cameras, Adjustable Eco-Panel.
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
        
        .premium-card { background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(25px); border-radius: 45px; border: 2px solid rgba(0, 128, 0, 0.1); box-shadow: 0 15px 45px rgba(0,0,0,0.1); }
        
        /* --- ПАНЕЛЬ ЭКОСИСТЕМЫ (НАСТРОЙКА ВЫСОТЫ ТУТ) --- */
        #eco-panel-root { 
            position: absolute !important; top: 30px !important; right: 30px !important; 
            width: 330px; z-index: 10000; height: 70px; overflow: hidden; 
            border: 3px solid #008000; transition: 0.5s cubic-bezier(0.165, 0.84, 0.44, 1); 
        }
        #eco-panel-root:hover { 
            /* МЕНЯЙ 'auto' НА ЧИСЛО (например 400px), ЕСЛИ ХОЧЕШЬ ФИКСИРОВАННУЮ ВЫСОТУ */
            height: auto; 
            padding-bottom: 25px; 
            background: #fff; 
        }
        .eco-header { height: 70px; display: flex; align-items: center; justify-content: center; color: #008000; font-weight: 900; font-size: 15px; text-transform: uppercase; cursor: pointer; letter-spacing: 2px; }
        .eco-content { padding: 0 30px; display: flex; flex-direction: column; gap: 15px; opacity: 0; transition: 0.3s; }
        #eco-panel-root:hover .eco-content { opacity: 1; }
        .eco-content label { display: flex; align-items: center; justify-content: space-between; font-size: 15px; font-weight: 800; color: #111; cursor: pointer; }

        /* ОКНА И СКРОЛЛ */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 20000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(15px); }
        .modal-win { width: 1000px; background: #fff; border-radius: 60px; padding: 55px; border-top: 25px solid #008000; position: relative; height: auto; max-height: 90vh; overflow-y: auto; box-sizing: border-box; }
        .sub-modal { position: absolute; top: 0; left: 0; width: 100%; height: 100%; min-height: 100%; background: #fff; z-index: 30000 !important; border-radius: 60px; padding: 60px; display: none; box-sizing: border-box; overflow-y: auto; border: 4px solid #008000; }
        
        .close-icon { position: absolute; top: 30px; right: 40px; cursor: pointer; font-size: 60px; color: #ddd; z-index: 40000; transition: 0.3s; line-height: 1; border:none; background:none; }
        .close-icon:hover { color: #ff0000 !important; transform: rotate(90deg); }

        .house-card { width: 420px; max-height: 550px; overflow-y: auto; padding-right: 15px; }
        .house-card::-webkit-scrollbar, .modal-win::-webkit-scrollbar { width: 8px; }
        .house-card::-webkit-scrollbar-thumb, .modal-win::-webkit-scrollbar-thumb { background: #00800033; border-radius: 10px; }

        .info-row { background: #f9fbf9; padding: 18px; border-radius: 25px; border-left: 10px solid #008000; font-size: 15px; font-weight: 800; margin-bottom: 12px; color: #222; text-align: left; }
        .ui-btn { width: 100%; padding: 20px; margin-bottom: 12px; border-radius: 25px; border: none; background: #f4f7f4; color: #111; font-weight: 900; font-size: 13px; text-transform: uppercase; border-bottom: 5px solid #dce4de; cursor: pointer; text-align: center; }
        .ui-btn:hover { background: #008000; color: #fff; transform: translateY(-4px); }

        .settings-trigger { position: absolute; bottom: 35px; left: 25px; width: 90px; height: 90px; background: #fff; border-radius: 50%; border: 3px solid #008000; box-shadow: 0 10px 30px rgba(0,0,0,0.1); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 50px; z-index: 1001; transition: 0.6s; }
        .settings-trigger.active-gear { transform: rotate(180deg); background: #008000; color: #fff; }
        #settings-panel-root { position: absolute; bottom: 140px; left: 25px; width: 400px; padding: 30px; display: none; border-top: 10px solid #008000; z-index: 1000; border-radius: 45px; }
        
        .secret-trigger { position: absolute; bottom: 35px; left: 140px; width: 90px; height: 90px; background: #000; color: #00ff88; border: 2px solid #00ff88; border-radius: 50%; display: none; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; cursor: pointer; z-index: 1001; animation: pulseGlow 2s infinite; text-align:center; }

        .guide-section { border-bottom: 2px solid #eee; padding-bottom: 40px; margin-bottom: 40px; }
        .guide-section:last-child { border-bottom: none; }

        .switch { position: relative; display: inline-block; width: 50px; height: 26px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 30px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #008000; }
        input:checked + .slider:before { transform: translateX(24px); }

        body.interface-dark .premium-card, body.interface-dark .modal-win, body.interface-dark .sub-modal { background: #0a110a !important; color: #00ff88 !important; border-color: #00ff88 !important; }
        body.interface-dark .ui-btn { background: #121a12 !important; color: #00ff88 !important; border-bottom-color: #00ff8844 !important; }
        body.interface-dark .info-row { background: #152215 !important; color: #fff !important; }
        @keyframes pulseGlow { 0% { box-shadow: 0 0 0 0 rgba(0,255,136,0.6); } 70% { box-shadow: 0 0 0 30px rgba(0,255,136,0); } 100% { box-shadow: 0 0 0 0 rgba(0,255,136,0); } }
    `;
    document.head.appendChild(style);
    const map = new ymaps.Map('map', { center: [64.562, 39.82], zoom: 14, controls: ['zoomControl'] });
    const response = await fetch('/api/objects');
    const root = await response.json();
    const db = root.data;
    const layers = { hM: [], hP: [], tB: [], tBZ: [], pL: [], pK: [], tr: [] };

    window.openCamera = () => {
        window.openModal('🎥 ВИДЕОПОТОК: ОШИБКА', `
            <div style="text-align:center; padding: 20px;">
                <div class="loader-spin" style="border-top-color:#d9534f; width:80px; height:80px;"></div>
                <h2 style="color:#d9534f; font-weight:900; font-size:32px; margin-top:25px;">СВЯЗЬ ПРЕРВАНА</h2>
                <div class="info-row" style="border-left-color:#d9534f; text-align:left; margin-top:30px;">
                    <b>Статус:</b> Offline (Node_402_Severodvinsk)<br>
                    <b>Причина:</b> Ведутся плановые работы ПАО "Ростелеком" по замене оборудования. Доступ будет восстановлен через 140 минут.
                </div>
            </div>`);
    };

    db.filter(o => o.id?.startsWith('h')).forEach(house => {
        const hHtml = `
            <div class="house-card">
                <img src="${house.photo || ''}" style="width:100%; height:230px; object-fit:cover; border-radius:35px; margin-bottom:20px; border:3px solid #00800011;">
                <b style="font-size:26px; color:#008000; display:block; margin-bottom:15px; letter-spacing:-1px;">🏠 ${house.address}</b>
                <div class="info-row">🏗️ Постройка: <b>${house.year} год</b></div>
                <div class="info-row">🏢 Конструктив: <b>${house.floors} этажей</b></div>
                <div class="info-row">📐 Общая площадь: <b>${house.area || '10 882'} м²</b></div>
                <button class="ui-btn" style="background:#3498db; color:#fff; border:none;" onclick="openCamera()">КАМЕРЫ ПОДЪЕЗДА 📹</button>
                <button class="ui-btn" style="background:#d9534f; color:#fff; border:none; height:70px;" onclick="openComplaint('${house.address}')">🚨 ОФОРМИТЬ ЖАЛОБУ</button>
            </div>`;
        
        const m = new ymaps.Placemark(house.coords, { balloonContent: hHtml }, { preset: 'islands#greenHomeCircleIcon', iconScale: 1.6 });
        layers.hM.push(m); map.geoObjects.add(m);

        if(house.boundary) layers.hP.push(new ymaps.Polygon([house.boundary], {}, { fillColor: '#00800010', strokeColor: '#008000', strokeWidth: 4 }));
        
        if (house.infra) house.infra.forEach(item => {
            if (item.type.includes('bin')) {
                const color = item.load < 33 ? '#00cc00' : (item.load < 66 ? '#ff9900' : '#ff3300');
                const bHtml = `
                    <div style="width:320px; padding:15px;">
                        <b style="color:${color}; font-size:22px; display:block; margin-bottom:15px;">🗑️ ${item.title}</b>
                        <div class="info-row" style="border-left-color:${color}">📡 Falcon Smart v2</div>
                        <div class="info-row" style="border-left-color:${color}">📦 HDPE Пластик</div>
                        <div class="info-row" style="border-left-color:${color}">📐 Объем: 1100 литров</div>
                        <div class="info-row" style="background:${color}15; border-left-color:${color}">📊 Заполнение: <b>${item.load}%</b></div>
                    </div>`;
                layers.tB.push(new ymaps.Placemark(item.coords, { balloonContent: bHtml }, { preset: 'islands#trashIcon', iconColor: color, iconScale: 1.1 }));
                layers.tBZ.push(new ymaps.Circle([item.coords, 2.5], {}, { fillColor: color + '25', strokeColor: color, strokeWidth: 2 }));
            } else if (item.type === 'parking') {
                const pHtml = `<div style="width:360px; padding:15px;"><b style="font-size:22px; color:#00AAFF; display:block; margin-bottom:15px;">🅿️ ${item.title}</b><div class="info-row" style="margin-top:15px; border-left-color:#00AAFF;">🚗 Занято: <b>${item.busySpots}/${item.totalSpots}</b></div><button class="ui-btn" style="background:#3498db; color:#fff; border:none; margin-top:15px;" onclick="openCamera()">ПРОСМОТР КАМЕР 📹</button></div>`;
                layers.pK.push(new ymaps.Placemark(item.coords, { balloonContent: pHtml }, { preset: 'islands#parkingIcon', iconColor: '#00AAFF' }));
            } else if (item.type === 'playground') {
                const lHtml = `<div style="width:360px; padding:15px;"><b style="font-size:22px; color:#008000; display:block; margin-bottom:15px;">🎡 ${item.title}</b><div class="info-row" style="margin-top:10px;">👶 Возраст: <b>${item.ageLimit}</b></div><div class="info-row">🛡️ ГОСТ 52169</div><button class="ui-btn" style="background:#3498db; color:#fff; border:none; margin-top:10px;" onclick="openCamera()">ПРОСМОТР КАМЕР 📹</button></div>`;
                layers.pL.push(new ymaps.Placemark(item.coords, { balloonContent: lHtml }, { preset: 'islands#greenFamilyIcon' }));
            }
        });
    });

    const trData = db.find(o => o.type === 'truck_route');
    const truckMarker = new ymaps.Placemark(trData.path, {}, { preset: 'islands#oliveDeliveryIcon', zIndex: 12000 });
    const routeLine = new ymaps.Polyline(trData.path, {}, { strokeColor: '#00FF88', strokeWidth: 5, opacity: 0.5 });
    let seg = 0, prog = 0;
    setInterval(() => {
        prog += 0.005; if (prog >= 1) { prog = 0; seg = (seg + 1) % (trData.path.length - 1); }
        const [lat1, lon1] = trData.path[seg], [lat2, lon2] = trData.path[seg+1];
        truckMarker.geometry.setCoordinates([lat1 + (lat2-lat1)*prog, lon1 + (lon2-lon1)*prog]);
    }, 50);
    const modal = document.createElement('div'); modal.className = "modal-overlay"; 
    modal.innerHTML = `<div class="modal-win premium-card" id="m-win-body"><button class="close-icon" onclick="window.closeEverything()">&times;</button><div id="m-content"></div><div class="sub-modal" id="sub-modal-body"></div></div>`;
    document.body.appendChild(modal);

    window.closeEverything = () => { document.getElementById('sub-modal-body').style.display="none"; modal.style.display="none"; };
    window.openModal = (t, h) => { document.getElementById('m-content').innerHTML = `<h1 style="color:#008000; font-weight:900; margin-bottom:40px;">${t}</h1>${h}`; modal.style.display = "flex"; };

    // --- ЕДИНЫЙ ЭКО-ГИД (ВСЕ СОВЕТЫ НА ОДНОЙ СТРАНИЦЕ) ---
    window.openEcoGuide = () => {
        const fullContent = `
            <div class="guide-section">
                <h2 style="color:#008000;">💳 1. Секреты Экономии на ЖКУ</h2>
                <p>Плата за вывоз ТКО напрямую зависит от логистики. Если мусоровоз делает лишние рейсы из-за "воздуха" в баках, тариф растет.</p>
                <div class='info-row'><b>Сминайте ПЭТ-бутылки:</b> Одна немятая бутылка занимает место 5 сжатых. Мусоровоз везет воздух, а платите вы. Разбирайте картонные коробки до плоских листов.</div>
            </div>
            <div class="guide-section">
                <h2 style="color:#008000;">🚫 2. Полный Стоп-Лист отходов</h2>
                <p>Нарушение правил ведет к поломке техники ценой 450к руб и штрафам до 5000 руб.</p>
                <div class='info-row'><b>Запрещено:</b> Бетон, кирпич, плиточный клей. Автомобильные шины (резина блокирует поршни). Ртутные лампы (отравляют воздух во дворе).</div>
            </div>
            <div class="guide-section">
                <h2 style="color:#008000;">📡 3. Технологии Falcon Smart v2</h2>
                <p>Под крышкой каждого бака УК «ВСЕ СВОИ» установлен лазерный сенсор Falcon. Он замеряет уровень мусора каждые 15 минут.</p>
                <div class='info-row'>Если бак в приложении горит КРАСНЫМ — машина уже получила сигнал и скоро приедет. Не создавайте навалы рядом!</div>
            </div>
            <div class="guide-section">
                <h2 style="color:#008000;">♻️ 4. Рециклинг и Переработка</h2>
                <p>Пластик из сеток не едет на свалку. Его дробят в хлопья, плавят и превращают в лавочки и урны, которые мы ставим в ваших же дворах.</p>
            </div>
            <div class="guide-section">
                <h2 style="color:#008000;">🚛 5. Логистика и Парковка</h2>
                <p>График вывоза: С 07:30 до 11:00. Если проезд заблокирован вашим авто, вывоз переносится на 24 часа. Пожалуйста, не паркуйтесь у баков!</p>
            </div>
            <div class="guide-section">
                <h2 style="color:#008000;">🏗️ 6. Утилизация Крупногабарита</h2>
                <p>Мебель и технику запрещено класть в маленькие баки. Для них нужны бункеры 8м³ "Лодка".</p>
            </div>
            <div class="guide-section">
                <h2 style="color:#008000;">🏠 7. Зона ответственности УК</h2>
                <p>Мы отвечаем за: чистоту основания, исправность крышек и колес. Если бак сломан — жмите "Жалоба" в меню дома.</p>
            </div>
            <div class="guide-section">
                <h2 style="color:#008000;">💧 8. Мойка и Дезинфекция</h2>
                <p>Дважды в год мы моем все баки спец-раствором под давлением 150 бар. Это уничтожает 99.9% бактерий.</p>
            </div>
            <div class="guide-section">
                <h2 style="color:#008000;">🌟 9. Будущее Smart-City</h2>
                <p>Скоро: датчики качества воздуха и мониторинг уличных фонарей в вашем приложении!</p>
            </div>
        `;
        window.openModal('🍃 ПОЛНЫЙ ЭКО-ГИД СЕВЕРОДВИНСКА', fullContent);
    };

    window.openComplaint = (addr) => {
        document.getElementById('m-content').innerHTML = `<h1>🚨 НОВАЯ ЖАЛОБА</h1><p>Объект: <b>${addr}</b></p><input type="text" placeholder="ФИО" class="ui-btn" style="text-align:left; background:#fff;"><input type="tel" placeholder="Телефон" class="ui-btn" style="text-align:left; background:#fff;"><textarea class="ui-btn" style="height:100px; text-align:left; background:#fff;" placeholder="Суть..."></textarea><button class="ui-btn" style="background:#008000; color:#fff; border:none;" onclick="alert('✅ Отправлено!'); window.closeEverything();">ОТПРАВИТЬ</button>`;
        modal.style.display = "flex";
    };

    window.runAction = (act) => {
        if(act === 'sat') map.setType('yandex#hybrid');
        else if(act === 'map') map.setType('yandex#map');
        else if(act === 'reboot') location.reload();
        else if(act === 'dev') alert('Система v1.6.0-PLATINUM готова.');
    };

    window.refreshL = () => {
        const id = (i) => document.getElementById(i);
        const c = { h: id('l-h').checked, p: id('l-p').checked, t: id('l-t').checked, pl: id('l-pl').checked, pk: id('l-pk').checked, tr: id('l-tr').checked };
        layers.hM.forEach(m => c.h ? map.geoObjects.add(m) : map.geoObjects.remove(m));
        layers.hP.forEach(p => c.p ? map.geoObjects.add(p) : map.geoObjects.remove(p));
        layers.tB.forEach(b => c.t ? map.geoObjects.add(b) : map.geoObjects.remove(b));
        layers.tBZ.forEach(z => c.t ? map.geoObjects.add(z) : map.geoObjects.remove(z));
        layers.pL.forEach(l => c.pl ? map.geoObjects.add(l) : map.geoObjects.remove(l));
        layers.pK.forEach(k => c.pk ? map.geoObjects.add(k) : map.geoObjects.remove(k));
        c.tr ? (map.geoObjects.add(truckMarker), map.geoObjects.add(routeLine)) : (map.geoObjects.remove(truckMarker), map.geoObjects.remove(routeLine));
    };

    function id(i) { return document.getElementById(i); }
    const gui = document.createElement('div'); gui.id = "eco-panel-root"; gui.className = "premium-card";
    gui.innerHTML = `<div class="eco-header">🌿 ЭКОСИСТЕМА ДВОРА</div><div class="eco-content">
        <label>Дома <span class="switch"><input type="checkbox" id="l-h" checked onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Границы <span class="switch"><input type="checkbox" id="l-p" onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Мусорки <span class="switch"><input type="checkbox" id="l-t" onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Площадки <span class="switch"><input type="checkbox" id="l-pl" onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Стоянки <span class="switch"><input type="checkbox" id="l-pk" onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Техника <span class="switch"><input type="checkbox" id="l-tr" onchange="refreshL()"><span class="slider"></span></span></label>
    </div>`; 
    document.body.appendChild(gui);

    const sBtn = document.createElement('button'); sBtn.className = "settings-trigger"; sBtn.innerHTML = `⚙️`; document.body.appendChild(sBtn);
    const secBtn = document.createElement('button'); secBtn.className = "secret-trigger"; secBtn.innerText = "STATION"; document.body.appendChild(secBtn);
    
    const tBox = document.createElement('div'); tBox.id = "settings-panel-root"; tBox.className = "premium-card";
    tBox.innerHTML = `
        <button class="ui-btn" onclick="openEcoGuide()">📖 ЭКО-ГИД</button>
        <button class="ui-btn" onclick="runAction('map')">🗺️ КАРТА ГОРОДА</button>
        <button class="ui-btn" onclick="runAction('sat')">🛰️ СПУТНИКОВЫЙ ВИД</button>
        <button class="ui-btn" onclick="document.body.classList.toggle('interface-dark')">🌙 ТЕМА</button>
        <label style="display:flex;justify-content:space-between;align-items:center;font-size:10px;font-weight:900;margin-top:15px;color:#666">
            ENGINEERING <span class="switch"><input type="checkbox" onchange="document.querySelector('.secret-trigger').style.display = this.checked ? 'flex' : 'none'"><span class="slider"></span></span>
        </label>`;
    document.body.appendChild(tBox);
    
    sBtn.onclick = () => { tBox.style.display = tBox.style.display === "block" ? "none" : "block"; sBtn.classList.toggle('active-gear'); };
    secBtn.onclick = () => {
        document.getElementById('m-content').innerHTML = `<h1 style="color:#00ff88; text-align:center;">STATION CONTROL</h1><div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:15px; margin-top:20px;">
            <button class="ui-btn" onclick="runAction('dev')">🔄 UPDATE</button><button class="ui-btn" onclick="alert('Ping: 4ms')">📡 PING</button><button class="ui-btn" onclick="alert('Logs clean')">🧹 CLEAN</button>
            <button class="ui-btn" onclick="alert('Heatmap ready')">🔥 HEAT</button><button class="ui-btn" onclick="alert('Contacts: 55-00-00')">📞 INFO</button><button class="ui-btn" onclick="window.open('https://vk.com')">🌐 VK ADM</button>
                <button class="ui-btn" onclick="runAction('reboot')">♻️ REBOOT</button>
                <button class="ui-btn" onclick="alert('Системный дамп сохранен в облако.')">📸 DUMP</button>
                <button class="ui-btn" onclick="alert('Принудительный опрос Falcon v2...')">⚡ FORCE</button>
                <button class="ui-btn" onclick="alert('Приоритет спецтехники активирован.')">🚜 TRAFFIC</button>
                <button class="ui-btn" onclick="alert('Протоколы шифрования обновлены.')">🔐 KEY</button>
                <button class="ui-btn" style="background:#d9534f; color:#fff;" onclick="window.closeEverything()">❌ EXIT</button>
            </div>
            <div style="margin-top:20px; font-family:monospace; font-size:10px; opacity:0.5; text-align:center;">
                SYSTEM_BUILD_2024_0.1.6.0_STABLE_VERSION
            </div>
        `;
        modal.style.display = "flex";
    };

    // --- ФИНАЛЬНАЯ ИНИЦИАЛИЗАЦИЯ ---
    refreshL();
    console.log("🚀 ГИС ООО УК «ВСЕ СВОИ» v1.6.0 PLATINUM FINAL запущена.");
}

