// ==========================================
// player.js - ИГРОК (статы, позиция, функции)
// ==========================================

// ----- ГЛОБАЛЬНЫЙ ОБЪЕКТ ИГРОКА -----
const player = {
    // Координаты на карте (в клетках)
    col: 10,
    row: 10,
    
    // Статы (из gameConfig)
    stats: {
        hp: PLAYER_STATS.hp,
        maxHp: PLAYER_STATS.maxHp,
        strength: PLAYER_STATS.strength,
        agility: PLAYER_STATS.agility,
        defense: PLAYER_STATS.defense,
        vitality: PLAYER_STATS.vitality,
        level: PLAYER_STATS.level,
        exp: PLAYER_STATS.exp,
        expToNext: PLAYER_STATS.expToNext
    },
    
    // Оружие и броня (пока пусто, добавим позже)
    weapon: null,
    armor: null,
    
    // Ссылка на спрайт (устанавливается в main.js)
    sprite: null,
    
    // Флаги
    isInBattle: false,
    
    // Таймер для задержки между шагами
    stepTimer: 0
};

// ----- ПОЛУЧИТЬ ПОЗИЦИЮ В ПИКСЕЛЯХ (центр клетки) -----
function getPlayerPixelPos() {
    return {
        x: player.col * WORLD.cellSize + WORLD.cellSize / 2,
        y: player.row * WORLD.cellSize + WORLD.cellSize / 2
    };
}

// ----- ПРОВЕРИТЬ, ЖИВ ЛИ ИГРОК -----
function isPlayerAlive() {
    return player.stats.hp > 0;
}

// ----- ВЫЛЕЧИТЬ ИГРОКА (после боя) -----
function healPlayer(amount) {
    player.stats.hp = Math.min(player.stats.hp + amount, player.stats.maxHp);
}

// ----- ПОЛНОЕ ВОССТАНОВЛЕНИЕ (воскрешение) -----
function restorePlayer() {
    player.stats.hp = player.stats.maxHp;
    player.isInBattle = false;
}

// ----- РАССЧИТАТЬ УРОН ИГРОКА (сила * 2 + бонус оружия) -----
function calculatePlayerDamage() {
    let base = player.stats.strength * 2;
    if (player.weapon) {
        base += player.weapon.bonus;
    }
    return base;
}

// ----- РАССЧИТАТЬ ЗАЩИТУ ИГРОКА (защита + бонус брони) -----
function calculatePlayerDefense() {
    let base = player.stats.defense;
    if (player.armor) {
        base += player.armor.bonus;
    }
    return base;
}