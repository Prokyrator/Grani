// ==============================================================
// main.js — КАРТА НА CANVAS (без Phaser)
// ==============================================================

// ----- НАСТРОЙКИ -----
const TILE_SIZE = 40;
const MAP_COLS = 20;
const MAP_ROWS = 15;
const MAP_WIDTH = MAP_COLS * TILE_SIZE;
const MAP_HEIGHT = MAP_ROWS * TILE_SIZE;
const MOVE_DELAY = 3000;

// ----- ИГРОК -----
let playerCol = 10;
let playerRow = 7;

// ----- ТАЙМЕР -----
let canMove = true;
let timerInterval = null;
let remainingSeconds = 0;

// ----- ЭЛЕМЕНТЫ -----
const container = document.getElementById('game-container');
const timerDisplay = document.getElementById('timer-display');

// ----- CANVAS -----
const canvas = document.createElement('canvas');
canvas.width = MAP_WIDTH;
canvas.height = MAP_HEIGHT;
canvas.style.display = 'block';
canvas.style.margin = '0 auto';
canvas.style.marginTop = '50px';
canvas.style.border = '3px solid #5a3a2a';
canvas.style.borderRadius = '4px';
canvas.style.boxShadow = '0 0 40px rgba(0,0,0,0.8)';
container.appendChild(canvas);

const ctx = canvas.getContext('2d');

// ----- ВЫВОД КООРДИНАТ КАРТЫ В КОНСОЛЬ -----
function logCanvasPosition() {
    const rect = canvas.getBoundingClientRect();
    console.log('📐 КООРДИНАТЫ КАРТЫ:');
    console.log(`   left: ${rect.left}px, top: ${rect.top}px`);
    console.log(`   right: ${rect.right}px, bottom: ${rect.bottom}px`);
    console.log(`   ширина: ${rect.width}px, высота: ${rect.height}px`);
    console.log(`   центр X: ${rect.left + rect.width / 2}px, центр Y: ${rect.top + rect.height / 2}px`);
}

// ----- ТАЙМЕР -----
function startCooldown() {
    canMove = false;
    remainingSeconds = 3;
    timerDisplay.textContent = '⏳ ' + remainingSeconds;
    timerDisplay.className = 'waiting';

    timerInterval = setInterval(() => {
        remainingSeconds--;
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            canMove = true;
            timerDisplay.textContent = 'Готов к движению';
            timerDisplay.className = 'ready';
        } else {
            timerDisplay.textContent = '⏳ ' + remainingSeconds;
        }
    }, 1000);
}

// ----- ОТРИСОВКА -----
function drawMap() {
    ctx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
            const x = col * TILE_SIZE;
            const y = row * TILE_SIZE;
            ctx.fillStyle = '#1a2518';
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#2a3a25';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
        }
    }

    const px = playerCol * TILE_SIZE + TILE_SIZE / 2;
    const py = playerRow * TILE_SIZE + TILE_SIZE / 2;

    ctx.beginPath();
    ctx.arc(px, py, TILE_SIZE / 2 - 4, 0, Math.PI * 2);
    ctx.fillStyle = '#cc8844';
    ctx.fill();
    ctx.strokeStyle = '#ffaa55';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Roboto Condensed", Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${playerCol}:${playerRow}`, px, py + TILE_SIZE / 2 + 16);
}

// ----- ДВИЖЕНИЕ -----
function movePlayer(dCol, dRow) {
    if (!canMove) return;
    const newCol = playerCol + dCol;
    const newRow = playerRow + dRow;
    if (newCol < 0 || newCol >= MAP_COLS || newRow < 0 || newRow >= MAP_ROWS) return;
    playerCol = newCol;
    playerRow = newRow;
    drawMap();
    console.log(`📍 Игрок: ${playerCol}:${playerRow}`);
    startCooldown();
}

// ----- КЛАВИШИ -----
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': e.preventDefault(); movePlayer(0, -1); break;
        case 'ArrowDown': case 's': case 'S': e.preventDefault(); movePlayer(0, 1); break;
        case 'ArrowLeft': case 'a': case 'A': e.preventDefault(); movePlayer(-1, 0); break;
        case 'ArrowRight': case 'd': case 'D': e.preventDefault(); movePlayer(1, 0); break;
    }
});

// ----- ЗАПУСК -----
timerDisplay.textContent = 'Готов к движению';
timerDisplay.className = 'ready';
drawMap();
setTimeout(logCanvasPosition, 100);
window.addEventListener('resize', () => setTimeout(logCanvasPosition, 100));