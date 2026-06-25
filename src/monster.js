// ==========================================
// monster.js - МОНСТРЫ (спавн, движение, HP)
// ==========================================

// ----- МАССИВ ВСЕХ МОНСТРОВ -----
let monsters = [];

// ----- СОЗДАТЬ МОНСТРА С СО СЛУЧАЙНЫМИ СТАТАМИ -----
window.createMonster = function(col, row) {
    const hp = MONSTER_BASE.hp + Math.floor(Math.random() * 15) - 5;
    const strength = MONSTER_BASE.strength + Math.floor(Math.random() * 3) - 1;
    const agility = MONSTER_BASE.agility + Math.floor(Math.random() * 3) - 1;
    const defense = MONSTER_BASE.defense + Math.floor(Math.random() * 2);
    const vitality = MONSTER_BASE.vitality + Math.floor(Math.random() * 2);
    const expReward = MONSTER_BASE.expReward + Math.floor(Math.random() * 5);

    return {
        // Позиция на карте (в клетках)
        col: col,
        row: row,
        
        // Статы
        stats: {
            hp: hp,
            maxHp: hp,
            strength: strength,
            agility: agility,
            defense: defense,
            vitality: vitality
        },
        
        // Награда за убийство
        expReward: expReward,
        
        // Флаги
        isDead: false,
        isInBattle: false,
        
        // Ссылки на спрайт и полоску HP (устанавливаются при спавне)
        sprite: null,
        hpBar: null,
        
        // Для движения
        moveTimer: 0,
        stepTimer: 0,
        moveDir: { dx: 0, dy: 0 }
    };
};

// ----- СПАВН МОНСТРОВ НА КАРТЕ -----
window.spawnMonsters = function(scene, count) {
    for (let i = 0; i < count; i++) {
        // Ищем свободную клетку
        let col, row, attempts = 0;
        do {
            col = Math.floor(Math.random() * WORLD.cols);
            row = Math.floor(Math.random() * WORLD.rows);
            attempts++;
        } while (isCellOccupied(col, row) && attempts < 100);
        
        if (isCellOccupied(col, row)) continue;
        
        // Создаём монстра
        const monster = createMonster(col, row);
        monsters.push(monster);
        
        // Создаём спрайт
        const pos = cellToPixel(col, row);
        const sprite = scene.add.sprite(pos.x, pos.y, 'monster');
        sprite.setDisplaySize(48, 48);  // Теперь монстры тоже 48x48
        sprite.setTint(0xff4444);
        sprite.setDepth(5);
        sprite.setInteractive();
        
        monster.sprite = sprite;
        sprite.monsterRef = monster;
        
        // Создаём полоску HP
        const hpBar = scene.add.graphics();
        hpBar.setDepth(6);
        monster.hpBar = hpBar;
        updateMonsterHP(monster);
    }
};

// ----- ПРОВЕРКА ЗАНЯТОСТИ КЛЕТКИ (игроком или монстром) -----
window.isCellOccupied = function(col, row) {
    // Проверяем игрока
    if (player.col === col && player.row === row) return true;
    
    // Проверяем всех живых монстров
    for (const m of monsters) {
        if (m.isDead) continue;
        if (m.col === col && m.row === row) return true;
    }
    return false;
};

// ----- ОБНОВЛЕНИЕ ПОЛОСКИ HP МОНСТРА -----
window.updateMonsterHP = function(monster) {
    if (!monster.sprite || !monster.hpBar) return;
    
    const hp = monster.stats.hp;
    const maxHp = monster.stats.maxHp;
    const percent = Math.max(0, hp / maxHp);
    
    const x = monster.sprite.x;
    const y = monster.sprite.y - 30;
    const barWidth = 40;
    const barHeight = 5;
    
    const hpBar = monster.hpBar;
    hpBar.clear();
    
    // Фон полоски (тёмный)
    hpBar.fillStyle(0x333333);
    hpBar.fillRect(x - barWidth/2, y, barWidth, barHeight);
    
    // Заполнение (зелёное, если HP > 50%, иначе красное)
    hpBar.fillStyle(percent > 0.5 ? 0x00ff00 : 0xff0000);
    hpBar.fillRect(x - barWidth/2, y, barWidth * percent, barHeight);
};

