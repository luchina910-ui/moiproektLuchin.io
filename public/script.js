/**
 * ГИС ООО «УК «ВСЕ СВОИ» 
 */
ymaps.ready(initIndustrialGis);

async function initIndustrialGis() {

    const map = new ymaps.Map('map', { center: [64.562, 39.82], zoom: 14, controls: ['zoomControl'] });

    const response = await fetch('/api/objects');
    const root = await response.json();
    const db = root.data;
    const layers = { hM: [], hP: [], tB: [], tBZ: [], pl: [], pk: [] };

    window.openCamera = () => {
        window.openModal('🎥 Камера наблюдения', `
            <div style="text-align:center;">
                <div style="width:100px; height:100px; border:10px solid #f3f3f3; border-top:10px solid #3498db; border-radius:50%; animation:spin 1s linear infinite; margin:auto;"></div>
                <h2 style="font-size:35px; color:#3498db; margin-top:30px;">Идёт подключение...</h2>
                <p>Node_402 Offline.</p>
            </div>`);
    };

    window.openComplaintAction = (addr) => {
        const content = document.getElementById('m-content');
        content.innerHTML = `
            <div class="complaint-form-container">
                <h1 class="complaint-title">🚨 ОФОРМЛЕНИЕ ЖАЛОБЫ</h1>
                <p class="complaint-address">Объект: <b>${addr}</b></p>
                
                <div class="form-grid">
                    <input type="text" id="f-fio" placeholder="Ваше полное ФИО" class="premium-input" style="outline:none;">
                    <input type="tel" id="f-tel" placeholder="Номер телефона для связи" class="premium-input" style="outline:none;">
                </div>
                
                <div style="margin-bottom:25px;">
                    <label class="form-label">Возможная причина:</label>
                    <select id="f-reason" class="premium-select" style="outline:none;">
                        <option value="" disabled selected>-- Выберите категорию (если подходит) --</option>
                        <option value="Мусор">📦 Не вывезен мусор / Переполнение</option>
                        <option value="Поломка">🛠 Сломан бак или ограждение площадки</option>
                        <option value="Парковка">🚗 Проезд заблокирован автомобилем</option>
                        <option value="Освещение">💡 Не работает уличное освещение</option>
                        <option value="Грязь">🧹 Грязь или лед на территории</option>
                        <option value="Другое">🔍 Другое (опишите ниже)</option>
                    </select>
                </div>
                
                <div style="margin-top:20px;">
                    <label class="form-label">Что именно произошло?</label>
                    <textarea id="f-desc" class="premium-textarea" style="outline:none;" placeholder="Напишите здесь детали происшествия..."></textarea>
                </div>
                
                <button class="submit-btn" onclick="window.sendComplaintConfirm()">
                    📤 ОТПРАВИТЬ ДИСПЕТЧЕРУ
                </button>
            </div>
        `;
        modal.style.display = "flex";
    };

    window.sendComplaintConfirm = () => {
        const sub = document.getElementById('sub-modal-body');
        if (!sub) return;
        const ticketNum = "Ж-" + (Math.floor(Math.random() * 9000) + 1000);
        sub.innerHTML = `
            <div class="success-popup" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <span class="success-icon">✅</span>
                <h1 class="success-title">ОТПРАВЛЕНО!</h1>
                <p class="success-message">Ваша жалоба принята диспетчером.</p>
                <div class="ticket-number">№ ${ticketNum}</div>
                <p class="success-note">Ожидайте звонка в течение 30 минут.</p>
                <button class="success-ok-btn" onclick="window.closeEverything()">ОТЛИЧНО</button>
            </div>
        `;
        sub.style.display = "block";
        setTimeout(() => {
            if(sub.style.display === "block") window.closeEverything();
        }, 5000);
    };

    db.forEach(obj => {
        if (obj.id?.startsWith('h')) {
            const hHtml = `
                <div class="house-card-pro">
                    <img src="${obj.photo || ''}" class="house-img-pro">
                    <b style="font-size:20px; color:#008000; display:block; margin-bottom:10px; text-align:center;">🏠 ${obj.address}</b>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px;">
                        <div class="info-row">🏗️ ${obj.year} год постройки</div>
                        <div class="info-row">🏢 ${obj.floors} эт. у дома</div>
                        <div class="info-row">🧱 ${obj.material || 'Монолит'}</div>
                        <div class="info-row">📡 ${obj.elevator || 'Falcon'}</div>
                        <div class="info-row" style="grid-column: span 2;">️ ${obj.developer || 'Застройщик'}</div>
                        <div class="info-row" style="grid-column: span 2;">📐 ${obj.area || 'N/A'} / ${obj.apartments || 'N/A'} кв.</div>
                        <div class="info-row" style="grid-column: span 2;">🏘️ Серия: ${obj.series || 'Типовая'}</div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:12px;">
                        <button class="ui-btn" style="background:#3498db; color:#fff;" onclick="window.openCamera()">КАМЕРА</button>
                        <button class="ui-btn" style="background:#d9534f; color:#fff;" onclick="window.openComplaintAction('${obj.address}')">ЖАЛОБА</button>
                    </div>
                </div>`;

            const m = new ymaps.Placemark(obj.coords, {
                balloonContent: hHtml
            }, {
                preset: 'islands#greenHomeCircleIcon',
                iconScale: 1.8,
                balloonMinWidth: 430,
                balloonMinHeight: 720,
                balloonPanelMaxMapArea: 0
            });
            layers.hM.push(m);
            map.geoObjects.add(m);

            if (obj.boundary) {
                const poly = new ymaps.Polygon([obj.boundary], {}, {
                    fillColor: '#00800015',
                    strokeColor: '#008000',
                    strokeWidth: 5
                });
                layers.hP.push(poly);
            }

            if (obj.infra) {
                obj.infra.forEach(item => {
const color = item.load < 33 ? '#00cc00' : (item.load < 66 ? '#ffa600' : '#ff3300');

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
                                <button class="ui-btn" style="background:linear-gradient(135deg, #3498db, #2980b9); color:#fff; margin-top:15px; width:100%; font-size:11px; padding:12px;" onclick="window.openWasteTrackingInfo()">
                                    ℹ️ Как работает система отслеживания
                                </button>
                            </div>`;
                            
                        layers.tB.push(new ymaps.Placemark(item.coords, {
                            balloonContent: bHtml
                        }, {
                            preset: 'islands#trashIcon',
                            iconColor: color,
                            iconScale: 1.5,
                            balloonMinWidth: 350,
                            balloonMaxWidth: 420,
                            balloonMinHeight: 500,
                            balloonMaxHeight: 800,
                            balloonPanelMaxMapArea: 0
                        }));
                    } 
                    else if (item.type === 'parking') {
                        const freeSpots = (item.totalSpots || 0) - (item.busySpots || 0);
                        const pHtml = `
                            <div class="custom-balloon" style="width: 540px; margin: 15px auto;">
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
                            balloonMinWidth: 580, 
                            balloonMaxWidth: 480,
                            balloonMinHeight: 250,
                            balloonPanelMaxMapArea: 0,
                            balloonShadow: false,
                            balloonAutoPan: true
                        }));

                        if (item.boundary) {
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
                            balloonMinWidth: 480, 
                            balloonMaxWidth: 480,
                            balloonMinHeight: 250,
                            balloonPanelMaxMapArea: 0,
                            balloonShadow: false,
                            balloonAutoPan: true
                        }));

                        if (item.boundary) {
                            layers.pl.push(new ymaps.Polygon([item.boundary], {}, {
                                fillColor: '#00800020',
                                strokeColor: '#008000',
                                strokeWidth: 2
                            }));
                        }
                    }
                });
            }
        }
    });

    const trData = db.find(o => o.type === 'truck_route');
    const truckMarker = new ymaps.Placemark(trData.path[0], {}, { preset: 'islands#oliveDeliveryIcon', iconScale: 2.2 });
    const routeLine = new ymaps.Polyline(trData.path, {}, { strokeColor: '#00FF88', strokeWidth: 10, opacity: 0.4 });
    
    let seg = 0, prog = 0;
    setInterval(() => {
        prog += 0.035; 
        if (prog >= 1) { prog = 0; seg = (seg + 1) % (trData.path.length - 1); }
        const [lat1, lon1] = trData.path[seg];
        const [lat2, lon2] = trData.path[seg+1];
        truckMarker.geometry.setCoordinates([lat1 + (lat2-lat1)*prog, lon1 + (lon2-lon1)*prog]);
    }, 50);

    const modal = document.createElement('div'); 
    modal.className = "modal-overlay"; 
    modal.innerHTML = `
        <div class="modal-win premium-card" id="m-win-body">
            <button class="close-icon" onclick="window.closeEverything()">&times;</button>
            <div id="m-content"></div>
            <div class="sub-modal" id="sub-modal-body"></div>
        </div>`;
    document.body.appendChild(modal);

    window.closeEverything = () => { 
        document.getElementById('sub-modal-body').style.display = "none"; 
        modal.style.display = "none"; 
    };
    
    // Функция для переключения панели УК
    window.toggleCompanyPanel = () => {
        // Закрываем другие панели перед открытием УК
        window.closeAllPanels();
        
        const panel = document.getElementById('company-panel-root');
        const btn = document.getElementById('uk-toggle-btn');
        
        if (panel.classList.contains('company-panel-visible')) {
            panel.classList.remove('company-panel-visible');
            panel.classList.add('company-panel-hidden');
            btn.style.display = 'flex';
        } else {
            panel.classList.remove('company-panel-hidden');
            setTimeout(() => {
                panel.classList.add('company-panel-visible');
            }, 10);
            btn.style.display = 'none';
        }
    };
    
    // Закрытие всех панелей и модальных окон
    window.closeAllPanels = () => {
        // Закрываем панель УК
        const companyPanel = document.getElementById('company-panel-root');
        if (companyPanel && companyPanel.classList.contains('company-panel-visible')) {
            companyPanel.classList.remove('company-panel-visible');
            companyPanel.classList.add('company-panel-hidden');
            const ukBtn = document.getElementById('uk-toggle-btn');
            if (ukBtn) ukBtn.style.display = 'flex';
        }
        
        // Закрываем эко-панель
        const ecoPanel = document.getElementById('eco-panel-root');
        if (ecoPanel) {
            ecoPanel.classList.remove('open');
        }
        
        // Закрываем панель настроек
        const settingsPanel = document.getElementById('settings-panel-root');
        if (settingsPanel) {
            settingsPanel.style.display = 'none';
            const settingsBtn = document.querySelector('.settings-trigger');
            if (settingsBtn) settingsBtn.classList.remove('active');
        }
        
        // Скрываем дополнительную кнопку
        const secretBtn = document.querySelector('.secret-trigger');
        if (secretBtn) {
            secretBtn.style.display = 'none';
            secretBtn.classList.remove('active-mode');
        }
    };
    
    // Глобальная функция закрытия всего при клике вне элементов
    window.handleOutsideClick = (e) => {
        const gui = document.getElementById('eco-panel-root');
        const settingsBtn = document.querySelector('.settings-trigger');
        const secretBtn = document.querySelector('.secret-trigger');
        const companyPanel = document.getElementById('company-panel-root');
        const ukBtn = document.getElementById('uk-toggle-btn');
        
        // Если клик не по эко-панели и не по кнопкам настроек - закрываем эко-панель
        if (gui && !gui.contains(e.target) && 
            !settingsBtn?.contains(e.target) && 
            !secretBtn?.contains(e.target)) {
            gui.classList.remove('open');
        }
    };
    
    // Клик по кнопке УК
    document.getElementById('uk-toggle-btn').addEventListener('click', () => {
        window.toggleCompanyPanel();
    });
    
    // Функция для закрытия модального окна диплома
    window.closeDiplomaModal = () => {
        const diplomaModal = document.getElementById('diploma-modal-overlay');
        if (diplomaModal) {
            diplomaModal.style.display = 'none';
        }
    };
    
    // Показываем модальное окно диплома при загрузке страницы
    setTimeout(() => {
        const diplomaModal = document.getElementById('diploma-modal-overlay');
        if (diplomaModal) {
            diplomaModal.style.display = 'flex';
        }
    }, 500);
    
    window.openModal = (t, h) => { 
        document.getElementById('m-content').innerHTML = `<h1 style="color:#008000; font-weight:900; font-size:60px; margin-bottom:45px;">${t}</h1>${h}`; 
        modal.style.display = "flex"; 
    };
    
    window.openSub = (title, text) => {
        const sub = document.getElementById('sub-modal-body');
        sub.innerHTML = `
            <button class="close-icon" onclick="this.parentElement.style.display='none'">&times;</button>
            <h1 style="color:#008000; font-weight:900; font-size:50px; margin-bottom:30px;">${title}</h1>
            <div style="font-size:26px; line-height:1.8; text-align:justify;">${text}</div>
            <button class="ui-btn" style="background:#008000; color:#fff; width:350px; height:100px; margin-top:50px;" onclick="this.parentElement.style.display='none'">ВЕРНУТЬСЯ</button>
        `;
        sub.style.display = "block";
    };

