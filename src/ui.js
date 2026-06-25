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
    coordDisplay.textContent = '📍 ' + col + ':' + row;
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

// ----- ЭКРАН СОЗДАНИЯ ПЕРСОНАЖА -----
function showCreateScreen() {
    const overlay = document.getElementById('modal-overlay');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    const closeBtn = document.getElementById('modal-close');

    title.textContent = 'Создание персонажа';
    content.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <p style="font-size: 18px; margin-bottom: 20px;">Добро пожаловать в Грани Реальности</p>
            <input type="text" id="create-name" placeholder="Введите имя персонажа" 
                   style="padding: 10px; font-size: 18px; width: 300px; text-align: center;
                          background: #0f0c0a; color: #e8d5b8; border: 2px solid #5a3a2a; 
                          border-radius: 6px; font-family: inherit; outline: none;">
            <br><br>
            <button id="create-btn" style="padding: 10px 40px; font-size: 18px; 
                    background: linear-gradient(180deg, #3a2a1a, #1a0e08); 
                    color: #e8d5b8; border: 2px solid #6a4a2a; border-radius: 6px; 
                    cursor: pointer; font-family: inherit;">
                Создать
            </button>
            <p id="create-error" style="color: #cc2233; margin-top: 12px; font-size: 14px;"></p>
        </div>
    `;
    closeBtn.style.display = 'none';
    overlay.classList.remove('modal-hidden');

    document.getElementById('create-btn').addEventListener('click', () => {
        const nameInput = document.getElementById('create-name');
        const name = nameInput.value.trim();
        const errorEl = document.getElementById('create-error');

        if (name.length < 2) {
            errorEl.textContent = 'Имя должно быть не короче 2 символов';
            return;
        }
        if (name.length > 16) {
            errorEl.textContent = 'Имя должно быть не длиннее 16 символов';
            return;
        }

        createPlayer(name);
        updateStats();
        updateCoords(player.col, player.row);
        drawMap();
        closeBtn.style.display = 'block';
        closeModal();
        console.log('✅ Персонаж создан: ' + player.name);
    });

    document.getElementById('create-name').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('create-btn').click();
        }
    });
}

console.log('✅ UI загружен');