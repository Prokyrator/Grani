// ==========================================
// battle.js - ВСЯ ЛОГИКА ПОШАГОВОГО БОЯ
// ==========================================

// ----- СОСТОЯНИЕ БОЯ -----
let battleState = {
    active: false,
    monster: null,        // Текущий противник
    playerZone: null,     // Куда бьёт игрок
    blockZone: null,      // Где блокирует игрок
    monsterZone: null,    // Куда бьёт монстр
    monsterBlock: null,   // Где блокирует монстр
    turn: 'player',       // 'player' или 'monster'
    log: []               // История сообщений
};

// Элементы интерфейса боя (хранятся здесь, чтобы можно было удалить)
let battleUI = {};

// ----- НАЧАТЬ БОЙ -----
function startBattle(scene, monster) {
    // Проверки: игрок не в бою, монстр жив и не в бою
    if (player.isInBattle) return;
    if (monster.isDead) return;
    if (monster.isInBattle) return;
    
    // Блокируем игрока и монстра
    player.isInBattle = true;
    monster.isInBattle = true;
    
    // Сбрасываем состояние боя
    battleState.active = true;
    battleState.monster = monster;
    battleState.turn = 'player';
    battleState.log = [];
    battleState.playerZone = null;
    battleState.blockZone = null;
    
    // Создаём интерфейс боя
    createBattleUI(scene);
    updateBattleUI(scene);
    
    // Лог
    addBattleLog('⚔️ Бой начался!');
    addBattleLog('Монстр: HP ' + monster.stats.hp + '/' + monster.stats.maxHp);
}

// ----- СОЗДАТЬ ИНТЕРФЕЙС БОЯ -----
function createBattleUI(scene) {
    // Удаляем старый UI, если есть
    for (const key in battleUI) {
        if (battleUI[key]) {
            battleUI[key].destroy();
        }
    }
    battleUI = {};
    
    const w = scene.scale.width;
    const h = scene.scale.height;
    const centerX = w / 2;
    
    // ---- 1. HP ИГРОКА (сверху слева) ----
    battleUI.playerHP = scene.add.text(20, 20, '', {
        fontSize: '22px',
        fill: '#44ff88',
        fontFamily: 'Arial',
        backgroundColor: '#00000088',
        padding: { x: 10, y: 6 }
    }).setScrollFactor(0).setDepth(200);
    
    // ---- 2. HP МОНСТРА (сверху справа) ----
    battleUI.monsterHP = scene.add.text(w - 220, 20, '', {
        fontSize: '22px',
        fill: '#ff4444',
        fontFamily: 'Arial',
        backgroundColor: '#00000088',
        padding: { x: 10, y: 6 }
    }).setScrollFactor(0).setDepth(200);
    
    // ---- 3. ЗОНЫ УДАРА (слева) ----
    battleUI.attackTitle = scene.add.text(50, h * 0.25, '⚔️ УДАР', {
        fontSize: '20px',
        fill: '#ffdd44',
        fontFamily: 'Arial'
    }).setScrollFactor(0).setDepth(200);
    
    battleUI.attackButtons = {};
    const zoneNames = ['Голова', 'Руки', 'Корпус', 'Ноги'];
    const attackX = 50;
    let attackY = h * 0.25 + 40;
    for (const zone of zoneNames) {
        const btn = scene.add.text(attackX, attackY, '▸ ' + zone, {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#333366',
            padding: { x: 12, y: 4 }
        }).setScrollFactor(0).setDepth(200)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              battleState.playerZone = zone;
              updateBattleUI(scene);
          });
        battleUI.attackButtons[zone] = btn;
        attackY += 45;
    }
    
    // ---- 4. ЗОНЫ БЛОКА (справа) ----
    battleUI.blockTitle = scene.add.text(w - 180, h * 0.25, '🛡️ БЛОК', {
        fontSize: '20px',
        fill: '#44ddff',
        fontFamily: 'Arial'
    }).setScrollFactor(0).setDepth(200);
    
    battleUI.blockButtons = {};
    const blockX = w - 180;
    let blockY = h * 0.25 + 40;
    for (const zone of zoneNames) {
        const btn = scene.add.text(blockX, blockY, '▸ ' + zone, {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#336633',
            padding: { x: 12, y: 4 }
        }).setScrollFactor(0).setDepth(200)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              battleState.blockZone = zone;
              updateBattleUI(scene);
          });
        battleUI.blockButtons[zone] = btn;
        blockY += 45;
    }
    
    // ---- 5. КНОПКА "ХОД" (центр) ----
    battleUI.goButton = scene.add.text(centerX - 50, h * 0.65, '▶ ХОД', {
        fontSize: '28px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        backgroundColor: '#e94560',
        padding: { x: 25, y: 12 }
    }).setScrollFactor(0).setDepth(200)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
          if (battleState.turn === 'player') {
              executePlayerTurn(scene);
          }
      });
    
    // ---- 6. ЛОГ БОЯ (внизу) ----
    battleUI.logText = scene.add.text(20, h - 120, '', {
        fontSize: '14px',
        fill: '#cccccc',
        fontFamily: 'Arial',
        backgroundColor: '#00000088',
        padding: { x: 8, y: 4 },
        wordWrap: { width: w - 40 }
    }).setScrollFactor(0).setDepth(200);
    
    // ---- 7. КНОПКА "СДАТЬСЯ" (выход из боя) ----
    battleUI.surrenderButton = scene.add.text(w - 130, h - 40, '🏳️ Сдаться', {
        fontSize: '16px',
        fill: '#ff6666',
        fontFamily: 'Arial',
        backgroundColor: '#440000',
        padding: { x: 12, y: 6 }
    }).setScrollFactor(0).setDepth(200)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
          endBattle(scene);
      });
}