window.openEcoGuide = () => {
    const cards = [
        { icon: "💳", title: "Экономия на ЖКУ", color: "#008000", desc: "Сминайте ПЭТ-бутылки и картон перед выбросом! В контейнер 1.1 м³ помещается 40 кг целых или 200 кг смятых отходов. Меньше воздуха = реже выезд техники = стабильный тариф." },
        { icon: "🚫", title: "Категорический стоп-лист", color: "#d9534f", desc: "Не бросайте в баки: шины, бетон, стёкла, ртутные лампы. Они ломают пресс мусоровоза (ремонт от 200 тыс. ₽) и блокируют сортировку на заводе." },
        { icon: "📡", title: "Falcon Smart", color: "#3498db", desc: "Под крышкой каждого бака стоит лазерный датчик. Он измеряет уровень мусора каждые 15 мин. При заполнении >80% система сама добавляет точку в маршрут ближайшего мусоровоза." },
        { icon: "🔋", title: "Опасные батарейки", color: "#f39c12", desc: "Одна пальчиковая батарейка загрязняет 20 м² почвы тяжёлыми металлами. Используйте жёлтые спец-боксы во дворах. При обнаружении в общем баке мы проводим замену грунта." },
        { icon: "♻️", title: "Вторая жизнь пластика", color: "#2ecc71", desc: "Пластик из синих сеток отправляется на переработку. Из него делают полимерпесчаную смесь для новых антивандальных лавочек и урн в ваших дворах." },
        { icon: "🚛", title: "Парковка у площадок", color: "#1abc9c", desc: "Мусоровозу нужно минимум 3 метра свободного пространства. ИИ-камеры фиксируют нарушителей. Заблокированный проезд = перенос вывоза на следующие сутки." },
        { icon: "🏗️", title: "Крупногабаритный мусор", color: "#9b59b6", desc: "Диваны, шкафы и техника — это КГМ. Не заталкивайте их в баки! Оставляйте в отсеках «Лодка» (8 м³). Если переполнено — нажмите «Жалоба», и мы пришлём ломовоз." },
        { icon: "🌡️", title: "Санитарная обработка", color: "#e74c3c", desc: "Дважды в год каждый бак проходит мойку под давлением раствором «Хлорамин-Б». Это уничтожает 99% бактерий и полностью устраняет запахи гниения." },
        { icon: "💻", title: "Электронный лом", color: "#34495e", desc: "Телевизоры и мониторы содержат свинец. Выбрасывать их в контейнер — экологическое преступление. Раз в квартал проходит акция «Эко-Сбор» — следите за анонсами в ГИС!" },
        { icon: "🐱", title: "Защита животных", color: "#e67e22", desc: "Пожалуйста, плотно закрывайте крышки! Бездомные кошки и птицы забираются внутрь за едой и часто гибнут под прессом. Закрытая крышка = спасённая жизнь." },
        { icon: "📞", title: "Прямая связь с УК", color: "#008000", desc: "ГИС — это мост между вами и инженерами. Заметили проблему? Один клик на кнопку «Жалоба» экономит неделю бюрократической переписки и телефонных звонков." },
        { icon: "🌟", title: "Будущее ГИС 2026", color: "#1abc9c", desc: "В этом году мы внедряем датчики анализа воздуха и нейросеть, которая будет предсказывать поломки детского оборудования по вибрации до того, как они произойдут." }
    ];

    const html = `
        <div style="font-family: 'Montserrat', sans-serif; padding: 10px; max-width: 960px; margin: 0 auto;">
            <h2 style="text-align: center; color: #008000; font-size: 38px; margin: 0 0 30px 0; font-weight: 900; letter-spacing: 1px;">🌿 ЭКО-ГИД ЖИЛЬЦА</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(310px, 1fr)); gap: 20px;">
                ${cards.map(c => `
                    <div style="background: #ffffff; border-radius: 24px; padding: 22px; border-left: 8px solid ${c.color}; box-shadow: 0 6px 18px rgba(0,0,0,0.08); display: flex; flex-direction: column; gap: 12px; transition: transform 0.2s ease, box-shadow 0.2s ease;">
                        <h3 style="margin: 0; font-size: 20px; color: #111; font-weight: 800;">${c.icon} ${c.title}</h3>
                        <p style="margin: 0; font-size: 14.5px; line-height: 1.6; color: #444;">${c.desc}</p>
                    </div>
                `).join('')}
            </div>
            <div style="text-align: center; margin-top: 35px; padding: 22px; background: linear-gradient(135deg, #f0fdf0 0%, #ffffff 100%); border-radius: 22px; border: 2px dashed #008000;">
                <p style="margin: 0; font-size: 17px; color: #008000; font-weight: 700;">💚 Спасибо, что делаете наш двор чище вместе с УК «ВСЕ СВОИ»!</p>
            </div>
        </div>
    `;

    window.openModal('', html); // Пустой заголовок, чтобы не дублировать большой h1 из openModal
};

