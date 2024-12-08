const movement = {
    up: false,
    down: false,
    left: false, 
    right: false,
    attack: false,
    switchSlot: null // Initialize switchSlot with null
};

const cursorPosition = { x: 0, y: 0 };

document.addEventListener("keydown", (event) => {
    switch(event.keyCode){
        case 65: // 'A'
            movement.left = true;
            break;
        case 87: // 'W'
            movement.up = true;
            break;
        case 68: // 'D'
            movement.right = true;
            break;
        case 83: // 'S'
            movement.down = true;
            break;
        case 32: // Spacebar for attack
            movement.attack = true;
            break;
        case 49: // '1' key to switch to weapon 1
            movement.switchSlot = 0;
            break;
        case 50: // '2' key to switch to weapon 2
            movement.switchSlot = 1;
            break;
        case 51: // '3' key to switch to weapon 3
            movement.switchSlot = 2;
            break;
        case 52: // '4' key to switch to weapon 4
            movement.switchSlot = 3;
            break;
        case 53: // '5' key to switch to weapon 5
            movement.switchSlot = 4; // Устанавливаем индекс 4 для пятого слота
            break;
    }
});

document.addEventListener("keyup", (event) => {
    switch(event.keyCode){
        case 65: // 'A'
            movement.left = false;
            break;
        case 87: // 'W'
            movement.up = false;
            break;
        case 68: // 'D'
            movement.right = false;
            break;
        case 83: // 'S'
            movement.down = false;
            break;
        case 32: // Spacebar for attack
            movement.attack = false;
            break;
        case 49: // '1' key
        case 50: // '2' key
        case 51: // '3' key
        case 52: // '4' key
        case 53: // '5' key
            movement.switchSlot = undefined; // Reset switchSlot after key release
            break;
    }
});

// Handle mouse movement
document.addEventListener("mousemove", (event) => {
    cursorPosition.x = event.clientX;
    cursorPosition.y = event.clientY;
});

// Handle mouse click for attacking and using item
document.addEventListener("mousedown", (event) => {
    if (event.button === 0) { // Left mouse button
        movement.attack = true;
    }
    if (event.button === 2) { // Right mouse button
        movement.useItem = true;
    }
});

document.addEventListener("mouseup", (event) => {
    if (event.button === 0) { // Left mouse button
        movement.attack = false;
    }
    if (event.button === 2) { // Right mouse button
        movement.useItem = false;
    }
});

setInterval(() => {
    socket.emit("movement", { ...movement, cursor: cursorPosition });
    movement.switchSlot = undefined; // Reset after sending to prevent repeated switch commands
}, 1000/60);
