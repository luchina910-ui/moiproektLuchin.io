const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 1. МАРШРУТ СПЕЦТЕХНИКИ (Путь мусоровоза)
const fullPath = [
    [64.5278, 39.7848], [64.5365, 39.7828], [64.5564, 39.7787],
    [64.5532, 39.7596], [64.5544, 39.7570], [64.5664, 39.8390]
];

// 2. БАЗА ДАННЫХ ВСЕХ 11 ДОМОВ
const objects = [
    // --- ДОМ 1 ---
    { 
        id: "h1", address: "пр-кт Беломорский, 56", coords: [64.5624, 39.8495], floors: 9, year: 2023,
        boundary: [[64.5625,39.8490], [64.5626,39.8495], [64.5622,39.8498], [64.5621,39.8498]], // Граница дома
        infra: [
            { type: "trash_bin", title: "Общий бак №1", coords: [64.5626, 39.8498], load: 15, sensor: "Falcon v2", material: "Пластиковый", volL: "1100" },
            { type: "trash_bin", title: "Общий бак №2", coords: [64.5627, 39.8499], load: 85, sensor: "Falcon v2", material: "Пластиковый", volL: "1100" },
            { type: "tko_bin", title: "Бункер ТКО", coords: [64.5623, 39.8502], load: 40, sensor: "Falcon v2", material: "Металл", volL: "8000" },
            { type: "parking", title: "Стоянка Юг", coords: [64.5627, 39.8485], totalSpots: 40, busySpots: 12, boundary: [[64.5626,39.8484], [64.5628,39.8486]] },
            { type: "playground", title: "Детская зона", coords: [64.5621, 39.8490], ageLimit: "3-12 лет", hasSport: "Да", surface: "Резиновое", boundary: [[64.5620,39.8489], [64.5622,39.8491]] }
        ]
    },
    // --- ДОМ 2 ---
    { 
        id: "h2", address: "ул. Крымская, 2", coords: [64.5568, 39.7552], floors: 8, year: 2021,
        boundary: [[64.5570,39.7543], [64.5571,39.7552], [64.5566,39.7556]],
        infra: [
            { type: "trash_bin", title: "Бак 2-1", coords: [64.5566, 39.7561], load: 95, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "trash_bin", title: "Бак 2-2", coords: [64.5567, 39.7562], load: 30, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "tko_bin", title: "ТКО Крым", coords: [64.5568, 39.7563], load: 15, sensor: "Falcon v2", material: "Металл", volL: "8000" },
            { type: "parking", title: "Гостевая", coords: [64.5569, 39.7558], totalSpots: 20, busySpots: 20, boundary: [[64.5568,39.7557], [64.5570,39.7559]] },
            { type: "playground", title: "Игровая", coords: [64.5565, 39.7540], ageLimit: "0-14", hasSport: "Нет", surface: "Песок", boundary: [[64.5564,39.7539], [64.5566,39.7541]] }
        ]
    },
    // --- ДОМ 3 ---
    { 
        id: "h3", address: "ул. Крымская, 6", coords: [64.5554, 39.7564], floors: 9, year: 2022,
        boundary: [[64.5556,39.7558], [64.5558,39.7565], [64.5553,39.7569]],
        infra: [
            { type: "trash_bin", title: "Бак 3-1", coords: [64.5556, 39.7569], load: 10, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "trash_bin", title: "Бак 3-2", coords: [64.5557, 39.7570], load: 45, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "tko_bin", title: "ТКО Север", coords: [64.5558, 39.7571], load: 60, sensor: "Falcon v2", material: "Металл", volL: "8000" },
            { type: "parking", title: "Парковка 1", coords: [64.5552, 39.7568], totalSpots: 15, busySpots: 3, boundary: [[64.5551,39.7567], [64.5553,39.7569]] },
            { type: "playground", title: "Детская 1", coords: [64.5551, 39.7556], ageLimit: "3-8 лет", hasSport: "Да", surface: "Резиновое", boundary: [[64.5550,39.7555], [64.5552,39.7557]] }
        ]
    },
    // --- ДОМ 4 ---
    { 
        id: "h4", address: "ул. Крымская, 8", coords: [64.5548, 39.7576], floors: 9, year: 2024,
        boundary: [[64.5550,39.7570], [64.5552,39.7578], [64.5546,39.7582]],
        infra: [
            { type: "trash_bin", title: "Бак 4-1", coords: [64.5547, 39.7564], load: 82, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "trash_bin", title: "Бак 4-2", coords: [64.5548, 39.7563], load: 5, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "tko_bin", title: "ТКО Центр", coords: [64.5546, 39.7565], load: 33, sensor: "Falcon v2", material: "Металл", volL: "8000" },
            { type: "parking", title: "Парковка 2", coords: [64.5546, 39.7571], totalSpots: 25, busySpots: 12, boundary: [[64.5545,39.7570], [64.5547,39.7572]] },
            { type: "playground", title: "Качели", coords: [64.5542, 39.7561], ageLimit: "0-10", hasSport: "Нет", surface: "Трава", boundary: [[64.5541,39.7560], [64.5543,39.7562]] }
        ]
    },
    // --- ДОМ 5 ---
    { 
        id: "h5", address: "ул. Малая Кудьма, 7", coords: [64.5360, 39.7870], floors: 9, year: 2021,
        boundary: [[64.5362,39.7865], [64.5363,39.7872], [64.5358,39.7875]],
        infra: [
            { type: "trash_bin", title: "Бак 5-1", coords: [64.5361, 39.7877], load: 12, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "trash_bin", title: "Бак 5-2", coords: [64.5362, 39.7878], load: 45, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "tko_bin", title: "ТКО Малая", coords: [64.5363, 39.7879], load: 90, sensor: "Falcon v2", material: "Металл", volL: "8000" },
            { type: "parking", title: "Стоянка Юг", coords: [64.5364, 39.7881], totalSpots: 30, busySpots: 5, boundary: [[64.5363,39.7880], [64.5365,39.7882]] },
            { type: "playground", title: "Горка-парк", coords: [64.5358, 39.7874], ageLimit: "5-15", hasSport: "Да", surface: "Резиновое", boundary: [[64.5357,39.7873], [64.5359,39.7875]] }
        ]
    },
    // --- ДОМ 6 ---
    { 
        id: "h6", address: "ул. Октябрьская, 63", coords: [64.6087, 39.8135], floors: 9, year: 2025,
        boundary: [[64.6089,39.8130], [64.6091,39.8140], [64.6085,39.8142]],
        infra: [
            { type: "trash_bin", title: "Бак 6-1", coords: [64.6088, 39.8144], load: 10, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "trash_bin", title: "Бак 6-2", coords: [64.6089, 39.8145], load: 20, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "tko_bin", title: "ТКО Октябрь", coords: [64.6090, 39.8149], load: 15, sensor: "Falcon v2", material: "Металл", volL: "8000" },
            { type: "parking", title: "Паркинг ЖК", coords: [64.6082, 39.8132], totalSpots: 50, busySpots: 10, boundary: [[64.6081,39.8131], [64.6083,39.8133]] },
            { type: "playground", title: "Спортзона", coords: [64.6083, 39.8145], ageLimit: "12+", hasSport: "Да", surface: "Резиновое", boundary: [[64.6082,39.8144], [64.6084,39.8146]] }
        ]
    },
    // --- ДОМ 7 ---
    { 
        id: "h7", address: "ул. Пионерская, 8", coords: [64.5671, 39.8396], floors: 5, year: 2024,
        infra: [
            { type: "trash_bin", title: "Бак 7-1", coords: [64.5673, 39.8405], load: 55, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "trash_bin", title: "Бак 7-2", coords: [64.5674, 39.8406], load: 88, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "tko_bin", title: "ТКО Пионер", coords: [64.5675, 39.8407], load: 5, sensor: "Falcon v2", material: "Металл", volL: "8000" },
            { type: "parking", title: "Мини-стоянка", coords: [64.5665, 39.8402], totalSpots: 10, busySpots: 9, boundary: [[64.5664,39.8401], [64.5666,39.8403]] },
            { type: "playground", title: "Песочница", coords: [64.5675, 39.8410], ageLimit: "0-6", hasSport: "Нет", surface: "Песок", boundary: [[64.5674,39.8409], [64.5676,39.8411]] }
        ]
    },
    // --- ДОМ 8 ---
    { 
        id: "h8", address: "пр-кт Ленинградский, 105", coords: [64.5100, 40.6358], floors: 12, year: 2023,
        infra: [
            { type: "trash_bin", title: "Бак 8-1", coords: [64.5102, 40.6360], load: 30, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "trash_bin", title: "Бак 8-2", coords: [64.5103, 40.6361], load: 45, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "tko_bin", title: "ТКО Ленингр", coords: [64.5104, 40.6362], load: 92, sensor: "Falcon v2", material: "Металл", volL: "8000" },
            { type: "parking", title: "Гостевая А", coords: [64.5106, 40.6365], totalSpots: 40, busySpots: 15, boundary: [[64.5105,40.6364], [64.5107,40.6366]] },
            { type: "playground", title: "Workout", coords: [64.5098, 40.6362], ageLimit: "10+", hasSport: "Да", surface: "Резиновое", boundary: [[64.5097,40.6361], [64.5099,40.6363]] }
        ]
    },
    // --- ДОМ 9 ---
    { 
        id: "h9", address: "ул. Ломоносова, 171", coords: [64.5421, 40.5217], floors: 9, year: 1976,
        infra: [
            { type: "trash_bin", title: "Бак 9-1", coords: [64.5422, 40.5218], load: 65, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "trash_bin", title: "Бак 9-2", coords: [64.5423, 40.5219], load: 15, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "tko_bin", title: "ТКО Ломон", coords: [64.5424, 40.5220], load: 50, sensor: "Falcon v2", material: "Металл", volL: "8000" },
            { type: "parking", title: "Стоянка", coords: [64.5425, 40.5225], totalSpots: 20, busySpots: 18, boundary: [[64.5424,40.5224], [64.5426,40.5226]] },
            { type: "playground", title: "Двор 90-х", coords: [64.5420, 40.5210], ageLimit: "0-99", hasSport: "Да", surface: "Земля", boundary: [[64.5419,40.5209], [64.5421,40.5211]] }
        ]
    },
    // --- ДОМ 10 ---
    { 
        id: "h10", address: "ул. Октябрят, 30", coords: [64.5314, 40.5991], floors: 9, year: 2020,
        infra: [
            { type: "trash_bin", title: "Бак 10-1", coords: [64.5315, 40.5992], load: 40, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "trash_bin", title: "Бак 10-2", coords: [64.5316, 40.5993], load: 72, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "tko_bin", title: "ТКО Октябрят", coords: [64.5317, 40.5994], load: 12, sensor: "Falcon v2", material: "Металл", volL: "8000" },
            { type: "parking", title: "Парковка 10", coords: [64.5319, 40.5999], totalSpots: 15, busySpots: 5, boundary: [[64.5318,40.5998], [64.5320,40.6000]] },
            { type: "playground", title: "Городок", coords: [64.5310, 40.5990], ageLimit: "3-12", hasSport: "Нет", surface: "Гравий", boundary: [[64.5309,40.5989], [64.5311,40.5991]] }
        ]
    },
    // --- ДОМ 11 ---
    { 
        id: "h11", address: "ул. Северная, 1", coords: [64.5962, 39.8011], floors: 9, year: 2025,
        infra: [
            { type: "trash_bin", title: "Бак 11-1", coords: [64.5965, 39.8015], load: 5, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "trash_bin", title: "Бак 11-2", coords: [64.5966, 39.8016], load: 99, sensor: "Falcon v2", material: "Пластик", volL: "1100" },
            { type: "tko_bin", title: "ТКО Север", coords: [64.5967, 39.8017], load: 0, sensor: "Falcon v2", material: "Металл", volL: "8000" },
            { type: "parking", title: "Северная-П", coords: [64.5969, 39.8019], totalSpots: 60, busySpots: 58, boundary: [[64.5968,39.8018], [64.5970,39.8020]] },
            { type: "playground", title: "Детская 11", coords: [64.5961, 39.8012], ageLimit: "6-16", hasSport: "Да", surface: "Резиновое", boundary: [[64.5960,39.8011], [64.5962,39.8013]] }
        ]
    },

    { id: "truck_route", type: "truck_route", path: fullPath }
];

// API: ОТДАЕМ ДАННЫЕ НА КАРТУ
app.get('/api/objects', (req, res) => {
    res.json({ data: objects });
});

// СТАТИКА (Папка public с HTML/JS/CSS)
app.use(express.static(path.join(__dirname, 'public')));

// ЗАПУСК СЕРВЕРА
app.listen(PORT, () => {
    console.log(`✅ ГИС СЕРВЕР ЗАПУЩЕН: http://localhost:${PORT}`);
    console.log(`🏠 Всего домов загружено: ${objects.length - 1}`);
});