// ----- УДАЛЕНИЕ МЁРТВОГО МОНСТРА (скрываем с карты) -----
window.removeDeadMonster = function(monster) {
    monster.isDead = true;
    if (monster.sprite) {
        monster.sprite.setVisible(false);
        monster.sprite.setInteractive(false);
    }
    if (monster.hpBar) {
        monster.hpBar.setVisible(false);
    }
};

// ----- ВОСКРЕШЕНИЕ МОНСТРА (респавн на новой клетке) -----
window.respawnMonster = function(monster) {
    // Ищем свободную клетку
    let col, row, attempts = 0;
    do {
        col = Math.floor(Math.random() * WORLD.cols);
        row = Math.floor(Math.random() * WORLD.rows);
        attempts++;
    } while (isCellOccupied(col, row) && attempts < 100);
    
    if (isCellOccupied(col, row)) return false;
    
    // Обновляем данные
    monster.col = col;
    monster.row = row;
    monster.isDead = false;
    monster.isInBattle = false;
    monster.stats.hp = monster.stats.maxHp;
    
    // Показываем спрайт
    if (monster.sprite) {
        const pos = cellToPixel(col, row);
        monster.sprite.x = pos.x;
        monster.sprite.y = pos.y;
        monster.sprite.setVisible(true);
        monster.sprite.setInteractive(true);
    }
    if (monster.hpBar) {
        monster.hpBar.setVisible(true);
    }
    
    updateMonsterHP(monster);
    return true;
};

// ==========================================
// ДВИЖЕНИЕ МОНСТРОВ (очень медленно)
// ==========================================
window.updateMonsters = function(time, delta) {
    for (const monster of monsters) {
        if (monster.isDead || monster.isInBattle) continue;
        
        // ---- ЗАДЕРЖКА МЕЖДУ ШАГАМИ (ОЧЕНЬ МЕДЛЕННО) ----
        if (!monster.stepTimer) {
            monster.stepTimer = 0;
        }
        monster.stepTimer += delta;
        
        // Монстры ходят РАЗ В 1500-2500 мс (очень медленно)
        const MONSTER_STEP_DELAY = 1500 + Math.random() * 1000;
        if (monster.stepTimer < MONSTER_STEP_DELAY) {
            continue;
        }
        monster.stepTimer = 0;
        
        // ---- СМЕНА НАПРАВЛЕНИЯ (10% шанс) ----
        if (!monster.moveDir || Math.random() < 0.15) {
            monster.moveDir = {
                dx: Math.floor(Math.random() * 3) - 1,
                dy: Math.floor(Math.random() * 3) - 1
            };
        }
        
        // Если стоим на месте — пропускаем
        if (monster.moveDir.dx === 0 && monster.moveDir.dy === 0) continue;
        
        // ---- ПЫТАЕМСЯ ШАГНУТЬ ----
        let newCol = monster.col + monster.moveDir.dx;
        let newRow = monster.row + monster.moveDir.dy;
        
        // Границы
        if (newCol < 0 || newCol >= WORLD.cols) newCol = monster.col;
        if (newRow < 0 || newRow >= WORLD.rows) newRow = monster.row;
        
        // Проверяем занятость
        if (newCol !== monster.col || newRow !== monster.row) {
            if (!isCellOccupied(newCol, newRow)) {
                monster.col = newCol;
                monster.row = newRow;
                
                if (monster.sprite) {
                    const pos = cellToPixel(newCol, newRow);
                    monster.sprite.x = pos.x;
                    monster.sprite.y = pos.y;
                    updateMonsterHP(monster);
                }
            } else {
                // Если клетка занята — меняем направление
                monster.moveDir = {
                    dx: Math.floor(Math.random() * 3) - 1,
                    dy: Math.floor(Math.random() * 3) - 1
                };
            }
        }
    }
};

// ----- ПОЛУЧИТЬ МОНСТРОВ НА КОНКРЕТНОЙ КЛЕТКЕ -----
window.getMonstersOnCell = function(col, row) {
    const result = [];
    for (const m of monsters) {
        if (m.isDead) continue;
        if (m.col === col && m.row === row) {
            result.push(m);
        }
    }
    return result;
};