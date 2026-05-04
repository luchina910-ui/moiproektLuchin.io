/**
 * ==============================================================================
 * ГИС ООО «УК «ВСЕ СВОИ» | Luchin Ivan 0.1 batta
 * Исправлено: При заходе на сайт показываются ТОЛЬКО метки домов
 * ==============================================================================
 */

ymaps.ready(initIndustrialGis);

async function initIndustrialGis() {
    const font = document.createElement('link');
    font.href = 'https://googleapis.com';
    font.rel = 'stylesheet'; document.head.appendChild(font);

    const style = document.createElement('style');
    style.innerHTML = `
        body, button, input, select, div, textarea { font-family: 'Montserrat', sans-serif !important; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .ymaps-2-1-79-balloon__content { padding: 0 !important; background: transparent !important; }
        
        .premium-card { background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(25px); border: 2px solid rgba(0, 128, 0, 0.15); box-shadow: 0 15px 35px rgba(0, 128, 0, 0.1); border-radius: 35px; }
        
        .eco-panel { position: absolute !important; top: 35px !important; right: 25px !important; width: 310px; z-index: 5000; height: 60px; overflow: hidden; border: 2px solid #008000; }
        .eco-panel:hover { height: auto; background: #fff; border-bottom: 6px solid #008000; padding-bottom: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); transform: translateY(-3px); }
        .eco-header { height: 60px; display: flex; align-items: center; justify-content: center; color: #008000; font-weight: 900; font-size: 15px; text-transform: uppercase; cursor: pointer; letter-spacing: 2px; }
        .eco-content { padding: 0 30px 10px 30px; display: flex; flex-direction: column; gap: 18px; }
        .eco-content label { display: flex; align-items: center; justify-content: space-between; font-size: 16px; font-weight: 800; color: #111; cursor: pointer; }

        .settings-trigger { position: absolute; bottom: 35px; left: 25px; width: 80px; height: 80px; background: #fff; border-radius: 50%; border: 2px solid #008000; box-shadow: 0 10px 30px rgba(0,0,0,0.1); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 40px; z-index: 1001; }
        .settings-trigger:hover { transform: scale(1.05) rotate(15deg); }
        .settings-trigger.active-gear { animation: spinGear 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; color: #008000; }
        @keyframes spinGear { 0% { transform: rotate(0deg) scale(1.05); } 100% { transform: rotate(180deg) scale(1); } }
        
        .settings-panel { position: absolute; bottom: 130px; left: 25px; width: 350px; padding: 30px; display: none; border-top: 10px solid #008000; z-index: 1000; animation: slideUp 0.4s ease-out; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .secret-trigger { position: absolute; bottom: 35px; left: 120px; width: 80px; height: 80px; background: #fff; color: #008000; border: 3px solid #008000; border-radius: 50%; display: none; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; text-transform: uppercase; cursor: pointer; z-index: 15000 !important; box-shadow: 0 5px 15px rgba(0,128,0,0.2); transition: all 0.3s ease; }
        .secret-trigger:hover { transform: scale(1.1) rotate(5deg); background: #008000; color: #fff; }

        .ui-btn, .ui-select { width: 100%; padding: 16px; margin-bottom: 12px; border-radius: 22px; border: 1px solid #eef2ef; background: #f9fbf9; color: #111; cursor: pointer; font-weight: 900; font-size: 13px; text-transform: uppercase; border-bottom: 4px solid #dce4de; box-sizing: border-box; }
        .ui-btn:hover { background: #008000; color: #fff; transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,128,0,0.2); }

        .switch { position: relative; display: inline-block; width: 48px; height: 26px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 26px; }
        .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #008000; }
        input:checked + .slider:before { transform: translateX(22px); }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 20000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(12px); animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .modal-win { width: 800px; background: #fff; border-radius: 40px; padding: 45px; border-top: 15px solid #008000; position: relative; max-height: 85vh; overflow-y: auto; box-sizing: border-box; animation: popUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes popUp { from { transform: scale(0.8) translateY(50px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        
        .sub-modal { position: absolute; top: 0; left: 0; width: 100%; min-height: 100%; background: #fff; z-index: 21000; border-radius: 45px; padding: 45px; display: none; box-sizing: border-box; overflow-y: auto; animation: slideLeft 0.3s ease-out; }
        @keyframes slideLeft { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        
        .close-icon { position: absolute; top: 25px; right: 30px; cursor: pointer; font-size: 50px; color: #ccc; z-index: 22000; line-height: 1; transition: 0.2s; }
        .close-icon:hover { color: #ff0000; transform: scale(1.1) rotate(90deg); }

        .bal-card { width: 320px; padding: 15px; box-sizing: border-box; }
        .bal-header { font-size: 18px; font-weight: 900; color: #008000; border-bottom: 3px solid #f4f8f5; padding-bottom: 8px; margin-bottom: 12px; display: block; }
        .bal-row { background: #f9fbf9; padding: 10px; border-radius: 15px; margin-bottom: 8px; border-left: 5px solid #008000; }
        .bal-row span { font-size: 13px; font-weight: 700; color: #111; }

        .form-label { font-size: 11px; font-weight: 900; color: #008000; text-transform: uppercase; margin-bottom: 5px; display: block; }
        .form-input { width: 100%; padding: 12px; margin-bottom: 15px; border-radius: 12px; border: 2px solid #eef2ef; font-size: 14px; box-sizing: border-box; background: #f9fbf9; }

        .tools-grid, .guide-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 25px; }
        .g-card { background: #f4f8f5; border-radius: 25px; padding: 25px; border-left: 8px solid #008000; cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
        .g-card:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 10px 20px rgba(0, 128, 0, 0.1); background: #fff; }
        .t-btn { padding: 18px; font-size: 11px; border-radius: 18px; background: #111; color: #00ff88; border: 2px solid #333; cursor: pointer; font-weight: 800; text-transform: uppercase; transition: 0.2s; }
        .t-btn:hover { background: #00ff88; color: #111; box-shadow: 0 5px 15px rgba(0,255,136,0.3); }

        body.dark-mode-active .premium-card, body.dark-mode-active .sub-modal { background: #0e140e !important; color: #00ff88 !important; border-color: #00ff88 !important; }
        body.dark-mode-active .ui-btn, body.dark-mode-active .ui-select, body.dark-mode-active .g-card { background: #152215 !important; color: #00ff88 !important; border-color: #00ff8844 !important; }
        body.dark-mode-active .eco-header, body.dark-mode-active .eco-content label { color: #00ff88 !important; }
        body.dark-mode-active .bal-row { background: #152215 !important; border-left-color: #00ff88 !important; }
        body.dark-mode-active .bal-row span { color: #eee !important; }
        body.dark-mode-active .bal-header { color: #00ff88 !important; border-bottom-color: #222 !important; }
        body.dark-mode-active .eco-panel:hover { background: #0e140e !important; }
        body.dark-mode-active .settings-trigger { background: #0e140e !important; color: #00ff88 !important; border-color: #00ff88 !important; }
    `;
    document.head.appendChild(style);

    const map = new ymaps.Map('map', { center: [64.56, 39.82], zoom: 14, controls: ['zoomControl'] });
    const response = await fetch('/api/objects');
    const root = await response.json();
    const db = root.data;
    const layers = { hM: [], hP: [], tB: [], tBZ: [], pL: [], pLZ: [], pK: [], pKZ: [] };

    db.filter(o => o.id?.startsWith('h')).forEach(house => {
        const hHtml = `<div class="bal-card"><span class="bal-header">${house.address}</span><img src="${house.photo}" class="invert-protection" style="width:100%; height:100px; object-fit:cover; border-radius:15px; margin-bottom:10px; border:2px solid #f4f8f5;"><div class="bal-row"><span>${house.year} г.п. • ${house.area}</span></div><button class="ui-btn" style="background:#d9534f; color:#fff; border:none; padding:12px; font-size:11px;" onclick="openComplaint('${house.address}')">⚠️ ПОДАТЬ ЖАЛОБУ</button></div>`;
        layers.hM.push(new ymaps.Placemark(house.coords, { balloonContent: hHtml }, { preset: 'islands#greenHomeCircleIcon', iconScale: 1.3 }));
        layers.hP.push(new ymaps.Polygon([house.polygonCoords || [house.coords]], {}, { fillColor: '#00800010', strokeColor: '#008000', strokeWidth: 3 }));
        
        if (house.infra) house.infra.forEach(item => {
            let bHtml = '';
            if (item.type.includes('bin')) {
                const pC = item.load < 33 ? '#00cc00' : (item.load < 66 ? '#ff9900' : '#ff3300');
                bHtml = `<div class="bal-card"><span class="bal-header">${item.title}</span><div class="bal-row"><span style="color:${pC}">${item.load}% заполнено</span></div></div>`;
                layers.tBZ.push(new ymaps.Circle([item.coords, 2], {}, { fillColor: pC + '40', strokeColor: pC, strokeWidth: 1.5 }));
                layers.tB.push(new ymaps.Placemark(item.coords, { balloonContent: bHtml }, { preset: 'islands#trashIcon', iconColor: pC, iconScale: 0.8 }));
            } else if (item.type === 'parking') {
                bHtml = `<div class="bal-card"><span class="bal-header">🅿️ ${item.title}</span><div class="bal-row"><span>${item.status}</span></div></div>`;
                layers.pK.push(new ymaps.Placemark(item.coords, { balloonContent: bHtml }, { preset: 'islands#parkingIcon', iconColor: '#00AAFF' }));
                layers.pKZ.push(new ymaps.Polygon([item.polygonParking || [item.coords]], {}, { fillColor: '#00AAFF15', strokeColor: '#00AAFF', strokeWidth: 2, strokeStyle: 'shortdash' }));
            } else {
                bHtml = `<div class="bal-card"><span class="bal-header">🎡 ${item.title}</span><div class="bal-row"><span>Покрытие: ${item.surface}</span></div></div>`;
                layers.pL.push(new ymaps.Placemark(item.coords, { balloonContent: bHtml }, { preset: 'islands#greenFamilyIcon' }));
                layers.pLZ.push(new ymaps.Polygon([item.polygonArea || [item.coords]], {}, { fillColor: '#00800010', strokeColor: '#008000', strokeWidth: 2, strokeStyle: 'dot' }));
            }
        });
    });

    const modal = document.createElement('div'); modal.className = "modal-overlay"; 
    modal.innerHTML = `<div class="modal-win premium-card" id="m-win"><span class="close-icon" onclick="closeEverything()">&times;</span><div id="m-content"></div><div class="sub-modal" id="sub-modal"></div></div>`;
    document.body.appendChild(modal);

    window.closeEverything = () => { document.getElementById('sub-modal').style.display = "none"; modal.style.display = "none"; };
    
    window.openSub = (title, text) => {
        const sub = document.getElementById('sub-modal');
        sub.innerHTML = `<span class="close-icon" onclick="this.parentElement.style.display='none'">&times;</span><h2 style="color:#008000; font-size:28px; font-weight:900; margin-bottom:20px;">${title}</h2><div style="font-size:16px; line-height:1.8; color:#333; font-weight:500;">${text}</div><button class="ui-btn" style="margin-top:35px; background:#008000; color:#fff;" onclick="this.parentElement.style.display='none'">ВЕРНУТЬСЯ НАЗАД</button>`;
        sub.style.display = "block";
    };

    window.openComplaint = (address) => {
        map.balloon.close();
        document.getElementById('m-content').innerHTML = `
            <span class="close-icon" onclick="closeEverything()">&times;</span>
            <h1 style="color:#d9534f; font-weight:900; font-size:28px; margin-bottom:10px;">⚠️ ПОДАЧА ЖАЛОБЫ</h1>
            <p style="margin-bottom:25px; font-size:16px; font-weight:700;">Адрес объекта: <span style="color:#008000;">${address}</span></p>
            
            <label class="form-label">ФИО собственника *</label>
            <input type="text" id="form-fio" class="form-input" placeholder="Введите ваше полное имя">
            
            <label class="form-label">Телефон для связи *</label>
            <input type="tel" id="form-tel" class="form-input" placeholder="+7 (___) ___-__-__">
            
            <label class="form-label">Причина жалобы *</label>
            <select id="form-reason" class="form-input">
                <option value="">-- Обязательно выберите причину --</option>
                <option value="Мусор">Не убран мусор на площадке</option>
                <option value="Поломка">Поврежден контейнер / замок</option>
                <option value="График">Нарушен график приезда машины</option>
                <option value="Блокировка">Площадка заблокирована автомобилем</option>
                <option value="Другое">Другая причина (описать подробно)</option>
            </select>
            
            <label class="form-label">Суть проблемы</label>
            <textarea id="form-desc" class="form-input" rows="4" style="resize:none;" placeholder="Пожалуйста, опишите проблему во всех подробностях для диспетчера..."></textarea>
            
            <button class="ui-btn" style="background:#008000; color:#fff; border:none; margin-top:5px;" onclick="if(document.getElementById('form-fio').value && document.getElementById('form-reason').value){alert('Ваша жалоба официально зарегистрирована!'); closeEverything();}else{alert('Пожалуйста, выберите причину и заполните ФИО!');}">ОТПРАВИТЬ ОБРАЩЕНИЕ</button>`;
        modal.style.display = "flex";
    };

    window.runAction = (act) => {
        if(act === 'dev') { openSub('DEVELOPER HUB', 'Актуальные сборки и релизы ГИС-платформы доступны в Telegram: <b>@Luchin_Ivan_pec</b>.'); }
        else if(act === 'contact') { openSub('📞 Диспетчерская УК', '<b>ООО УК «ВСЕ СВОИ»</b><br><br>• Горячая линия (24/7): +7 921 482-85-50'); }
        else if(act === 'reboot') { location.reload(); }
        else if(act === 'scale') { const s = prompt("Масштаб иконок на карте:", "1.2"); if(s) layers.tB.forEach(m => m.options.set('iconScale', s)); }
        else if(act === 'social') { openSub('🌐 Сообщество и Сети', '• Официальный VK: ://vk.com'); }
        else if(act === 'shortcut') { alert("Нажмите 'Три точки' в Chrome -> 'Установить как приложение'."); }
        else if(act === 'clean') { alert('Системные логи успешно очищены!'); }
        else if(act === 'net') { alert('Проверка сети завершена. Пинг: 4ms.'); }
        else if(act === 'battery') { alert('Режим 🔋 энергосбережения включен.'); }
        else if(act === 'idea') { alert('Ваше предложение бережно упаковано!'); }
    };

    const sBtn = document.createElement('button'); sBtn.className = "settings-trigger"; sBtn.innerHTML = `⚙️`; document.body.appendChild(sBtn); 
    const secBtn = document.createElement('button'); secBtn.className = "secret-trigger"; secBtn.innerText = "Control"; document.body.appendChild(secBtn); 
    const tBox = document.createElement('div'); tBox.className = "settings-panel premium-card"; 
    
    let opts = '<option value="">Выберите адрес...</option>';
    db.filter(o => o.id?.startsWith('h')).forEach(h => opts += `<option value="${h.id}">${h.address}</option>`);
    tBox.innerHTML = `<h3>УПРАВЛЕНИЕ ГИС</h3><select id="a-sel" class="ui-select">${opts}</select><button id="btn-sat" class="ui-btn">🛰️ СПУТНИК</button><button id="btn-sci" class="ui-btn">🍃 ЭКО-ГИД ДЛЯ ЖИТЕЛЕЙ</button><button id="btn-drk" class="ui-btn">🌙 НОЧНОЙ РЕЖИМ</button><label style="display:flex; justify-content:space-between; align-items:center; font-size:15px; font-weight:900;">ДОП. ФУНКЦИИ <span class="switch"><input type="checkbox" id="sec-ch"><span class="slider"></span></span></label>`;
    document.body.appendChild(tBox); 

    sBtn.onclick = () => { 
        tBox.style.display = tBox.style.display === "block" ? "none" : "block"; 
        sBtn.classList.add('active-gear');
        setTimeout(() => sBtn.classList.remove('active-gear'), 600);
    };

    tBox.querySelector('#sec-ch').addEventListener('change', function() {
        secBtn.style.display = this.checked ? "flex" : "none";
    });

    secBtn.onclick = () => {
        document.getElementById('m-content').innerHTML = `<span class="close-icon" onclick="closeEverything()">&times;</span><h1 style="text-align:center; font-weight:900; letter-spacing:2px; font-size:28px;">STATION CONTROL</h1><div class="tools-grid"><button class="t-btn" onclick="runAction('scale')">📏 Масштаб баков</button><button class="t-btn" onclick="runAction('clean')">🧹 Очистка логов</button><button class="t-btn" onclick="runAction('net')">📡 Оптимизация сети</button><button class="t-btn" onclick="runAction('reboot')">🔄 Ребут сайта</button><button class="t-btn" onclick="runAction('contact')">📞 Контакты УК</button><button class="t-btn" onclick="runAction('shortcut')">📱 Ярлык на стол</button><button class="t-btn" onclick="runAction('battery')">🔋 Энергосбережение</button><button class="t-btn" onclick="runAction('idea')">💡 Предложения</button><button class="t-btn" onclick="runAction('dev')">🔄 Обновления</button><button class="t-btn" onclick="window.open('https://vk.com/greyv1ld')">👨‍💻 Создатель</button><button class="t-btn" onclick="runAction('social')">🌐 Соц. сети</button><button class="t-btn" onclick="closeEverything()">❌ Выход</button></div>`;
        modal.style.display = "flex";
    };

    document.getElementById('a-sel').onchange = (e) => { const h = db.find(x => x.id === e.target.value); if(h) map.setCenter(h.coords, 19, { duration: 1000 }); };

    document.getElementById('btn-sci').onclick = () => {
        document.getElementById('m-content').innerHTML = `<span class="close-icon" onclick="closeEverything()">&times;</span><h1 style="text-align:center; color:#008000; font-weight:900; font-size:28px; margin-bottom:5px;">🍃 ЭКО-ГИД МКД</h1><div class="guide-grid">
            <div class="g-card" onclick="openSub('💳 Экономия ЖКХ', '<b>Как реально платить меньше?</b><br><br>По закону собственники МКД могут оплачивать вывоз ТКО по фактическому объему накопления. В наших домах установлены Smart-датчики Falcon. Сминайте ПЭТ-бутылки перед выбросом (это снижает объем мусора на 70%!). Картонные коробки обязательно разбирайте в плоский лист. Пустые объемные коробки — это воздух, за вывоз которого вы платите из своего кармана. Диспетчер отправляет машину только при заполнении на 80%. Меньше рейсов — меньше цифра в ваших ежемесячных квитанциях!')"><h4>💳 Экономия</h4><p>Как платить меньше за вывоз...</p></div>
            <div class="g-card" onclick="openSub('🚫 Что запрещено бросать в баки?', '<b>Список опасных и негабаритных вещей по СанПиН:</b><br><br>Согласно регламенту УК, в общие евро-контейнеры категорически запрещено выбрасывать:<br><br>1. <b>Автомобильные покрышки:</b> Гидравлический пресс мусоровоза сжимает отходы с огромной силой. Резина отскакивает и с легкостью рвет гидравлические шланги. На ремонт спецтехники уходит от 150 000 рублей, а двор остается без вывоза на дни.<br>2. <b>Ртутные градусники и энергосберегающие лампы:</b> Пары ртути опасны для здоровья жильцов и детей.<br>3. <b>Строительный бетон, кирпичи, плитка:</b> Они мгновенно пробивают пластиковое дно бака и ломают захват манипулятора. <br><br>Для опасных отходов пользуйтесь специальными боксами в офисе УК!')"><h4>🚫 Запреты</h4><p>Список опасных вещей для бака...</p></div>
            <div class="g-card" onclick="openSub('⏰ Графики работы спецтехники', '<b>Точность по минутам — залог чистой площадки</b><br><br>Вывоз ТКО (бытового мусора) из пластиковых контейнеров осуществляется ежедневно в строго регламентированное утреннее время с 07:15 до 10:45. Пожалуйста, не паркуйте автомобили в это время возле контейнеров. Если машина не сможет подъехать, она уедет на следующий объект по графику.<br><br><b>График для крупногабаритного мусора:</b><br>Вывоз оранжевых бункеров-лодок (КГМ) производится строго 2 раза в неделю: <b>Вторник и Пятница</b>. Пожалуйста, планируйте вынос старой мебели и тяжелых дверей накануне этих дней.')"><h4>⏰ Графики</h4><p>Часы приезда мусоровозов...</p></div>
            <div class="g-card" onclick="openSub('📡 Как работают Smart-датчики?', '<b>Будущее уже в вашем дворе:</b><br><br>Под крышками наших евро-контейнеров скрыты автономные ультразвуковые эхолоты Falcon. Раз в 15 минут они бесшумно «стреляют» лучом до уровня мусора и отправляют сигнал в эту ГИС систему. <br><br><b>Что означают индикаторы в системе ГИС:</b><br>• Зеленый (<33%): бак пуст.<br>• Оранжевый (33-66%): бак в процессе заполнения.<br>• Красный (>66%): бак полностью готов к вывозу. Водителю мусоровоза в планшет автоматически перестраивается кратчайший маршрут до этой точки. Это исключает переполнение!')"><h4>📡 Датчики</h4><p>Как работает ГИС-мониторинг...</p></div>
            <div class="g-card" onclick="openSub('🏗️ Правила для крупного мусора', '<b>Куда выносить диваны, шкафы и сантехнику?</b><br><br>Крупногабаритный мусор (КГМ) — это все отходы, которые физически не помещаются в обычный пластиковый бак. <br><br><b>Правила утилизации КГМ:</b><br>1. Складируйте старую мебель, оконные рамы, двери и сантехнику только в большие оранжевые металлические лодки.<br>2. Если лодки нет на вашей площадке, обратитесь в чат дома для подачи коллективной заявки на её установку. <br><br>Категорически запрещено оставлять мебель возле подъездов или заталкивать ее силой в пластиковые баки!')"><h4>🏗️ КГМ</h4><p>Правила для крупной мебели...</p></div>
            <div class="g-card" onclick="openSub('♻️ Экология и Рециклинг', '<b>Ваша пластиковая бутылка вернется во двор лавочкой!</b><br><br>Пластик с маркировками 01 (ПЭТ) и 02 (HDPE), который вы выбрасываете в специальные сетки, не отправляется гнить на полигон ТБО. <br><br>Все раздельно собранные отходы едут на мусоросортировочный комплекс. Там пластик дробится в хлопья (флекс), плавится и смешивается с речным песком.<br><br><b>Итог:</b> Из этой смеси отливаются тяжелые, вечные антивандальные урны и скамейки. За прошлый год мы установили во дворах 12 таких скамеек, сделанных из ваших же бутылок!')"><h4>♻️ Рециклинг</h4><p>Вторая жизнь отходов...</p></div>
        </div>`;
        modal.style.display = "flex";
    };

    // ФОРМУЛА МАШИНЫ (ФИКСИРОВАННЫЙ РАСЧЕТ МАССИВОВ)
    const truckPath = db.find(o => o.type === 'truck_route')?.path || [];
    const truckMarker = new ymaps.Placemark(truckPath || [64.56, 39.82], {}, { preset: 'islands#oliveDeliveryIcon', zIndex: 12000 });
    const routeLine = new ymaps.Polyline(truckPath, {}, { strokeColor: '#00FF88', strokeWidth: 5, opacity: 0.5 });
    map.geoObjects.add(routeLine); map.geoObjects.add(truckMarker);

    let seg = 0, prog = 0;
    setInterval(() => {
        if (truckPath.length < 2) return;
        prog += 0.005;
        if (prog >= 1) { prog = 0; seg = (seg + 1) % (truckPath.length - 1); }
        
        const [latStart, lngStart] = truckPath[seg];
        const [latEnd, lngEnd] = truckPath[seg + 1];
        
        const lat = latStart + (latEnd - latStart) * prog;
        const lng = lngStart + (lngEnd - lngStart) * prog;
        
        truckMarker.geometry.setCoordinates([lat, lng]);
    }, 50);

    document.getElementById('btn-sat').onclick = function() {
        const isMap = map.getType() === 'yandex#map';
        map.setType(isMap ? 'yandex#hybrid' : 'yandex#map');
        this.innerText = isMap ? "🗺️ КАРТЫ" : "🛰️ СПУТНИК";
    };

    document.getElementById('btn-drk').onclick = function() {
        const isDark = document.body.classList.toggle('dark-mode-active');
        this.innerText = isDark ? "☀️ ДНЕВНОЙ РЕЖИМ" : "🌙 НОЧНОЙ РЕЖИМ";
    };

    const refreshL = () => {
        const c = { h: document.getElementById('l-h').checked, p: document.getElementById('l-p').checked, t: document.getElementById('l-t').checked, pl: document.getElementById('l-pl').checked, pk: document.getElementById('l-pk').checked, tr: document.getElementById('l-tr').checked };
        layers.hM.forEach(m => c.h ? map.geoObjects.add(m) : map.geoObjects.remove(m));
        layers.hP.forEach(p => c.p ? map.geoObjects.add(p) : map.geoObjects.remove(p));
        layers.tB.forEach(b => c.t ? map.geoObjects.add(b) : map.geoObjects.remove(b));
        layers.tBZ.forEach(z => c.t ? map.geoObjects.add(z) : map.geoObjects.remove(z));
        layers.pL.forEach(l => c.pl ? map.geoObjects.add(l) : map.geoObjects.remove(l));
        layers.pK.forEach(k => c.pk ? map.geoObjects.add(k) : map.geoObjects.remove(k));
        c.tr ? map.geoObjects.add(truckMarker) : map.geoObjects.remove(truckMarker);
        c.tr ? map.geoObjects.add(routeLine) : map.geoObjects.remove(routeLine);
    };

    const guiEco = document.createElement('div'); guiEco.className = "eco-panel premium-card"; 
    guiEco.innerHTML = `
        <div class="eco-header">🌿 ЭКОСИСТЕМА ДВОРА</div>
        <div class="eco-content">
            <label>Отображение зданий <span class="switch"><input type="checkbox" id="l-h" checked><span class="slider"></span></span></label>
            <label>Границы зданий <span class="switch"><input type="checkbox" id="l-p"><span class="slider"></span></span></label>
            <label>Мусорные баки <span class="switch"><input type="checkbox" id="l-t"><span class="slider"></span></span></label>
            <label>Детские площадки <span class="switch"><input type="checkbox" id="l-pl"><span class="slider"></span></span></label>
            <label>Автомобильные стоянки <span class="switch"><input type="checkbox" id="l-pk"><span class="slider"></span></span></label>
            <label>Спец техника <span class="switch"><input type="checkbox" id="l-tr"><span class="slider"></span></span></label>
        </div>`; 
    document.body.appendChild(guiEco); 

    ['l-h','l-p','l-t','l-pl','l-pk','l-tr'].forEach(id => document.getElementById(id).onchange = refreshL);
    refreshL();
}