// ----- ОБНОВИТЬ ИНТЕРФЕЙС БОЯ -----
function updateBattleUI(scene) {
    if (!battleState.active) return;
    
    const monster = battleState.monster;
    
    // HP игрока
    battleUI.playerHP.setText('❤️ Ты: ' + Math.floor(player.stats.hp) + '/' + player.stats.maxHp);
    
    // HP монстра
    battleUI.monsterHP.setText('💀 Монстр: ' + Math.floor(monster.stats.hp) + '/' + monster.stats.maxHp);
    
    // Подсветка выбранных зон
    for (const zone in battleUI.attackButtons) {
        const btn = battleUI.attackButtons[zone];
        if (battleState.playerZone === zone) {
            btn.setBackgroundColor('#ffdd44');
            btn.setColor('#000000');
        } else {
            btn.setBackgroundColor('#333366');
            btn.setColor('#ffffff');
        }
    }
    
    for (const zone in battleUI.blockButtons) {
        const btn = battleUI.blockButtons[zone];
        if (battleState.blockZone === zone) {
            btn.setBackgroundColor('#44ddff');
            btn.setColor('#000000');
        } else {
            btn.setBackgroundColor('#336633');
            btn.setColor('#ffffff');
        }
    }
    
    // Кнопка ХОД
    if (battleState.turn === 'player') {
        battleUI.goButton.setText('▶ ХОД');
        battleUI.goButton.setBackgroundColor('#e94560');
    } else {
        battleUI.goButton.setText('⏳ Ход монстра...');
        battleUI.goButton.setBackgroundColor('#666666');
    }
}

// ----- ДОБАВИТЬ СООБЩЕНИЕ В ЛОГ -----
function addBattleLog(message) {
    battleState.log.push(message);
    if (battleState.log.length > 20) {
        battleState.log.shift();
    }
    updateLogUI();
}

function updateLogUI() {
    if (!battleUI.logText) return;
    let text = battleState.log.join('\n');
    battleUI.logText.setText(text);
}

