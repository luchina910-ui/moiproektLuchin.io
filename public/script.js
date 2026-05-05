/**
 * ГИС ООО «УК «ВСЕ СВОИ» | v0.1 betta
 */

ymaps.ready(initIndustrialGis);

async function initIndustrialGis() {
    const font = document.createElement('link');
    font.href = 'https://googleapis.com';
    font.rel = 'stylesheet'; document.head.appendChild(font);

    const style = document.createElement('style');
    style.innerHTML = `
        body, button, input, select, div, textarea { font-family: 'Montserrat', sans-serif !important; font-size: 16px; transition: 0.3s; }
        #map { width: 100vw; height: 100vh; background: #e5e3de; }
        
        .premium-card { 
            background: rgba(255, 255, 255, 0.98) !important; 
            backdrop-filter: blur(25px); 
            border-radius: 35px; 
            border: 3px solid rgba(0, 128, 0, 0.15); 
            box-shadow: 0 20px 50px rgba(0,0,0,0.1); 
        }
        
        /* КАРТОЧКА ДОМА (480x600) */
        .house-card-pro { width: 400px !important; height: 500px !important; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; }
        .house-img-pro { width: 100%; height: 240px; object-fit: cover; border-radius: 25px; border: 4px solid #eee; margin-bottom: 20px; }
        
        .info-row { background: #f9fbf9; padding: 16px 20px; border-radius: 20px; border-left: 10px solid #008000; font-size: 14px; font-weight: 800; margin-bottom: 10px; color: #222; }
        .ui-btn { width: 100%; padding: 20px; border-radius: 25px; border: none; background: #f4f7f4; color: #111; font-weight: 900; font-size: 13px; text-transform: uppercase; border-bottom: 6px solid #dce4de; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .ui-btn:hover { background: #008000 !important; color: #fff !important; transform: translateY(-4px); }

        /* ЭКОСИСТЕМА */
        #eco-panel-root { position: absolute !important; top: 30px; right: 30px; width: 340px; z-index: 10000; height: 75px; overflow: hidden; border: 4px solid #008000; border-radius: 35px; transition: 0.5s ease; }
        #eco-panel-root:hover { height: auto; padding-bottom: 25px; }
        .eco-header { height: 75px; display: flex; align-items: center; justify-content: center; color: #008000; font-weight: 900; font-size: 16px; text-transform: uppercase; cursor: pointer; }
        .eco-content { padding: 0 40px; display: flex; flex-direction: column; gap: 15px; opacity: 0; }
        #eco-panel-root:hover .eco-content { opacity: 1; }
        .eco-content label { display: flex; align-items: center; justify-content: space-between; font-size: 15px; font-weight: 800; color: #111; cursor: pointer; }

        /* НАСТРОЙКИ */
        .settings-trigger { position: absolute; bottom: 40px; left: 40px; width: 95px; height: 95px; background: #fff; border-radius: 50%; border: 5px solid #008000; display: flex; align-items: center; justify-content: center; font-size: 55px; z-index: 1001; cursor: pointer; transition: 0.6s; }
        .settings-trigger.active { transform: rotate(180deg); background: #008000; color: #fff; }
        .secret-trigger { position: absolute; bottom: 40px; left: 160px; width: 95px; height: 95px; border-radius: 50%; background: #333; color: #fff; border: 4px solid #444; font-size: 16px; font-weight: 900; display: none; align-items: center; justify-content: center; z-index: 1001; cursor: pointer; }
        .secret-trigger.active-mode { background: #000 !important; color: #00ff88 !important; border-color: #00ff88 !important; box-shadow: 0 0 30px rgba(0,255,136,0.6); }

        /* ТЕМА */
        body.interface-dark .premium-card, body.interface-dark .modal-win, body.interface-dark .sub-modal, body.interface-dark #settings-panel-root, body.interface-dark #eco-panel-root { background: #080c08 !important; color: #00ff88 !important; border-color: #00ff88 !important; }
        body.interface-dark .info-row { background: #111d11 !important; color: #fff !important; border-left-color: #00ff88 !important; }
        body.interface-dark .ui-btn { background: #152015 !important; color: #00ff88 !important; border-bottom-color: #00ff8833 !important; }
        body.interface-dark .eco-content label, body.interface-dark .eco-header { color: #00ff88 !important; }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 20000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(15px); }
        .modal-win { width: 1000px; background: #fff; border-radius: 70px; padding: 70px; border-top: 30px solid #008000; position: relative; max-height: 95vh; overflow-y: auto; }
        .sub-modal { position: absolute; top: 0; left: 0; width: 100%; height: 100%; min-height: 100%; background: #fff; z-index: 30000 !important; border-radius: 70px; padding: 60px; display: none; box-sizing: border-box; border: 6px solid #008000; }
        .close-icon { position: absolute; top: 30px; right: 50px; cursor: pointer; font-size: 80px; color: #ccc; border:none; background:none; line-height: 1; }

        .switch { position: relative; display: inline-block; width: 70px; height: 38px; vertical-align: middle; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 40px; }
        .slider:before { position: absolute; content: ""; height: 30px; width: 30px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #008000 !important; }
        input:checked + .slider:before { transform: translateX(32px); }
    `;
    document.head.appendChild(style);
    const map = new ymaps.Map('map', { center: [64.562, 39.82], zoom: 14, controls: ['zoomControl'] });
    const response = await fetch('/api/objects');
    const root = await response.json();
    const db = root.data;
    const layers = { hM: [], hP: [], tB: [], tBZ: [], pl: [], pk: [] };

    window.openCamera = () => {
        window.openModal('🎥 Камера наблюдения', `<div style="text-align:center;"><div style="width:100px; height:100px; border:10px solid #f3f3f3; border-top:10px solid #3498db; border-radius:50%; animation:spin 1s linear infinite; margin:auto;"></div><h2 style="font-size:35px; color:#3498db; margin-top:30px;">Идёт подключение...</h2><p>Node_402 Offline.</p></div>`);
    };

    window.openComplaintAction = (addr) => {
        const content = document.getElementById('m-content');
        content.innerHTML = `
            <h1 style="color:#d9534f; font-weight:900; font-size:55px; margin-bottom:10px;">🚨 ОФОРМЛЕНИЕ ЖАЛОБЫ</h1>
            <p style="font-size:24px; margin-bottom:35px;">Объект: <b style="color:#008000;">${addr}</b></p>

            <!-- Блок ФИО и Телефон -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">
                <input type="text" id="f-fio" placeholder="Ваше полное ФИО" class="premium-card" 
                    style="width:100%; padding:25px; border:2px solid #eee; font-size:18px; box-sizing:border-box; outline:none;">
                
                <input type="tel" id="f-tel" placeholder="Номер телефона для связи" class="premium-card" 
                    style="width:100%; padding:25px; border:2px solid #eee; font-size:18px; box-sizing:border-box; outline:none;">
            </div>

            <!-- Блок выбора причины -->
            <div style="margin-bottom:20px;">
                <label style="display:block; font-size:16px; font-weight:800; margin-bottom:10px; color:#888; text-transform:uppercase;">Возможная причина:</label>
                <select id="f-reason" class="premium-card" 
                    style="width:100%; padding:25px; border:2px solid #eee; font-size:18px; cursor:pointer; appearance: auto; outline:none;">
                    <option value="" disabled selected>-- Выберите категорию (если подходит) --</option>
                    <option value="Мусор">📦 Не вывезен мусор / Переполнение</option>
                    <option value="Поломка">🛠 Сломан бак или ограждение площадки</option>
                    <option value="Парковка">🚗 Проезд заблокирован автомобилем</option>
                    <option value="Освещение">💡 Не работает уличное освещение</option>
                    <option value="Грязь">🧹 Грязь или лед на территории</option>
                    <option value="Другое">🔍 Другое (опишите ниже)</option>
                </select>
            </div>

            <!-- Блок подробного описания -->
            <div style="margin-top:10px;">
                <label style="display:block; font-size:16px; font-weight:800; margin-bottom:10px; color:#888; text-transform:uppercase;">Что именно произошло?</label>
                <textarea id="f-desc" class="premium-card" 
                    style="width:100%; height:200px; padding:25px; border:2px solid #eee; font-size:18px; resize:none; box-sizing:border-box; outline:none;" 
                    placeholder="Напишите здесь детали происшествия..."></textarea>
            </div>

            <button class="ui-btn" 
                style="background:#008000; color:#fff; height:90px; font-size:24px; margin-top:30px; border:none;" 
                onclick="window.sendComplaintConfirm()">
                ОТПРАВИТЬ ДИСПЕТЧЕРУ
            </button>
        `;
        modal.style.display = "flex";
    };

window.sendComplaintConfirm = () => {
    // 1. Находим наш sub-modal
    const sub = document.getElementById('sub-modal-body');
    if (!sub) return;

    // 2. Генерируем номер
    const ticketNum = "Ж-" + (Math.floor(Math.random() * 9000) + 1000);

    // 3. Наполняем его контентом (компактным)
    sub.innerHTML = `
        <div class="success-popup" style="padding: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
            <span class="success-icon">✅</span>
            <h1 style="color:#008000; font-size: 35px; margin-bottom: 10px;">ОТПРАВЛЕНО!</h1>
            <p style="font-size: 20px; color: #333; margin-bottom: 20px;">Ваша жалоба принята диспетчером.</p>
            <div style="background: #f0fdf0; padding: 15px 30px; border-radius: 20px; border: 2px dashed #008000; font-weight: 900; font-size: 24px;">
                № ${ticketNum}
            </div>
            <p style="font-size: 14px; color: #888; margin-top: 20px;">Ожидайте звонка в течение 30 минут.</p>
            <button class="ui-btn" style="margin-top: 30px; background: #008000; color: #fff; width: 250px;" 
                onclick="window.closeEverything()">ОТЛИЧНО</button>
        </div>
    `;

    // 4. Показываем sub-modal поверх окна жалобы
    sub.style.display = "block";
    
    // 5. Авто-закрытие всего через 5 секунд (на случай если не нажали кнопку)
    setTimeout(() => {
        if(sub.style.display === "block") window.closeEverything();
    }, 5000);
};

    db.forEach(obj => {
        if (obj.id?.startsWith('h')) {
            const hHtml = `<div class="house-card-pro"><img src="${obj.photo || ''}" class="house-img-pro"><b style="font-size:24px; color:#008000; display:block; margin-bottom:15px; text-align:center;">🏠 ${obj.address}</b><div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;"><div class="info-row">🏗️ Год: ${obj.year}</div><div class="info-row">🧱 Монолит</div><div class="info-row">🏢 Этажи: ${obj.floors}</div><div class="info-row">📡 Falcon</div></div><div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-top:20px;"><button class="ui-btn" style="background:#3498db; color:#fff;" onclick="window.openCamera()">КАМЕРА</button><button class="ui-btn" style="background:#d9534f; color:#fff;" onclick="window.openComplaintAction('${obj.address}')">ЖАЛОБА</button></div></div>`;
// Замени настройки в конце этой строки:
const m = new ymaps.Placemark(obj.coords, { balloonContent: hHtml }, { 
    preset: 'islands#greenHomeCircleIcon', 
    iconScale: 1.8, 
    balloonMinWidth: 350, 
    balloonMinHeight: 500, // МЕНЯЙ ВЫСОТУ ТУТ
    balloonPanelMaxMapArea: 0 
});

            layers.hM.push(m); map.geoObjects.add(m);
            
            // ВОССТАНОВЛЕНИЕ ГРАНИЦ
            if(obj.boundary) {
                const poly = new ymaps.Polygon([obj.boundary], {}, { fillColor: '#00800015', strokeColor: '#008000', strokeWidth: 5 });
                layers.hP.push(poly);
            }
            
            if (obj.infra) obj.infra.forEach(item => {
                const color = item.load < 66 ? '#00cc00' : '#ff3300';
                
if (item.type.includes('bin')) {
    const longTitle = item.type === 'tko_bin' 
        ? "Бак для крупногабаритного мусора" 
        : `Бак для общих отходов ${item.title.includes('2') ? '№2' : '№1'}`;

    const photoHtml = item.photo 
        ? `<img src="${item.photo}" style="width:100%; height:200px; object-fit:cover; border-radius:15px; margin-bottom:15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">` 
        : '';

    const bHtml = `
        <div style="width:300px; padding:20px; text-align:center;">
            ${photoHtml}
            <b style="font-size:24px; color:${color}; display:block; line-height:1.2; margin-bottom:15px;">
                🗑️ ${longTitle}
            </b>
            <div class="info-row" style="border-left:none; border-bottom:4px solid ${color}; background:#f9f9f9; display:inline-block; padding:8px 15px; font-size:18px;">
                📊 Заполнение: ${item.load}%
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:15px; text-align:left;">
                <div class="info-row" style="font-size:12px; padding:8px; border-left-width:5px;">📦 Объем: ${item.volume || '1.1 м³'}</div>
                <div class="info-row" style="font-size:12px; padding:8px; border-left-width:5px;">🛠️ Мат: ${item.material || 'Сталь'}</div>
            </div>
            <div class="info-row" style="border-left:none; border-top:2px solid #3498db; background:#f0f7ff; margin-top:15px; font-size:13px;">
                🕒 Последняя выгрузка: ${item.lastEmpty || '08:00'}
            </div>
        </div>`;
layers.tB.push(new ymaps.Placemark(item.coords, { 
    balloonContent: bHtml 
}, { 
    preset: 'islands#trashIcon', 
    iconColor: color, 
    iconScale: 1.5,
    
    // --- ВОТ ЗДЕСЬ МЕНЯЕМ ВЫСОТУ ---
    balloonMinWidth: 350,       // Ширина окна
    balloonMaxWidth: 420,
    balloonMinHeight: 500,      // Минимальная высота (подбери под размер фото)
    balloonMaxHeight: 800,      // Максимальная высота со скроллом
    balloonPanelMaxMapArea: 0   // Чтобы балун не открывался на всю карту на мобилах
}));
}

else if (item.type === 'parking') {
    const freeSpots = (item.totalSpots || 0) - (item.busySpots || 0);
    
    const pHtml = `
        <div class="custom-balloon" style="width: 440px; margin: 15px auto;">
            <b style="color:#00AAFF; font-size:32px; display:block; text-align:center; margin-bottom:10px;">🅿️ ${item.title}</b>
            <p style="font-size:16px; color:#666; text-align:center; margin-bottom:20px;">ИИ-мониторинг ООО УК «ВСЕ СВОИ»</p>
            
            <div class="info-row" style="border-left-color:#00AAFF; font-size:22px; white-space: nowrap; display: flex; justify-content: space-between; align-items: center;">
                <span>🚗 Свободно:</span>
                <b style="color:#008000;">${freeSpots} <span style="color:#222; font-size:16px; font-weight:400;">из ${item.totalSpots || 0}</span></b>
            </div>

            <div class="info-row" style="background:#f4f7f4; border-left:none; text-align:center; margin-top:10px;">
                Занятость: <b>${Math.round((item.busySpots / item.totalSpots) * 100) || 0}%</b>
            </div>

            <button class="ui-btn" style="background:#3498db; color:#fff; margin-top:15px; width:100%; border-bottom-color:#2980b9;" onclick="window.openCamera()">
                СМОТРЕТЬ КАМЕРУ
            </button>
        </div>`;

    layers.pk.push(new ymaps.Placemark(item.coords, { 
        balloonContent: pHtml 
    }, { 
        preset: 'islands#parkingIcon', 
        iconColor: '#00AAFF', 
        iconScale: 1.8,
        balloonMinWidth: 480, 
        balloonMaxWidth: 480,
        balloonMinHeight: 250, // Увеличили высоту, чтобы текст не поджимало
        balloonPanelMaxMapArea: 0,
        balloonShadow: false,
        balloonAutoPan: true
    }));

    if(item.boundary) {
        layers.pk.push(new ymaps.Polygon([item.boundary], {}, { 
            fillColor: '#00AAFF20', 
            strokeColor: '#00AAFF', 
            strokeWidth: 2 
        }));
    }
}

else if (item.type === 'playground') {
    const lHtml = `
        <div class="custom-balloon" style="width: 440px; margin: 15px auto;">
            <b style="color:#008000; font-size:30px; display:block; text-align:center; margin-bottom:15px;">🎡 ${item.title}</b>
            
            <div class="info-row" style="border-left-color:#008000;">
                🧸 Покрытие: <b>${item.surface || 'Резиновая крошка'}</b>
            </div>
            
            <div class="info-row" style="border-left-color:#2ecc71;">
                🏃 Спорт: <b>${item.sportEq || 'Турники, брусья'}</b>
            </div>
            
            <div class="info-row" style="border-left-color:#3498db;">
                🧩 Инвентарь: <b>${item.kidsEq || 'Горки, качели'}</b>
            </div>
            
            <div class="info-row" style="background:#fff7e6; border-left-color:#ffa500; text-align:center; border-left-width: 0; border-bottom: 4px solid #ffa500;">
                👶 Возраст: <b>${item.ageRange || '3-12 лет'}</b>
            </div>
            
            <p style="font-size:13px; color:#888; text-align:center; margin-top:15px;">Сертификат безопасности ГОСТ 52169-2012</p>
        </div>`;

    layers.pl.push(new ymaps.Placemark(item.coords, { 
        balloonContent: lHtml 
    }, { 
        preset: 'islands#greenFamilyIcon', 
        iconScale: 1.8,
        // НАСТРОЙКИ ОКНА ПЛОЩАДКИ
        balloonMinWidth: 480, 
        balloonMaxWidth: 480,
        balloonMinHeight: 250, // Оптимальная высота под 4 инфо-строки
        balloonPanelMaxMapArea: 0,
        balloonShadow: false,
        balloonAutoPan: true
    }));

    if(item.boundary) {
        layers.pl.push(new ymaps.Polygon([item.boundary], {}, { 
            fillColor: '#00800020', 
            strokeColor: '#008000', 
            strokeWidth: 2 
        }));
    }
}
            });
        }
    });

    const trData = db.find(o => o.type === 'truck_route');
    const truckMarker = new ymaps.Placemark(trData.path, {}, { preset: 'islands#oliveDeliveryIcon', iconScale: 2.2 });
    const routeLine = new ymaps.Polyline(trData.path, {}, { strokeColor: '#00FF88', strokeWidth: 10, opacity: 0.4 });
    let seg = 0, prog = 0; setInterval(() => {
        prog += 0.035; 
        if (prog >= 1) { prog = 0; seg = (seg + 1) % (trData.path.length - 1); }
        const [lat1, lon1] = trData.path[seg], [lat2, lon2] = trData.path[seg+1];
        truckMarker.geometry.setCoordinates([lat1 + (lat2-lat1)*prog, lon1 + (lon2-lon1)*prog]);
    }, 50);

    const modal = document.createElement('div'); modal.className = "modal-overlay"; 
    modal.innerHTML = `<div class="modal-win premium-card" id="m-win-body"><button class="close-icon" onclick="window.closeEverything()">&times;</button><div id="m-content"></div><div class="sub-modal" id="sub-modal-body"></div></div>`;
    document.body.appendChild(modal);

    window.closeEverything = () => { document.getElementById('sub-modal-body').style.display="none"; modal.style.display="none"; };
    window.openModal = (t, h) => { document.getElementById('m-content').innerHTML = `<h1 style="color:#008000; font-weight:900; font-size:60px; margin-bottom:45px;">${t}</h1>${h}`; modal.style.display = "flex"; };
    window.openSub = (title, text) => {
        const sub = document.getElementById('sub-modal-body');
        sub.innerHTML = `<button class="close-icon" onclick="this.parentElement.style.display='none'">&times;</button><h1 style="color:#008000; font-weight:900; font-size:50px; margin-bottom:30px;">${title}</h1><div style="font-size:26px; line-height:1.8; text-align:justify;">${text}</div><button class="ui-btn" style="background:#008000; color:#fff; width:350px; height:100px; margin-top:50px;" onclick="this.parentElement.style.display='none'">ВЕРНУТЬСЯ</button>`;
        sub.style.display = "block";
    };

    window.openEcoGuide = () => {
        const full = `
            <div style="display: flex; flex-direction: column; gap: 20px; padding-bottom: 40px;">
                
                <div class="info-row" style="border: 2px solid #008000; background: #f0fdf0;">
                    <b style="font-size: 24px; color: #008000; display: block; margin-bottom: 10px;">💳 1. Секреты экономии на ЖКУ</b>
                    Сминайте ПЭТ-бутылки и картонные коробки перед выбросом! В одном евроконтейнере 1.1 м³ помещается либо 40 кг целых бутылок, либо 200 кг смятых. Чем меньше "воздуха" мы возим, тем реже заказывается спецтехника, что напрямую сдерживает рост тарифа на вывоз ТКО для вашего дома.
                </div>

                <div class="info-row" style="border: 2px solid #d9534f; background: #fff5f5;">
                    <b style="font-size: 24px; color: #d9534f; display: block; margin-bottom: 10px;">🚫 2. Категорический стоп-лист</b>
                    Никогда не выбрасывайте в общие баки: автомобильные шины, строительный бетон, кирпичи, оконные стекла и ртутные лампы. Эти отходы не относятся к ТКО. Они блокируют работу пресса мусоровоза (ремонт стоит от 200 тыс. руб.) и делают невозможной дальнейшую сортировку.
                </div>

                <div class="info-row" style="border: 2px solid #3498db; background: #f0f7ff;">
                    <b style="font-size: 24px; color: #3498db; display: block; margin-bottom: 10px;">📡 3. Falcon Smart — как это работает?</b>
                    Под крышкой каждого бака УК «ВСЕ СВОИ» установлен лазерный датчик Falcon. Он измеряет расстояние до мусора каждые 15 минут. Данные передаются по защищенному протоколу в ГИС. Когда уровень достигает 80%, система автоматически включает бак в маршрутный лист ближайшего мусоровоза.
                </div>

                <div class="info-row" style="border: 2px solid #f39c12; background: #fffaf0;">
                    <b style="font-size: 24px; color: #f39c12; display: block; margin-bottom: 10px;">🔋 4. Опасные батарейки</b>
                    Одна пальчиковая батарейка загрязняет 20 квадратных метров земли тяжелыми металлами. В Северодвинске установлены спец-боксы для их сбора. Если вы видите, что кто-то бросил батарейку в общий бак — сообщите нам, мы проведем замену грунта под площадкой.
                </div>

                <div class="info-row" style="border: 2px solid #2ecc71; background: #f4fff8;">
                    <b style="font-size: 24px; color: #2ecc71; display: block; margin-bottom: 10px;">♻️ 5. Вторая жизнь пластика</b>
                    Пластик из синих сеток отправляется на завод «Север-Рециклинг». Там его перерабатывают в полимерпесчаную смесь. Знаете ли вы, что новые антивандальные лавочки и урны в ваших дворах на 40% состоят из того самого пластика, который вы правильно отсортировали?
                </div>

                <div class="info-row" style="border: 2px solid #9b59b6; background: #fdf0ff;">
                    <b style="font-size: 24px; color: #9b59b6; display: block; margin-bottom: 10px;">🚛 6. Правила парковки у баков</b>
                    Мусоровоз — это огромная машина шириной 2.5 метра. Если вы оставили авто ближе чем в 3 метрах от площадки, захват бака становится невозможным. Система ИИ на камере зафиксирует госномер нарушителя, и вывоз будет перенесен на следующие сутки, что приведет к антисанитарии.
                </div>

                <div class="info-row" style="border: 2px solid #1abc9c; background: #f0fffd;">
                    <b style="font-size: 24px; color: #1abc9c; display: block; margin-bottom: 10px;">🏗️ 7. Крупногабаритный мусор (КГМ)</b>
                    Диваны, шкафы и старая бытовая техника — это КГМ. Их нельзя заталкивать в баки. Оставляйте их в специальных отсеках "Лодка" (8м³). Если такой отсек переполнен, воспользуйтесь кнопкой "Жалоба", и мы пришлем дополнительный ломовоз.
                </div>

                <div class="info-row" style="border: 2px solid #e74c3c; background: #fff5f4;">
                    <b style="font-size: 24px; color: #e74c3c; display: block; margin-bottom: 10px;">🌡️ 8. Санитарная обработка</b>
                    Мы заботимся о вашем здоровье. Дважды в год, при переходе на летний и зимний сезоны, каждый бак проходит полную дезинфекцию раствором "Хлорамин-Б" под давлением. Это уничтожает 99% бактерий и устраняет неприятные запахи гниения.
                </div>

                <div class="info-row" style="border: 2px solid #34495e; background: #f5f6f7;">
                    <b style="font-size: 24px; color: #34495e; display: block; margin-bottom: 10px;">💻 9. Электронный лом</b>
                    Старые телевизоры и мониторы содержат свинец и люминофор. Бросать их в контейнер — преступление против природы. Раз в квартал наша УК проводит акцию "Эко-Сбор", где вы можете сдать технику бесплатно. Следите за уведомлениями в ГИС!
                </div>

                <div class="info-row" style="border: 2px solid #008000; background: #ffffff;">
                    <b style="font-size: 24px; color: #008000; display: block; margin-bottom: 10px;">🌟 10. Будущее ГИС 2025</b>
                    В следующем году мы интегрируем в карту датчики анализа воздуха. Вы сможете в реальном времени видеть уровень загазованности во дворе. Также планируется запуск нейросети, которая будет предсказывать поломки детских качелей по вибрации датчиков.
                </div>

                <div class="info-row" style="border: 2px solid #e67e22; background: #fff9f5;">
                    <b style="font-size: 24px; color: #e67e22; display: block; margin-bottom: 10px;">🐱 11. Защита животных</b>
                    Пожалуйста, плотно закрывайте крышки баков! Бездомные кошки и птицы забираются внутрь в поисках еды и часто получают травмы при работе пресса мусоровоза. Закрытая крышка — спасенная жизнь.
                </div>

                <div class="info-row" style="border: 2px solid #000; background: #fafafa;">
                    <b style="font-size: 24px; color: #000; display: block; margin-bottom: 10px;">📞 12. Прямая связь с УК</b>
                    ГИС — это не просто карта, это мост между вами и инженерами. Если вы заметили, что на детской площадке открутился болт или перегорела лампочка над подъездом — не ждите. Один клик на "Жалобу" экономит неделю бюрократической переписки.
                </div>

            </div>
        `;
        window.openModal('🍃 Советы для жильцов от Вани', full);
    };
    window.runAction = (act) => {
        if(act === 'sat') map.setType('yandex#hybrid');
        else if(act === 'map') map.setType('yandex#map');
        else if(act === 'reboot') location.reload();
        else if(act === 'theme') document.body.classList.toggle('interface-dark');
        else if(act === 'dev') {
            window.openSub('🔄 ОБНОВЛЕНИЕ', '<div style="text-align:center;"><div class="loader-spin" style="width:100px; height:100px; border:10px solid #f3f3f3; border-top:10px solid #008000; border-radius:50%; animation:spin 1s linear infinite; margin:auto;"></div><p>Загрузка v17.5...</p></div>');
            setTimeout(() => window.openSub('✅ ГОТОВО', 'Система актуальна.'), 2000);
        }
    };

    window.refreshL = () => {
        const id = (i) => document.getElementById(i);
        const c = { 
            h: id('l-h').checked, 
            p: id('l-p').checked, 
            t: id('l-t').checked, 
            pl: id('l-pl').checked, 
            pk: id('l-pk').checked, 
            tr: id('l-tr').checked 
        };
        layers.hM.forEach(m => c.h ? map.geoObjects.add(m) : map.geoObjects.remove(m));
        layers.hP.forEach(p => c.p ? map.geoObjects.add(p) : map.geoObjects.remove(p));
        layers.tB.forEach(b => c.t ? map.geoObjects.add(b) : map.geoObjects.remove(b));
        layers.pl.forEach(l => c.pl ? map.geoObjects.add(l) : map.geoObjects.remove(l));
        layers.pk.forEach(k => c.pk ? map.geoObjects.add(k) : map.geoObjects.remove(k));
        c.tr ? (map.geoObjects.add(truckMarker), map.geoObjects.add(routeLine)) : (map.geoObjects.remove(truckMarker), map.geoObjects.remove(routeLine));
    };

    function id(i) { return document.getElementById(i); }
    const gui = document.createElement('div'); gui.id = "eco-panel-root"; gui.className = "premium-card";
    gui.innerHTML = `<div class="eco-header">🌿 ЭКОСИСТЕМА ДВОРА</div><div class="eco-content">
        <label>Дома 🏠 <span class="switch"><input type="checkbox" id="l-h" checked onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Границы дома 📐 <span class="switch"><input type="checkbox" id="l-p" onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Мусорные баки 🗑️ <span class="switch"><input type="checkbox" id="l-t" onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Дет. площадки 🎡 <span class="switch"><input type="checkbox" id="l-pl" onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Стоянки 🅿️ <span class="switch"><input type="checkbox" id="l-pk" onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Орг. техника 🚛 <span class="switch"><input type="checkbox" id="l-tr" onchange="refreshL()"><span class="slider"></span></span></label>
    </div>`; document.body.appendChild(gui);

    const sBtn = document.createElement('button'); sBtn.className = "settings-trigger"; sBtn.innerHTML = `⚙️`; document.body.appendChild(sBtn);
    const secBtn = document.createElement('button'); secBtn.innerText = "ДОП"; secBtn.className = "secret-trigger"; document.body.appendChild(secBtn);
    
    const tBox = document.createElement('div'); tBox.id = "settings-panel-root"; tBox.className = "premium-card";
    Object.assign(tBox.style, { position: "absolute", bottom: "160px", left: "40px", width: "450px", padding: "40px", display: "none", zIndex: "1000", borderTop: "20px solid #008000", background: "rgba(255,255,255,0.98)" });
    tBox.innerHTML = `<button class="ui-btn" onclick="openEcoGuide()">📖 ЭКО-ГИД</button><button class="ui-btn" onclick="runAction('map')">🗺️ КАРТА</button><button class="ui-btn" onclick="runAction('sat')">🛰️ СПУТНИК</button><button class="ui-btn" onclick="runAction('theme')">🌙 ТЕМА</button><label style="display:flex;justify-content:space-between;align-items:center;font-size:16px;margin-top:25px;color:#666">ENGINEERING <span class="switch"><input type="checkbox" onchange="document.querySelector('.secret-trigger').style.display = this.checked ? 'flex' : 'none'"><span class="slider"></span></span></label>`;
    document.body.appendChild(tBox); 

    sBtn.onclick = () => { const open = tBox.style.display === "block"; tBox.style.display = open ? "none" : "block"; sBtn.classList.toggle('active', !open); };
    secBtn.onclick = () => {
        secBtn.classList.toggle('active-mode');
        document.getElementById('m-content').innerHTML = `
            <h1 style="color:#00ff88; text-align:center; font-size:65px;">STATION CONTROL</h1>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:25px; margin-top:50px;">
                <button class="ui-btn" onclick="window.openSub('📞 УК ВСЕ СВОИ', 'Диспетчерская (24/7):<br><b>+7 (921) 482-85-50</b>')">📞 НОМЕР УК</button>
                <button class="ui-btn" onclick="window.open('https://vk.com/greyv1ld')">👨‍💻 РАЗРАБОТЧИК</button>
                <button class="ui-btn" onclick="runAction('dev')">🔄 ОБНОВЛЕНИЯ</button>
                <button class="ui-btn" onclick="window.openSub('🧹 ОЧИСТКА КЭША', 'Системный кеш очищен, Спасибо что пользуетесь сайтом.')">🧹 CLEAN КЭШ</button>
                <button class="ui-btn" onclick="window.openSub('🔐 Проверка безопасности', 'Всё в подрядке, система под надёжным контролем.')">🔐 SECURITY</button>
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
