// ==============================================================
// ui.js — ИНТЕРФЕЙС
// ==============================================================

const coordDisplay = document.getElementById('coord-display');
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');
const btnCharacter = document.getElementById('btn-character');
const btnInventory = document.getElementById('btn-inventory');

// ----- КООРДИНАТЫ -----
function updateCoords(col, row) {
    coordDisplay.textContent = `📍 ${col}:${row}`;
}

// ----- МОДАЛЬНОЕ ОКНО -----
function openModal(title, contentHTML) {
    modalTitle.textContent = title;
    modalContent.innerHTML = contentHTML;
    modalOverlay.classList.remove('modal-hidden');
}

function closeModal() {
    modalOverlay.classList.add('modal-hidden');
}

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// ----- КНОПКИ ХЕДЕРА -----
btnCharacter.addEventListener('click', () => {
    openModal('Персонаж', `
        <p><strong>Имя:</strong> ${player.name}</p>
        <p><strong>Уровень:</strong> ${player.level}</p>
        <p><strong>HP:</strong> ${player.hp} / ${player.maxHp}</p>
        <p><strong>MP:</strong> ${player.mp} / ${player.maxMp}</p>
        <p><strong>Опыт:</strong> ${player.exp} / ${player.maxExp}</p>
        <p><strong>Золото:</strong> ${player.gold}</p>
        <p><strong>Кристаллы:</strong> ${player.crystals}</p>
        <p><strong>Души:</strong> ${player.souls} / ${player.maxSouls}</p>
    `);
});

btnInventory.addEventListener('click', () => {
    openModal('Инвентарь', `
        <p>Здесь будет инвентарь.</p>
    `);
});

// ----- ЗАКРЫТИЕ ПО ESC -----
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});



// ----- СТАТЫ В ХЕДЕРЕ -----
function updateStats() {
    document.getElementById('hp-bar').style.width = (player.hp / player.maxHp * 100) + '%';
    document.getElementById('hp-values').textContent = player.hp + '/' + player.maxHp;

    document.getElementById('mp-bar').style.width = (player.mp / player.maxMp * 100) + '%';
    document.getElementById('mp-values').textContent = player.mp + '/' + player.maxMp;

    document.getElementById('exp-bar').style.width = (player.exp / player.maxExp * 100) + '%';
    document.getElementById('exp-values').textContent = player.exp + '/' + player.maxExp;

    document.getElementById('player-name').innerHTML = player.name + ' <span class="level-badge">[' + player.level + ']</span>';
}

updateStats();



console.log('✅ UI загружен');