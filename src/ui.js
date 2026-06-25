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

console.log('✅ UI загружен');