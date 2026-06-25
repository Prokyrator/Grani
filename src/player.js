// ==============================================================
// player.js — СТАТЫ ИГРОКА
// ==============================================================

const DEFAULT_PLAYER = {
    name: '',
    level: 1,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    exp: 0,
    maxExp: 100,
    gold: 0,
    crystals: 0,
    souls: 0,
    maxSouls: 100,
    col: 10,
    row: 7,
    str: 10,
    dex: 10,
    int: 10,
    vit: 10,
    luck: 5
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