// ==============================================================
// player.js — СТАТЫ ИГРОКА
// ==============================================================

const DEFAULT_PLAYER = {
    name: '',
    level: 1,
    hp: 10,
    maxHp: 10,
    mp: 10,
    maxMp: 10,
    exp: 0,
    maxExp: 100,
    gold: 0,
    crystals: 0,
    weight: 0,
    maxWeight: 100,
    col: 10,
    row: 7,
    str: 1,
    dex: 1,
    int: 1,
    vit: 1,
    luck: 1
};

let player = {};

// ----- ЗАГРУЗКА ИЗ localStorage -----
function loadPlayer() {
    const saved = localStorage.getItem('grani_player');
    if (saved) {
        player = JSON.parse(saved);
        return true;
    }
    return false;
}

// ----- СОХРАНЕНИЕ -----
function savePlayer() {
    localStorage.setItem('grani_player', JSON.stringify(player));
}

// ----- СОЗДАНИЕ НОВОГО ПЕРСОНАЖА -----
function createPlayer(name) {
    player = { ...DEFAULT_PLAYER };
    player.name = name;
    savePlayer();
}