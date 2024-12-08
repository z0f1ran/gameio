const drawItem = (context, weapon, attackProgress) => {
    context.save();
    context.beginPath();
    context.strokeStyle = "black"; // Outline for weapons
    context.lineWidth = 1; // Half of the original line width

    // Easing function for smooth transition
    const easeOut = (t) => t * (2 - t);

    // Adjust attackProgress with easing for smooth animation return
    const easedProgress = easeOut(attackProgress);

    switch (weapon.name) {
        case "Sword":
            context.save();
            const swordSwingAngle = easedProgress * Math.PI / 3; // Enhanced swing angle
            
            // Rotate sword by 45 degrees clockwise
            context.rotate(Math.PI / 4 + swordSwingAngle);

            // Handle
            context.fillStyle = "saddlebrown";
            context.fillRect(-2.5, -10, 5, 20); // Half the size of the original

            // Guard
            context.fillStyle = "gold";
            context.beginPath();
            context.moveTo(-7.5, -5);
            context.lineTo(7.5, -5);
            context.lineTo(6, -2.5);
            context.lineTo(-6, -2.5);
            context.closePath();
            context.fill();

            // Blade
            context.fillStyle = "silver";
            context.beginPath();
            context.moveTo(-1.5, -35);
            context.lineTo(1.5, -35);
            context.lineTo(10, 0);
            context.lineTo(-10, 0);
            context.closePath();
            context.fill();

            // Draw hand on top of the sword handle
            drawHand(context, 0, 10);

            context.restore();
            break;

        case "Gun":
            context.save();
            const gunRecoil = Math.min(easedProgress * 7.5, 15); // Half the recoil distance
            context.translate(0, -gunRecoil);

            // Handle
            context.fillStyle = "black";
            context.fillRect(-2.5, -10, 5, 15); // Half the size of the original

            // Trigger guard with gradient
            const guardGradient = context.createLinearGradient(-4, 2.5, 4, 4.5);
            guardGradient.addColorStop(0, "darkgray");
            guardGradient.addColorStop(1, "dimgray");
            context.fillStyle = guardGradient;
            context.fillRect(-4, 2.5, 8, 2.5);

            // Body with texture
            context.fillStyle = "darkgray";
            context.fillRect(-6, -7.5, 12, 10);

            // Barrel with shine
            const barrelGradient = context.createLinearGradient(-1, -10, -1, -17.5);
            barrelGradient.addColorStop(0, "darkgray");
            barrelGradient.addColorStop(1, "lightgray");
            context.fillStyle = barrelGradient;
            context.fillRect(-1, -10, 2, -7.5);

            // Muzzle flash effect
            if (attackProgress > 0.5) {
                context.beginPath();
                context.fillStyle = "orange";
                context.arc(0, -10, 2.5, 0, Math.PI * 2);
                context.fill();
            }

            // Draw hand on the gun handle
            drawHand(context, 0, 7.5);

            context.restore();
            break;

        case "Axe":
            context.save();
            const axeSwingAngle = easedProgress; // Swing forward
            
            // Move axe down to align with hand position
            context.rotate(Math.PI / 10);
            context.translate(-15, 10);
            context.translate(35 * axeSwingAngle, -35 * axeSwingAngle);
            context.rotate(-axeSwingAngle * 4);
            

            // Handle with texture
            const handleTexture = context.createLinearGradient(-1.5, -20, 1.5, 20);
            handleTexture.addColorStop(0, "saddlebrown");
            handleTexture.addColorStop(1, "peru");
            context.fillStyle = handleTexture;
            context.fillRect(-1.5, 0, 3, 40);

            // Blade shifted downward
            context.fillStyle = "silver";
            context.beginPath();
            context.moveTo(0, 20); // Blade start point (shifted up)
            context.lineTo(15, 10); // Top right corner (shifted up)
            context.lineTo(15, 40); // Bottom right corner
            context.lineTo(0, 30); // Bottom left corner
            context.closePath();
            context.fill();

            // Draw hand on the axe handle (higher position)
            drawHand(context, 0, 0);

            context.restore();
            break;
        
        case "Spear":
            context.save();
            const spearSwingAngle = easedProgress * Math.PI / 4; // Adjust swing angle

            // Move spear down to align with hand position
            context.translate(10, -20);
            context.translate(spearSwingAngle * 25, 0);
            context.rotate(Math.PI / 2);

            // Draw spear shaft
            context.fillStyle = "silver";
            context.fillRect(-2.5, -50, 5, 50);

            // Draw spear head
            context.beginPath();
            context.moveTo(-5, -50);
            context.lineTo(0, -60);
            context.lineTo(5, -50);
            context.lineTo(-5, -50);
            context.closePath();
            context.fillStyle = "gray";
            context.fill();

            // Draw hand on the spear handle
            drawHand(context, 0, 5);
            drawHand(context, 0, -10);

            context.restore();
            break;

        case "Dragonslayer":
            context.save();
            const dragonslayerSwingAngle = easedProgress * Math.PI / 4; // Adjust swing angle
        
            // Move Dragonslayer down and to the side for swing effect
            context.translate(-25, -10);
            context.rotate(-dragonslayerSwingAngle * 9);
            context.translate(-75 * dragonslayerSwingAngle, -10);
        
            // Handle
            context.fillStyle = "darkgray";
            context.fillRect(-5, -15, 10, 30);
        
            // Guard
            context.fillStyle = "black";
            context.fillRect(-10, -10, 20, 7.5);
        
            // Blade (twice as long) with sharp edge
            context.fillStyle = "darkgray";
            context.beginPath();
            context.moveTo(-5, -70); // Start of blade
            context.lineTo(0, -75);
            context.lineTo(5, -70);  // End of blade
            context.lineTo(15, 0);    // Bottom right corner
            context.lineTo(-15, 0);   // Bottom left corner
            context.lineTo(-5, -70); // Closing the sharp edge
            context.closePath();
            context.fill();

            // Blade (twice as long) with sharp edge
            context.fillStyle = "gray";
            context.beginPath();
            context.moveTo(-2.5, -60); // Start of blade
            context.lineTo(0, -65);
            context.lineTo(2.5, -60);  // End of blade
            context.lineTo(7.5, 0);    // Bottom right corner
            context.lineTo(-7.5, 0);   // Bottom left corner
            context.lineTo(-2.5, -60); // Closing the sharp edge
            context.closePath();
            context.fill();
        
            // Draw hand on top of the handle
            drawHand(context, 0, 17.5);
            drawHand(context, 0, 7.5);
        
            context.restore();
            break;   

        case "Warhammer":
            context.save();
            // Угол замаха с вращением против часовой стрелки
            const hammerSwingAngle = easedProgress * Math.PI * 1.25; // Угол размаха

            // Перемещение молота ближе к телу для большего контроля
            context.translate(-15, -40); // Смещаем ближе к телу, регулируем X и Y

            // Поворот против часовой стрелки
            context.rotate(Math.PI / 4 - hammerSwingAngle); // Начинаем с угла 45 градусов

            // Рукоять молота
            const handleGradient = context.createLinearGradient(-2, 0, 2, 70);
            handleGradient.addColorStop(0, "saddlebrown");
            handleGradient.addColorStop(1, "darkgoldenrod");
            context.fillStyle = handleGradient;
            context.fillRect(-2, 0, 4, 70); // Уменьшаем длину рукояти, чтобы молот был ближе к телу

            // Голова молота
            context.fillStyle = "gray";
            context.beginPath();
            context.moveTo(-12, -22); // Левый верхний угол (меньшая голова)
            context.lineTo(12, -22);  // Правый верхний угол
            context.lineTo(18, 0);    // Правый нижний угол
            context.lineTo(-18, 0);   // Левый нижний угол
            context.closePath();
            context.fill();

            // Анимация удара молота
            if (attackProgress > 0.75) {
                context.fillStyle = "red";
                context.arc(0, 0, 12, 0, Math.PI * 2); // Эффект удара по земле
                context.fill();
            }

            // Рисуем руку на рукояти молота, ближе к телу
            drawHand(context, 0, 65);  // Нижняя рука
            drawHand(context, 0, 55);  // Верхняя рука

            context.restore();
            break;

        case "Healing Potion":
            context.save();
            
            // Draw potion bottle
            context.fillStyle = "green";
            context.beginPath();
            context.moveTo(-10, -15);
            context.lineTo(10, -15);
            context.lineTo(5, 15);
            context.lineTo(-5, 15);
            context.closePath();
            context.fill();

            // Draw potion cap
            context.fillStyle = "silver";
            context.beginPath();
            context.moveTo(-8, -15);
            context.lineTo(8, -15);
            context.lineTo(5, -25);
            context.lineTo(-5, -25);
            context.closePath();
            context.fill();

            // Draw potion label
            context.fillStyle = "white";
            context.beginPath();
            context.moveTo(-3, -10);
            context.lineTo(3, -10);
            context.lineTo(3, -5);
            context.lineTo(-3, -5);
            context.closePath();
            context.fill();

            // Draw hand on the potion handle
            drawHand(context, 0, 5);

            context.restore();
            break;
            
        case "Damaging Potion":
            context.save();
            
            // Draw potion bottle
            context.fillStyle = "red";
            context.beginPath();
            context.moveTo(-10, -15);
            context.lineTo(10, -15);
            context.lineTo(5, 15);
            context.lineTo(-5, 15);
            context.closePath();
            context.fill();

            // Draw potion cap
            context.fillStyle = "silver";
            context.beginPath();
            context.moveTo(-8, -15);
            context.lineTo(8, -15);
            context.lineTo(5, -25);
            context.lineTo(-5, -25);
            context.closePath();
            context.fill();

            // Draw potion label
            context.fillStyle = "white";
            context.beginPath();
            context.moveTo(-3, -10);
            context.lineTo(3, -10);
            context.lineTo(3, -5);
            context.lineTo(-3, -5);
            context.closePath();
            context.fill();

            // Draw hand on the potion handle
            drawHand(context, 0, 5);

            context.restore();
            break;
        default:
            context.fillStyle = "gray";
            context.fillRect(-1.5, -7.5, 3, 15); // Half the size of the default weapon

            // Draw default hand position
            drawHand(context, 0, 7.5);
            break;
    }

    context.stroke();
    context.restore();
};