// ----- ХОД ИГРОКА -----
function executePlayerTurn(scene) {
    if (battleState.turn !== 'player') return;
    if (!battleState.playerZone) {
        addBattleLog('⚠️ Выбери зону для удара!');
        return;
    }
    if (!battleState.blockZone) {
        addBattleLog('⚠️ Выбери зону для блока!');
        return;
    }
    
    // Передаём ход монстру
    battleState.turn = 'monster';
    updateBattleUI(scene);
    
    const monster = battleState.monster;
    
    // Монстр выбирает зоны случайно
    const zones = ['Голова', 'Руки', 'Корпус', 'Ноги'];
    battleState.monsterZone = zones[Math.floor(Math.random() * zones.length)];
    battleState.monsterBlock = zones[Math.floor(Math.random() * zones.length)];
    
    // ---- РАСЧЁТ УРОНА ИГРОКА ----
    const playerAttack = battleState.playerZone;
    const monsterBlock = battleState.monsterBlock;
    let damage = 0;
    let hitMessage = '';
    
    if (playerAttack === monsterBlock) {
        hitMessage = '🛡️ Монстр заблокировал удар в ' + playerAttack + '! Урон 0!';
    } else {
        const baseDamage = calculatePlayerDamage();
        const monsterDefense = monster.stats.defense;
        let finalDamage = Math.max(1, baseDamage - monsterDefense);
        const modifier = BATTLE.damageModifiers[playerAttack] || 1.0;
        finalDamage = Math.floor(finalDamage * modifier);
        monster.stats.hp -= finalDamage;
        damage = finalDamage;
        hitMessage = '💥 Ты ударил в ' + playerAttack + '! Урон ' + damage + '!';
    }
    addBattleLog(hitMessage);
    
    // Проверяем, умер ли монстр
    if (monster.stats.hp <= 0) {
        monster.stats.hp = 0;
        addBattleLog('💀 Монстр убит! +' + monster.expReward + ' опыта!');
        player.stats.exp += monster.expReward;
        checkLevelUp(scene);
        endBattle(scene);
        return;
    }
    
    // Ход монстра
    executeMonsterTurn(scene);
}

// ----- ХОД МОНСТРА -----
function executeMonsterTurn(scene) {
    const monster = battleState.monster;
    const monsterAttack = battleState.monsterZone;
    const playerBlock = battleState.blockZone;
    
    let damage = 0;
    let hitMessage = '';
    
    if (monsterAttack === playerBlock) {
        hitMessage = '🛡️ Ты заблокировал удар монстра в ' + monsterAttack + '! Урон 0!';
    } else {
        const baseDamage = monster.stats.strength * 2;
        const playerDefense = calculatePlayerDefense();
        let finalDamage = Math.max(1, baseDamage - playerDefense);
        const modifier = BATTLE.damageModifiers[monsterAttack] || 1.0;
        finalDamage = Math.floor(finalDamage * modifier);
        player.stats.hp -= finalDamage;
        damage = finalDamage;
        hitMessage = '💢 Монстр ударил в ' + monsterAttack + '! Ты получил ' + damage + ' урона!';
    }
    addBattleLog(hitMessage);
    
    // Проверяем, умер ли игрок
    if (player.stats.hp <= 0) {
        player.stats.hp = 0;
        addBattleLog('💀 Ты погиб!');
        endBattle(scene);
        return;
    }
    
    // Ход переходит к игроку
    battleState.turn = 'player';
    updateBattleUI(scene);
    updateMonsterHP(monster);
}

// ----- ПРОВЕРКА ПОВЫШЕНИЯ УРОВНЯ -----
function checkLevelUp(scene) {
    const needed = player.stats.expToNext;
    while (player.stats.exp >= needed) {
        player.stats.exp -= needed;
        player.stats.level++;
        player.stats.expToNext = Math.floor(needed * 1.5);
        player.stats.maxHp += 10;
        player.stats.hp = player.stats.maxHp;
        player.stats.strength += 2;
        player.stats.agility += 1;
        player.stats.defense += 1;
        addBattleLog('🎉 УРОВЕНЬ ' + player.stats.level + '!');
    }
}

// ----- ЗАВЕРШИТЬ БОЙ -----
function endBattle(scene) {
    battleState.active = false;
    const monster = battleState.monster;
    
    if (monster) {
        monster.isInBattle = false;
        if (monster.stats.hp <= 0) {
            removeDeadMonster(monster);
            scene.time.delayedCall(WORLD_CONFIG.respawnDelay, () => {
                respawnMonster(monster);
            });
        }
    }
    
    player.isInBattle = false;
    battleState.monster = null;
    
    // Удаляем UI боя
    for (const key in battleUI) {
        if (battleUI[key]) {
            battleUI[key].destroy();
        }
    }
    battleUI = {};
    
    // Восстанавливаем обычный UI
    updateUI(scene);
}