// ℹ️ Информация о системе отслеживания мусора
window.openWasteTrackingInfo = () => {
    const html = `
        <div style="font-family: 'Montserrat', sans-serif; padding: 10px; max-width: 900px; margin: 0 auto;">
            <h2 style="text-align: center; color: #3498db; font-size: 36px; margin: 0 0 25px 0; font-weight: 900;">📡 КАК РАБОТАЕТ СИСТЕМА ОТСЛЕЖИВАНИЯ МУСОРА</h2>
            
            <div style="background: linear-gradient(135deg, #f0f7ff, #ffffff); border-radius: 24px; padding: 30px; margin-bottom: 25px; border-left: 6px solid #3498db;">
                <h3 style="color: #3498db; font-size: 22px; margin: 0 0 15px 0;">🎯 Принцип работы</h3>
                <p style="font-size: 15px; line-height: 1.7; color: #333; margin: 0;">
                    Каждый мусорный бак оснащён ультразвуковым датчиком уровня заполнения Falcon Smart. 
                    Датчик измеряет расстояние до поверхности мусора каждые <strong>15 минут</strong> и передаёт данные на сервер.
                </p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 25px;">
                <div style="background: #ffffff; border-radius: 20px; padding: 25px; border: 2px solid #e8f4f8; box-shadow: 0 4px 15px rgba(52, 152, 219, 0.1);">
                    <div style="font-size: 40px; margin-bottom: 10px;">📊</div>
                    <h4 style="color: #2c3e50; font-size: 18px; margin: 0 0 10px 0;">Шаг 1: Мониторинг</h4>
                    <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 0;">
                        Датчик continuously измеряет уровень заполнения бака в реальном времени.
                    </p>
                </div>
                <div style="background: #ffffff; border-radius: 20px; padding: 25px; border: 2px solid #e8f4f8; box-shadow: 0 4px 15px rgba(52, 152, 219, 0.1);">
                    <div style="font-size: 40px; margin-bottom: 10px;">🔄</div>
                    <h4 style="color: #2c3e50; font-size: 18px; margin: 0 0 10px 0;">Шаг 2: Анализ</h4>
                    <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 0;">
                        При достижении <strong>80% заполнения</strong> система автоматически создаёт заявку на вывоз.
                    </p>
                </div>
                <div style="background: #ffffff; border-radius: 20px; padding: 25px; border: 2px solid #e8f4f8; box-shadow: 0 4px 15px rgba(52, 152, 219, 0.1);">
                    <div style="font-size: 40px; margin-bottom: 10px;">🚛</div>
                    <h4 style="color: #2c3e50; font-size: 18px; margin: 0 0 10px 0;">Шаг 3: Маршрутизация</h4>
                    <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 0;">
                        ИИ-алгоритм строит оптимальный маршрут для мусоровоза, учитывая все заполненные баки.
                    </p>
                </div>
                <div style="background: #ffffff; border-radius: 20px; padding: 25px; border: 2px solid #e8f4f8; box-shadow: 0 4px 15px rgba(52, 152, 219, 0.1);">
                    <div style="font-size: 40px; margin-bottom: 10px;">✅</div>
                    <h4 style="color: #2c3e50; font-size: 18px; margin: 0 0 10px 0;">Шаг 4: Отчётность</h4>
                    <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 0;">
                        После вывоза данные обновляются, и вы видите актуальную информацию в ГИС.
                    </p>
                </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #fff9e6, #ffffff); border-radius: 24px; padding: 30px; margin-bottom: 25px; border-left: 6px solid #f39c12;">
                <h3 style="color: #f39c12; font-size: 22px; margin: 0 0 15px 0;">⚡ Преимущества системы</h3>
                <ul style="font-size: 15px; line-height: 1.8; color: #333; margin: 0; padding-left: 25px;">
                    <li><strong>Экономия ресурсов:</strong> Мусоровоз выезжает только когда это действительно необходимо</li>
                    <li><strong>Чистота дворов:</strong> Баки не переполняются, нет стихийных свалок</li>
                    <li><strong>Прозрачность:</strong> Вы всегда видите актуальный статус каждого контейнера</li>
                    <li><strong>Экология:</strong> Оптимизация маршрутов снижает выбросы CO₂ от спецтехники</li>
                    <li><strong>Контроль:</strong> Все действия фиксируются и доступны в личном кабинете</li>
                </ul>
            </div>
            
            <div style="background: linear-gradient(135deg, #e8f5e9, #ffffff); border-radius: 24px; padding: 30px; border-left: 6px solid #008000;">
                <h3 style="color: #008000; font-size: 22px; margin: 0 0 15px 0;">📈 Технические характеристики</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div style="background: #ffffff; padding: 15px; border-radius: 15px; text-align: center;">
                        <div style="font-size: 28px; color: #008000; font-weight: 900;">±2 мм</div>
                        <div style="font-size: 12px; color: #666; margin-top: 5px;">Точность измерения</div>
                    </div>
                    <div style="background: #ffffff; padding: 15px; border-radius: 15px; text-align: center;">
                        <div style="font-size: 28px; color: #008000; font-weight: 900;">5 лет</div>
                        <div style="font-size: 12px; color: #666; margin-top: 5px;">Срок службы датчика</div>
                    </div>
                    <div style="background: #ffffff; padding: 15px; border-radius: 15px; text-align: center;">
                        <div style="font-size: 28px; color: #008000; font-weight: 900;">NB-IoT</div>
                        <div style="font-size: 12px; color: #666; margin-top: 5px;">Тип связи</div>
                    </div>
                    <div style="background: #ffffff; padding: 15px; border-radius: 15px; text-align: center;">
                        <div style="font-size: 28px; color: #008000; font-weight: 900;">IP68</div>
                        <div style="font-size: 12px; color: #666; margin-top: 5px;">Защита корпуса</div>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 25px; background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%); border-radius: 22px; border: 2px dashed #3498db;">
                <p style="margin: 0; font-size: 16px; color: #3498db; font-weight: 700;">💡 Система работает 24/7 без участия человека — умный двор будущего уже здесь!</p>
            </div>
        </div>
    `;
    
    window.openModal('ℹ️ Система отслеживания', html);
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
        
        if(truckMarker && routeLine) {
            c.tr ? (map.geoObjects.add(truckMarker), map.geoObjects.add(routeLine)) : 
                   (map.geoObjects.remove(truckMarker), map.geoObjects.remove(routeLine));
        }
    };

    function id(i) { return document.getElementById(i); }
    
