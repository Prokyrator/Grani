// ==============================================================
// main.js — ТОЧКА ВХОДА
// ==============================================================

console.log('✅ Игра загружена');

if (loadPlayer()) {
    updateStats();
    updateCoords(player.col, player.row);
    drawMap();
    console.log('👤 Загружен персонаж: ' + player.name);
} else {
    showCreateScreen();
    console.log('🆕 Новый игрок — ожидание создания персонажа');
}