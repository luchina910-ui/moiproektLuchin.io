const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 1. МАРШРУТ СПЕЦТЕХНИКИ
const fullPath = [[64.5278, 39.7848], [64.5365, 39.7828], [64.5564, 39.7787], [64.5532, 39.7596], [64.5664, 39.8390]];

// 2. БАЗА ДАННЫХ (Часть 1: Дома h1 - h6)
const objects = [
    { 
        id: "h1", address: "пр-кт Беломорский, 56", coords: [64.5624, 39.8495], floors: 9, year: 2023,
        photo: "/dom56.jpg", // МЕНЯЙ ПУТЬ К ФОТО ЗДЕСЬ
        boundary: [[64.5625,39.8490], [64.5626,39.8495], [64.5622,39.8498], [64.5621,39.8498]],
        infra: [
            { type: "trash_bin", title: "Бак №1 (1100л)", coords: [64.5626, 39.8498], load: 15 },
            { type: "trash_bin", title: "Бак №2 (1100л)", coords: [64.5627, 39.8499], load: 85 },
            { type: "tko_bin", title: "Бункер ТКО (8м³)", coords: [64.5623, 39.8502], load: 40 },
            { type: "parking", title: "Стоянка", coords: [64.5627, 39.8485], boundary: [[64.5626,39.8484], [64.5628,39.8486], [64.5629, 39.8485]] },
            { type: "playground", title: "Детская площадка", coords: [64.5621, 39.8490], boundary: [[64.5620,39.8489], [64.5622,39.8491], [64.5623, 39.8490]] }
        ]
    },
    { 
        id: "h2", address: "ул. Крымская, 2", coords: [64.5568, 39.7552], floors: 8, year: 2021,
        photo: "/dom2.jpg",
        boundary: [[64.5570,39.7543], [64.5571,39.7552], [64.5566,39.7556]],
        infra: [
            { type: "trash_bin", title: "Бак 1", coords: [64.5566, 39.7561], load: 95 },
            { type: "trash_bin", title: "Бак 2", coords: [64.5567, 39.7562], load: 30 },
            { type: "tko_bin", title: "ТКО Крым", coords: [64.5568, 39.7563], load: 15 },
            { type: "parking", title: "Стоянка", coords: [64.5569, 39.7558], boundary: [[64.5568,39.7557], [64.5570,39.7559]] },
            { type: "playground", title: "Игровая", coords: [64.5565, 39.7540], boundary: [[64.5564,39.7539], [64.5566,39.7541]] }
        ]
    },
    { 
        id: "h3", address: "ул. Крымская, 6", coords: [64.5554, 39.7564], floors: 9, year: 2022,
        photo: "/dom6.jpg",
        boundary: [[64.5556,39.7558], [64.5558,39.7565], [64.5553,39.7569]],
        infra: [
            { type: "trash_bin", title: "Бак 1", coords: [64.5556, 39.7569], load: 10 },
            { type: "trash_bin", title: "Бак 2", coords: [64.5557, 39.7570], load: 45 },
            { type: "tko_bin", title: "ТКО Север", coords: [64.5558, 39.7571], load: 60 },
            { type: "parking", title: "Парковка", coords: [64.5552, 39.7568], boundary: [[64.5551,39.7567], [64.5553,39.7569]] },
            { type: "playground", title: "Детская", coords: [64.5551, 39.7556], boundary: [[64.5550,39.7555], [64.5552,39.7557]] }
        ]
    },
    { 
        id: "h4", address: "ул. Крымская, 8", coords: [64.5548, 39.7576], floors: 9, year: 2024,
        photo: "/dom8.jpg",
        boundary: [[64.5550,39.7570], [64.5552,39.7578], [64.5546,39.7582]],
        infra: [
            { type: "trash_bin", title: "Бак 1", coords: [64.5547, 39.7564], load: 82 },
            { type: "trash_bin", title: "Бак 2", coords: [64.5548, 39.7563], load: 5 },
            { type: "tko_bin", title: "ТКО Центр", coords: [64.5546, 39.7565], load: 33 },
            { type: "parking", title: "Парковка", coords: [64.5546, 39.7571], boundary: [[64.5545,39.7570], [64.5547,39.7572]] },
            { type: "playground", title: "Качели", coords: [64.5542, 39.7561], boundary: [[64.5541,39.7560], [64.5543,39.7562]] }
        ]
    },
    { 
        id: "h5", address: "ул. Малая Кудьма, 7", coords: [64.5360, 39.7870], floors: 9, year: 2021,
        photo: "/dom7.jpg",
        boundary: [[64.5362,39.7865], [64.5363,39.7872], [64.5358,39.7875]],
        infra: [
            { type: "trash_bin", title: "Бак 1", coords: [64.5361, 39.7877], load: 12 },
            { type: "trash_bin", title: "Бак 2", coords: [64.5362, 39.7878], load: 45 },
            { type: "tko_bin", title: "ТКО Малая", coords: [64.5363, 39.7879], load: 90 },
            { type: "parking", title: "Стоянка Юг", coords: [64.5364, 39.7881], boundary: [[64.5363,39.7880], [64.5365,39.7882]] },
            { type: "playground", title: "Горка-парк", coords: [64.5358, 39.7874], boundary: [[64.5357,39.7873], [64.5359,39.7875]] }
        ]
    },
    { 
        id: "h6", address: "ул. Октябрьская, 63", coords: [64.6087, 39.8135], floors: 9, year: 2025,
        photo: "/dom63.jpg",
        boundary: [[64.6089,39.8130], [64.6091,39.8140], [64.6085,39.8142]],
        infra: [
            { type: "trash_bin", title: "Бак 1", coords: [64.6088, 39.8144], load: 10 },
            { type: "trash_bin", title: "Бак 2", coords: [64.6089, 39.8145], load: 20 },
            { type: "tko_bin", title: "ТКО Октябрь", coords: [64.6090, 39.8149], load: 15 },
            { type: "parking", title: "Паркинг ЖК", coords: [64.6082, 39.8132], boundary: [[64.6081,39.8131], [64.6083,39.8133]] },
            { type: "playground", title: "Спортзона", coords: [64.6083, 39.8145], boundary: [[64.6082,39.8144], [64.6084,39.8146]] }
        ]
    },
    { 
        id: "h7", address: "ул. Пионерская, 8", coords: [64.5671, 39.8396], floors: 5, year: 2024,
        photo: "/img/h7.jpg",
        infra: [
            { type: "trash_bin", title: "Бак 1", coords: [64.5673, 39.8405], load: 55 },
            { type: "trash_bin", title: "Бак 2", coords: [64.5674, 39.8406], load: 88 },
            { type: "tko_bin", title: "ТКО Пионер", coords: [64.5675, 39.8407], load: 5 },
            { type: "parking", title: "Мини-стоянка", coords: [64.5665, 39.8402], boundary: [[64.5664,39.8401], [64.5666,39.8403]] },
            { type: "playground", title: "Песочница", coords: [64.5675, 39.8410], boundary: [[64.5674,39.8409], [64.5676,39.8411]] }
        ]
    },
    { 
        id: "h8", address: "пр-кт Ленинградский, 105", coords: [64.5100, 40.6358], floors: 12, year: 2023,
        photo: "/img/h8.jpg",
        infra: [
            { type: "trash_bin", title: "Бак 1", coords: [64.5102, 40.6360], load: 30 },
            { type: "trash_bin", title: "Бак 2", coords: [64.5103, 40.6361], load: 45 },
            { type: "tko_bin", title: "ТКО Ленингр", coords: [64.5104, 40.6362], load: 92 },
            { type: "parking", title: "Гостевая А", coords: [64.5106, 40.6365], boundary: [[64.5105,40.6364], [64.5107,40.6366]] },
            { type: "playground", title: "Workout", coords: [64.5098, 40.6362], boundary: [[64.5097,40.6361], [64.5099,40.6363]] }
        ]
    },
    { 
        id: "h9", address: "ул. Ломоносова, 171", coords: [64.5421, 40.5217], floors: 9, year: 1976,
        photo: "/img/h9.jpg",
        infra: [
            { type: "trash_bin", title: "Бак 1", coords: [64.5422, 40.5218], load: 65 },
            { type: "trash_bin", title: "Бак 2", coords: [64.5423, 40.5219], load: 15 },
            { type: "tko_bin", title: "ТКО Ломон", coords: [64.5424, 40.5220], load: 50 },
            { type: "parking", title: "Стоянка", coords: [64.5425, 40.5225], boundary: [[64.5424,40.5224], [64.5426,40.5226]] },
            { type: "playground", title: "Двор 90-х", coords: [64.5420, 40.5210], boundary: [[64.5419,40.5209], [64.5421,40.5211]] }
        ]
    },
    { 
        id: "h10", address: "ул. Октябрят, 30", coords: [64.5314, 40.5991], floors: 9, year: 2020,
        photo: "/img/h10.jpg",
        infra: [
            { type: "trash_bin", title: "Бак 1", coords: [64.5315, 40.5992], load: 40 },
            { type: "trash_bin", title: "Бак 2", coords: [64.5316, 40.5993], load: 72 },
            { type: "tko_bin", title: "ТКО Октябрят", coords: [64.5317, 40.5994], load: 12 },
            { type: "parking", title: "Парковка 10", coords: [64.5319, 40.5999], boundary: [[64.5318,40.5998], [64.5320,40.6000]] },
            { type: "playground", title: "Городок", coords: [64.5310, 40.5990], boundary: [[64.5309,40.5989], [64.5311,40.5991]] }
        ]
    },
    { 
        id: "h11", address: "ул. Северная, 1", coords: [64.5962, 39.8011], floors: 9, year: 2025,
        photo: "/img/h11.jpg",
        infra: [
            { type: "trash_bin", title: "Бак 1", coords: [64.5965, 39.8015], load: 5 },
            { type: "trash_bin", title: "Бак 2", coords: [64.5966, 39.8016], load: 99 },
            { type: "tko_bin", title: "ТКО Север", coords: [64.5967, 39.8017], load: 0 },
            { type: "parking", title: "Северная-П", coords: [64.5969, 39.8019], boundary: [[64.5968,39.8018], [64.5970,39.8020]] },
            { type: "playground", title: "Детская 11", coords: [64.5961, 39.8012], boundary: [[64.5960,39.8011], [64.5962,39.8013]] }
        ]
    },
    { id: "truck_route", type: "truck_route", path: fullPath }
];

// API МАРШРУТЫ
app.get('/api/objects', (req, res) => { res.json({ data: objects }); });
app.use(express.static(path.join(__dirname, 'public')));

// ЗАПУСК
app.listen(PORT, () => {
    console.log(`✅ ГИС СЕРВЕР ЗАПУЩЕН: http://localhost:${PORT}`);
});