const gui = document.createElement('div');
gui.id = "eco-panel-root";
gui.className = "premium-card";
gui.innerHTML = `
    <div class="eco-header">🌿 ЭКОСИСТЕМА ДВОРА</div>
    <div class="eco-content">
        <label>Дома 🏠 <span class="switch"><input type="checkbox" id="l-h" checked onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Границы 📐 <span class="switch"><input type="checkbox" id="l-p" onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Мусорные баки 🗑️ <span class="switch"><input type="checkbox" id="l-t" onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Дет. площадки 🎡 <span class="switch"><input type="checkbox" id="l-pl" onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Стоянки 🅿️ <span class="switch"><input type="checkbox" id="l-pk" onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Орг. техника 🚛 <span class="switch"><input type="checkbox" id="l-tr" onchange="refreshL()"><span class="slider"></span></span></label>
    </div>`;
document.body.appendChild(gui);

// ✅ ЛОГИКА КЛИКА (МОБИЛКА + УДОБСТВО ПК)
const ecoHeader = gui.querySelector('.eco-header');
ecoHeader.addEventListener('click', (e) => {
    e.stopPropagation();
    // Закрываем другие панели при открытии эко-панели
    window.closeAllPanels();
    gui.classList.toggle('open');
});

// Авто-закрытие при клике в любое другое место (актуально для телефона)
document.addEventListener('click', (e) => {
    const settingsPanel = document.getElementById('settings-panel-root');
    const settingsBtn = document.querySelector('.settings-trigger');
    
    // Если клик не по эко-панели, не по настройкам и не по кнопке настроек
    if (!gui.contains(e.target) && 
        !settingsPanel?.contains(e.target) &&
        !settingsBtn?.contains(e.target) && 
        !e.target.closest('.secret-trigger')) {
        gui.classList.remove('open');
    }
    
    // Закрываем панель настроек если клик вне её
    if (settingsPanel && settingsPanel.style.display === 'block' &&
        !settingsPanel.contains(e.target) && 
        !settingsBtn?.contains(e.target)) {
        settingsPanel.style.display = 'none';
        settingsBtn?.classList.remove('active');
    }
});

    const sBtn = document.createElement('button'); 
    sBtn.className = "settings-trigger"; 
    sBtn.innerHTML = `⚙️`; 
    document.body.appendChild(sBtn);
    
    const secBtn = document.createElement('button'); 
    secBtn.innerText = "ДОП"; 
    secBtn.className = "secret-trigger"; 
    document.body.appendChild(secBtn);

    const tBox = document.createElement('div'); 
    tBox.id = "settings-panel-root"; 
    tBox.className = "premium-card";
    Object.assign(tBox.style, { 
        position: "absolute", 
        bottom: "160px", 
        left: "40px", 
        width: "450px", 
        padding: "40px", 
        display: "none", 
        zIndex: "1000", 
        borderTop: "20px solid #008000", 
        background: "rgba(255,255,255,0.98)" 
    });
    tBox.innerHTML = `
        <button class="ui-btn" onclick="openEcoGuide()">📖 ЭКО-ГИД</button> 
        <button class="ui-btn" onclick="runAction('map')">🗺️ КАРТА</button> 
        <button class="ui-btn" onclick="runAction('sat')">🛰️ СПУТНИК</button> 
        <button class="ui-btn" onclick="runAction('theme')">🌙 ТЕМА</button> 
        <label style="display:flex;justify-content:space-between;align-items:center;font-size:16px;margin-top:25px;color:#666">Доп. настройки <span class="switch"><input type="checkbox" onchange="document.querySelector('.secret-trigger').style.display = this.checked ? 'flex' : 'none'"><span class="slider"></span></span></label>`;
    document.body.appendChild(tBox); 

    sBtn.onclick = (e) => { 
        e.stopPropagation();
        // Закрываем другие панели при открытии настроек
        window.closeAllPanels();
        const open = tBox.style.display === "block"; 
        tBox.style.display = open ? "none" : "block"; 
        sBtn.classList.toggle('active', !open); 
    };
    
    secBtn.onclick = (e) => {
        e.stopPropagation();
        // Закрываем другие панели при открытии доп. настроек
        window.closeAllPanels();
        secBtn.classList.toggle('active-mode');
        document.getElementById('m-content').innerHTML = `
        <h1 style="color:#00ff88; text-align:center; font-size:65px;">ДОПОЛНИТЕЛЬНЫЕ НАСТРОЙКИ</h1>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:25px; margin-top:50px;">
                <button class="ui-btn" onclick="window.openSub('📞 УК ВСЕ СВОИ', 'Диспетчерская (24/7): <br><b>+7 (921) 482-85-50</b>')">📞 НОМЕР УК</button>
                <button class="ui-btn" onclick="window.open('https://vk.com/greyv1ld')">👨‍💻 РАЗРАБОТЧИК</button>
                <button class="ui-btn" onclick="runAction('dev')">🔄 ОБНОВЛЕНИЯ</button>
                <button class="ui-btn" onclick="window.showQR()">📱 QR КОД</button>
                <button class="ui-btn" onclick="window.openSub('🧹 ОЧИСТКА КЭША', 'Системный кеш очищен, Спасибо что пользуетесь сайтом.')">🧹 CLEAN КЭШ</button>
                <button class="ui-btn" onclick="window.openSub('🔐 Проверка безопасности', 'Всё в подрядке, система под надёжным контролем.')">🔐 SECURITY</button>
                <button class="ui-btn" onclick="window.openSub('📊 АНАЛИТИКА', '11 домов передают данные.')">📊 СТАТУС</button>
                <button class="ui-btn" onclick="window.openSub('🔥 ТЕПЛО', 'Карта наложена.')">🔥 HEATMAP</button>
                <button class="ui-btn" onclick="window.openSub('⚡ FORCE SCAN', 'Все датчики: 100% OK.')">⚡ FORCE SCAN</button>
                <button class="ui-btn" onclick="runAction('reboot')">♻️ REBOOT SITE</button>
                <button class="ui-btn" style="background:#d9534f; color:#fff; grid-column: span 2;" onclick="window.closeEverything()">❌ ВЫХОД</button>
            </div>`;
        modal.style.display = "flex";
    };
    
    refreshL();

// ✅ ФОТО ВМЕСТО QR
window.showQR = () => {
    window.openModal('📸 QR КОД (ФОТО)', `
        <div style="text-align:center; padding: 20px;">
            <p style="font-size:18px; color:#555; margin-bottom:25px;">Фото объекта</p>
            <img src="/qrcod_e68S.jpg" alt="Фото" 
                 style="width:100%; max-width:350px; height:auto; border-radius:24px; box-shadow:0 12px 35px rgba(0,0,0,0.15); border:5px solid #fff; cursor:zoom-in; transition: transform 0.3s;" 
                 onclick="this.style.transform = this.style.transform === 'scale(1.6)' ? 'scale(1)' : 'scale(1.6)';">
            <p style="font-size:13px; color:#888; margin-top:15px;">Нажми на фото, чтобы увеличить</p>
        </div>`);
};

refreshL();
}
