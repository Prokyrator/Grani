// ==========================================
// gameConfig.js - ВСЕ НАСТРОЙКИ ИГРЫ
// ==========================================

// ----- РАЗМЕРЫ МИРА (30x20 клеток, 64 пикселя каждая) -----
const WORLD = {
    cols: 30,              // 30 клеток по ширине
    rows: 20,              // 20 клеток по высоте
    cellSize: 64,          // 64 пикселя на клетку
};

// Вычисляем размер мира в пикселях
WORLD.width = WORLD.cols * WORLD.cellSize;   // 1920 пикселей
WORLD.height = WORLD.rows * WORLD.cellSize;  // 1280 пикселей

// ----- ЗОНЫ ДЛЯ БОЯ -----
const ZONES = {
    HEAD: 'Голова',
    ARMS: 'Руки',
    BODY: 'Корпус',
    LEGS: 'Ноги'
};

const ZONE_LIST = [ZONES.HEAD, ZONES.ARMS, ZONES.BODY, ZONES.LEGS];

// ----- СТАТЫ ИГРОКА -----
const PLAYER_STATS = {
    hp: 100,
    maxHp: 100,
    strength: 5,
    agility: 5,
    defense: 2,
    vitality: 5,
    level: 1,
    exp: 0,
    expToNext: 20
};

// ----- СТАТЫ МОНСТРОВ -----
const MONSTER_BASE = {
    hp: 30,
    strength: 3,
    agility: 2,
    defense: 1,
    vitality: 2,
    expReward: 10
};

// ----- НАСТРОЙКИ БОЯ -----
const BATTLE = {
    zones: ZONE_LIST,
    damageModifiers: {
        'Голова': 1.5,
        'Руки': 1.0,
        'Корпус': 1.2,
        'Ноги': 0.8
    },
    dodgeMultiplier: 2
};

// ----- НАСТРОЙКИ МИРА -----
const WORLD_CONFIG = {
    monsterCount: 15,
    maxMonsters: 20,
    respawnDelay: 5000,
};