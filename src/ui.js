function buildCharacterWindow() {
    return `
        <div class="char-layout">
            <!-- ЛЕВАЯ КОЛОНКА — СТАТЫ -->
            <div class="char-stats">
                <div class="metal-plate plate-header">Характеристики</div>
                <div class="stat-row"><span>Сила</span><span>${player.str || 10}</span></div>
                <div class="stat-row"><span>Ловкость</span><span>${player.dex || 10}</span></div>
                <div class="stat-row"><span>Интуиция</span><span>${player.int || 10}</span></div>
                <div class="stat-row"><span>Выносливость</span><span>${player.vit || 10}</span></div>
                <div class="stat-row"><span>Удача</span><span>${player.luck || 5}</span></div>
            </div>

            <!-- ЦЕНТР — ПЕРСОНАЖ -->
            <div class="char-center">
                <div class="metal-plate plate-header">Персонаж</div>
                <div class="stat-row"><span>Имя</span><span>${player.name}</span></div>
                <div class="stat-row"><span>Уровень</span><span>${player.level}</span></div>
                <div class="stat-row"><span>Опыт</span><span>${player.exp}/${player.maxExp}</span></div>
                <div class="stat-row"><span>HP</span><span>${player.hp}/${player.maxHp}</span></div>
                <div class="stat-row"><span>MP</span><span>${player.mp}/${player.maxMp}</span></div>
            </div>

            <!-- ПРАВАЯ КОЛОНКА — РЕСУРСЫ -->
            <div class="char-resources">
                <div class="metal-plate plate-header">Ресурсы</div>
                <div class="res-item"><span class="res-icon">🪙</span> Золото: ${player.gold}</div>
                <div class="res-item"><span class="res-icon">✨</span> Кристаллы: ${player.crystals}</div>
                <div class="res-item"><span class="res-icon">💀</span> Души: ${player.souls}/${player.maxSouls}</div>
            </div>
        </div>
    `;
}