// New function to draw hand on weapon
const drawHand = (context, offsetX, offsetY) => {
    const handRadius = 5; // Half the size of the original hand
    context.beginPath();
    context.arc(offsetX, offsetY, handRadius, 0, Math.PI * 2);
    context.fillStyle = "white";
    context.fill();
    context.closePath();
};

const drawPlayer = (context, player) => {
    const playerX = player.positionX;
    const playerY = player.positionY;
    const hpBarWidth = 30; // Half the original width
    const hpBarHeight = 5; // Half the original height
    const hpBarOffset = 25; // Half the original offset
    const nameOffset = 35; // Half the original name offset
    const weaponOffset = 60; // Half the original weapon offset

    // Ensure weapon is defined and valid
    const weapon = player.inventory[player.selectedSlot] || { name: 'Hand', is_two_handed: false };
    const angle = Math.atan2(player.cursor.y - playerY, player.cursor.x - playerX);

    // Draw the player
    context.save();
    context.translate(playerX, playerY);
    context.rotate(angle);

    // Draw the player's body
    context.beginPath();
    context.strokeStyle = "white"; // Change color when attacking
    context.lineWidth = 5; // Half the original line width
    context.arc(0, 0, player._playerRadius / 2, 0, Math.PI * 2); // Half the radius
    context.stroke();
    context.closePath();

    // Draw the hands with animation effect
    const handRadius = 5; // Half the size of the original hand
    const handOffset = (player._playerRadius + handRadius) / 2; // Half the hand offset

    // Calculate attack progress for animation
    let attackProgress = 0;
    if (player.attacking) {
        const attackDuration = 500; // Attack duration in milliseconds
        const elapsed = Date.now() - player.attackStartTime;
        attackProgress = Math.min(elapsed / attackDuration, 1); // Normalize to [0, 1]
    }

    // Draw left hand (static) if not two-handed
    if (!weapon.is_two_handed) {
        context.beginPath();
        context.arc(10, -handOffset + 2.5, handRadius, 0, Math.PI * 2); // Half the positions and radius
        context.fillStyle = "white";
        context.fill();
        context.closePath();
    }

    // Draw weapon in right hand with specific animation
    context.save();
    context.translate(10, handOffset - 2.5); // Half the translation
    drawItem(context, weapon, attackProgress);
    context.restore();

    context.restore();

    // Draw player's name
    context.beginPath();
    context.fillStyle = "red";
    context.font = "16px sans-serif";
    context.textAlign = "center";
    if(player.is_top){
        context.fillText(`👑${player._name}`, playerX, playerY - nameOffset);
    }
    else{
        context.fillText(`${player._name}`, playerX, playerY - nameOffset);
    }
    
    context.closePath();

    // Draw health bar
    context.beginPath();
    context.fillStyle = "black";
    context.fillRect(playerX - hpBarWidth / 2, playerY - hpBarOffset - hpBarHeight, hpBarWidth, hpBarHeight);
    context.fillStyle = "green";
    const hpWidth = (player.hp / player.maxHp) * hpBarWidth;
    context.fillRect(playerX - hpBarWidth / 2, playerY - hpBarOffset - hpBarHeight, hpWidth, hpBarHeight);
    context.closePath();

    // Draw weapon name
    context.beginPath();
    context.fillStyle = "blue";
    context.font = "14px sans-serif";
    context.textAlign = "center";
    context.fillText(weapon.name, playerX, playerY - weaponOffset);
    context.closePath();
};
