// ==========================================
// ui.js - ИНТЕРФЕЙС ВНЕ БОЯ
// ==========================================

// Хранилище для текстовых элементов интерфейса
let uiElements = {};

// ==========================================
// СОЗДАНИЕ ИНТЕРФЕЙСА
// ==========================================
function createUI(scene) {
    // ---- 1. ИНФОРМАЦИЯ ОБ ИГРОКЕ (сверху слева) ----
    // Показывает уровень, опыт, HP, силу, защиту, ловкость
    const statsText = scene.add.text(16, 16, '', {
        fontSize: '14px',
        fill: '#cccccc',
        fontFamily: 'Arial',
        backgroundColor: '#00000066',
        padding: { x: 8, y: 4 }
    }).setScrollFactor(0).setDepth(100);
    uiElements.statsInfo = statsText;
    
    // ---- 2. ЗАГОЛОВОК "Существа на клетке" ----
    // Показывает название списка существ на текущей клетке
    const title = scene.add.text(16, scene.scale.height - 108, '📋 Существа на клетке:', {
        fontSize: '14px',
        fill: '#ffdd44',
        fontFamily: 'Arial',
        backgroundColor: '#00000066',
        padding: { x: 4, y: 2 }
    }).setScrollFactor(0).setDepth(100);
    uiElements.title = title;
    
    // ---- 3. СПИСОК СУЩЕСТВ (снизу слева) ----
    // Показывает кто находится на клетке с игроком
    const entityText = scene.add.text(16, scene.scale.height - 80, '', {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        backgroundColor: '#00000088',
        padding: { x: 8, y: 4 }
    }).setScrollFactor(0).setDepth(100);
    uiElements.entityList = entityText;
    
    // Сохраняем ссылку на сцену для обновления при ресайзе
    uiElements.scene = scene;
}

// ==========================================
// ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// ==========================================
function updateUI(scene) {
    // Если интерфейс ещё не создан — выходим
    if (!uiElements.entityList) return;
    
    // ---- ОБНОВЛЯЕМ ПОЗИЦИИ ПРИ ИЗМЕНЕНИИ РАЗМЕРА ЭКРАНА ----
    // Чтобы текст всегда был внизу слева, даже если экран меняет размер
    if (uiElements.entityList) {
        uiElements.entityList.setY(scene.scale.height - 80);
    }
    if (uiElements.title) {
        uiElements.title.setY(scene.scale.height - 108);
    }
    
    // ---- 1. ПОЛУЧАЕМ СПИСОК СУЩЕСТВ НА КЛЕТКЕ ИГРОКА ----
    const entities = getEntitiesOnPlayerCell();
    let text = '';
    
    // Проходим по всем существам на клетке
    for (const e of entities) {
        if (e.type === 'player') {
            // Игрок (зелёный кружок)
            text += '🟢 Ты (HP: ' + player.stats.hp + '/' + player.stats.maxHp + ')\n';
        } else if (e.type === 'monster') {
            // Монстр (красный кружок) + процент HP
            const m = e.ref;
            const hpPercent = Math.round((m.stats.hp / m.stats.maxHp) * 100);
            text += '🔴 Монстр [' + hpPercent + '%] (кликни для боя)\n';
        }
    }
    
    // Если на клетке никого нет
    if (text === '') {
        text = 'Никого нет';
    }
    uiElements.entityList.setText(text);
    
    // ---- 2. ОБНОВЛЯЕМ СТАТЫ ИГРОКА ----
    const s = player.stats;
    const statsText = 
        'Уровень: ' + s.level + '  |  Опыт: ' + s.exp + '/' + s.expToNext + '\n' +
        '❤️ HP: ' + s.hp + '/' + s.maxHp + '  |  ⚔️ Сила: ' + s.strength + '  |  🛡️ Защита: ' + s.defense + '  |  💨 Ловкость: ' + s.agility;
    uiElements.statsInfo.setText(statsText);
}