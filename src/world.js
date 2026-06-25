// ==========================================
// world.js - КАРТА И КЛЕТКИ
// ==========================================

// ----- ПЕРЕВОД КЛЕТКИ В ПИКСЕЛИ (центр клетки) -----
window.cellToPixel = function(col, row) {
    return {
        x: col * WORLD.cellSize + WORLD.cellSize / 2,
        y: row * WORLD.cellSize + WORLD.cellSize / 2
    };
};

// ----- ПЕРЕВОД ПИКСЕЛЕЙ В КЛЕТКУ -----
window.pixelToCell = function(px, py) {
    return {
        col: Math.floor(px / WORLD.cellSize),
        row: Math.floor(py / WORLD.cellSize)
    };
};

// ----- ОТРИСОВКА МИРА (фон + сетка) -----
window.drawWorld = function(scene) {
    // Фон (зелёная трава)
    const bg = scene.add.graphics();
    bg.fillStyle(0x2d8a4e);
    bg.fillRect(0, 0, WORLD.width, WORLD.height);
    bg.setDepth(0);
    
    // Сетка (тонкие линии)
    for (let i = 0; i <= WORLD.cols; i++) {
        const x = i * WORLD.cellSize;
        const line = scene.add.graphics();
        line.lineStyle(1, 0x3a9d5e, 0.5);
        line.lineBetween(x, 0, x, WORLD.height);
        line.setDepth(1);
    }
    for (let i = 0; i <= WORLD.rows; i++) {
        const y = i * WORLD.cellSize;
        const line = scene.add.graphics();
        line.lineStyle(1, 0x3a9d5e, 0.5);
        line.lineBetween(0, y, WORLD.width, y);
        line.setDepth(1);
    }
};

// ----- ПОЛУЧИТЬ СПИСОК СУЩЕСТВ НА КЛЕТКЕ ИГРОКА -----
window.getEntitiesOnPlayerCell = function() {
    const col = player.col;
    const row = player.row;
    const entities = [];
    
    // Сам игрок
    entities.push({
        type: 'player',
        name: 'Ты',
        ref: player
    });
    
    // Монстры на этой клетке
    const monstersHere = getMonstersOnCell(col, row);
    for (const m of monstersHere) {
        entities.push({
            type: 'monster',
            name: 'Монстр ' + (m.stats.hp > 0 ? '❤️' : '💀'),
            ref: m
        });
    }
    
    return entities;
};