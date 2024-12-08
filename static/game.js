    const socket = io();

    const WINDOW_WIDTH = 1520;
    const WINDOW_HEIGHT = 800; 

    const canvas = document.getElementById("canvas");
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
    const context = canvas.getContext("2d");

    socket.emit("new player");

    // это фиксануть нада
    const obstacles = [
        { x: 100, y: 100, width: 100, height: 100 },
        { x: 400, y: 300, width: 150, height: 150 }
    ];

    function drawLeaderboard(ctx, players) {
        let playerList = Object.values(players);
        playerList = playerList.filter(player => player.is_alive);
        const sortedPlayers = playerList.sort((a, b) => b.kills - a.kills);
    
        const maxToShow = 5;
        const startX = WINDOW_WIDTH - 200; // Положение списка по X
        const startY = 50; // Положение списка по Y
    
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.fillText("Top Players (Kills):", startX, startY - 20);
    
        for (let i = 0; i < Math.min(maxToShow, sortedPlayers.length); i++) {
            const player = sortedPlayers[i];
            let playerText = `${i + 1}. ${player._name}: ${player.kills} kills`;
    
            // Проверяем, является ли игрок топ-1 по количеству убийств
            if (i === 0) {
                player.is_top = true;
                playerText = `👑 ${playerText}`; // Добавляем смайлик короны
            }
            else{
                player.is_top = false;
            }
    
            ctx.fillText(playerText, startX, startY + i * 30);
        }
    }
    

    function drawHpBar(ctx, player) {
        const barWidth = 640; // Ширина полоски здоровья
        const barHeight = 20; // Высота полоски здоровья
        const barX = 50; // Позиция по X (над инвентарём)
        const barY = WINDOW_HEIGHT - 80; // Позиция по Y (чуть выше инвентаря)
        
        // Рассчитываем процент здоровья
        const healthPercent = player.hp / player.maxHp;

        // Рамка полоски здоровья
        ctx.strokeStyle = 'white';
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Внутренняя часть (текущее здоровье)
        ctx.fillStyle = 'red';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        // Отображаем текст с текущим и максимальным здоровьем
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(`${player.hp} / ${player.maxHp}`, barX + barWidth / 2 - 30, barY + barHeight / 2 + 5);
    }

    function drawObstacles(ctx, obstacles) {
        ctx.fillStyle = 'gray';
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    // Функция для отрисовки инвентаря текущего игрока
    const drawInventory = (context, player) => {
        const inventoryX = 50; // Позиция инвентаря оставляем как есть
        const inventoryY = WINDOW_HEIGHT - 50; // Позиция внизу canvas
        const slotWidth = 120; // Ширина слота
        const slotHeight = 30; // Высота слота
        const slotPadding = 10; // Отступ между слотами

        // Отрисовка каждого слота инвентаря
        player.inventory.forEach((item, index) => {
            const slotX = inventoryX + (slotWidth + slotPadding) * index;

            // Отрисовка пустого слота
            context.fillStyle = "gray";
            context.fillRect(slotX, inventoryY, slotWidth, slotHeight);

            // Если в слоте есть предмет, отрисовать его название
            if (item) {
                context.fillStyle = "white";
                context.font = "16px sans-serif";
                context.textAlign = "center";
                context.fillText(item.name, slotX + slotWidth / 2, inventoryY + slotHeight / 2 + 5);
            }
        });
    };

    // Основная логика отрисовки игроков
    socket.on("state", (players) => {
        context.beginPath();
        context.fillStyle = "black";
        context.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
        context.closePath();


        drawObstacles(context, obstacles);
        drawLeaderboard(context, players);
        for (const id in players) {
            const player = players[id];
            if (player.is_alive) {
                drawPlayer(context, player);

                // Проверяем, является ли текущий игрок клиентом
                if (id === socket.id) {
                    // Отрисовываем инвентарь только для текущего игрока
                    drawInventory(context, player);

                    // Отрисовываем полоску здоровья для текущего игрока
                    drawHpBar(context, player);

                }
            }
        }
    });