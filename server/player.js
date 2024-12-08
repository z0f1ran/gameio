const items = require('./items/ItemList');

// Define the players object at the top level of the module
const players = {};

const obstacles = [
    { x: 100, y: 100, width: 100, height: 100 },
    { x: 400, y: 300, width: 150, height: 150 }
];

class Player {
    constructor(props) {
        this._name = props.name;
        this._id = props.id;
        this._playerRadius = 30;
        this.positionX = 300;
        this.positionY = 300;
        this.hp = 100;
        this.maxHp = 100;
        this.is_alive = true;
        this.is_top = false;
        this.kills = 0;
        this.cursor = { x: 300, y: 300 };

        this.attacking = false;
        this.lastAttackTime = 0;
        this.attackAnimationDuration = 200;
        this.attackStartTime = 0;

        this.inventory = Array(5).fill(null); // Inventory with 5 slots
        this.selectedSlot = 0; // Index of the currently selected inventory slot

        // Выдаём два случайных, но разных оружия в первые два слота
        const [weapon1, weapon2] = this.getTwoRandomWeapons();
        this.inventory[0] = weapon1;
        this.inventory[1] = weapon2;

        // // Fill initial inventory slots with some default items
        // this.inventory[0] = items.dragonslayer;
        // this.inventory[1] = items.spear;
        // this.inventory[2] = items.axe;
        // this.inventory[3] = items.healingPotion;
    }

    getTwoRandomWeapons() {
        const weapons = [items.sword, items.spear, items.axe, items.dragonslayer];
        const shuffledWeapons = weapons.sort(() => 0.5 - Math.random()); // Перемешиваем список оружия
        return [shuffledWeapons[0], shuffledWeapons[1]]; // Возвращаем первые два уникальных оружия
    }

    isPlayerInAttackCone(otherPlayer) {
        const dx = otherPlayer.positionX - this.positionX;
        const dy = otherPlayer.positionY - this.positionY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.inventory[this.selectedSlot]?.range || this.inventory[this.selectedSlot]?.type !== 'weapon') {
            return false;
        }

        const angleToPlayer = Math.atan2(dy, dx);
        const angleToCursor = Math.atan2(this.cursor.y - this.positionY, this.cursor.x - this.positionX);

        let angleDiff = Math.abs(angleToCursor - angleToPlayer);
        if (angleDiff > Math.PI) {
            angleDiff = 2 * Math.PI - angleDiff; // Handle the angle wrap-around
        }

        return angleDiff < Math.PI / 6; // 30 degrees cone
    }

    canAttack() {
        const currentTime = Date.now();
        return currentTime - this.lastAttackTime >= (this.inventory[this.selectedSlot]?.attackInterval || 1000);
    }

    attack(weapon) {
        this.lastAttackTime = Date.now();
        this.attacking = true;
        this.attackStartTime = Date.now();

        // Perform attack logic
        for (const id in players) {
            if (id !== this._id) {
                const otherPlayer = players[id];
                if (this.isPlayerInAttackCone(otherPlayer)) {
                    otherPlayer.hp -= weapon.damage;
                    if (otherPlayer.hp <= 0) {
                        otherPlayer.is_alive = false;
                        this.kills++;
                        this.addHealingPotionToInventory();
                    }
                }
            }
        }
    }

    addHealingPotionToInventory() {
        const freeSlot = this.inventory.indexOf(null); // Найти первый свободный слот
        if (freeSlot !== -1) {
            this.inventory[freeSlot] = items.healingPotion; // Добавить зелье лечения
        }
    }

    update() {
        if (this.attacking) {
            const currentTime = Date.now();
            if (currentTime - this.attackStartTime > this.attackAnimationDuration) {
                this.attacking = false;
            }
        }
    }

    useItem() {
        const item = this.inventory[this.selectedSlot];
        if (item) {
            item.useItem(this);
        }
    }

    isCollidingWithObstacles(newX, newY) {
        for (const obstacle of obstacles) {
            if (newX < obstacle.x + obstacle.width &&
                newX + this._playerRadius > obstacle.x &&
                newY < obstacle.y + obstacle.height &&
                newY + this._playerRadius > obstacle.y) {
                return true; // Столкновение найдено
            }
        }
        return false;
    }
}

const adjectives = [
    'Brave', 'Mighty', 'Swift', 'Cunning', 'Fierce', 'Bold', 'Silent', 
    'Wise', 'Fearless', 'Loyal', 'Noble', 'Vengeful', 'Radiant', 
    'Shadowy', 'Gallant', 'Wily', 'Valiant', 'Stealthy', 'Tenacious', 
    'Indomitable', 'Courageous', 'Daring', 'Eternal', 'Furious', 
    'Invincible', 'Mystic', 'Sly', 'Reckless', 'Strategic', 'Zany'
];

const nouns = [
    'Dragon', 'Warrior', 'Knight', 'Assassin', 'Wizard', 'Beast', 
    'Phoenix', 'Titan', 'Rogue', 'Sentinel', 'Guardian', 'Vampire', 
    'Wraith', 'Hunter', 'Demon', 'Mage', 'Paladin', 'Barbarian', 
    'Sorcerer', 'Champion', 'Bard', 'Alchemist', 'Cleric', 
    'Trickster', 'Shaman', 'Brawler', 'Enchanter', 'Spellbinder', 
    'Berserker', 'Ninja', 'Monk'
];

// Функция для генерации случайного имени
function generateRandomName() {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdjective} ${randomNoun}`;
}

module.exports.getPlayers = (socket, io) => {
    socket.on("new player", () => {
        // Генерируем случайное составное имя для игрока
        const randomName = generateRandomName();

        // Создаём нового игрока с этим именем
        players[socket.id] = new Player({
            id: socket.id,
            name: randomName // Используем случайное имя
        });
    });

    socket.on("movement", (data) => {
        const player = players[socket.id] || {};
        if (player.is_alive) {
            player.cursor = data.cursor || player.cursor;

            // Use the weapon's moveSpeed to adjust player movement
            const moveSpeed = player.inventory[player.selectedSlot]?.moveSpeed || 5;

            // if (data.left) {
            //     player.positionX -= moveSpeed;
            // }
            // if (data.up) {
            //     player.positionY -= moveSpeed;
            // }
            // if (data.right) {
            //     player.positionX += moveSpeed;
            // }
            // if (data.down) {
            //     player.positionY += moveSpeed;
            // }

            let newX = player.positionX;
            let newY = player.positionY;

            if (data.left) newX -= moveSpeed;
            if (data.up) newY -= moveSpeed;
            if (data.right) newX += moveSpeed;
            if (data.down) newY += moveSpeed;

            // Проверяем столкновение, если нет — обновляем позицию
            if (!player.isCollidingWithObstacles(newX, newY)) {
                player.positionX = newX;
                player.positionY = newY;
            }

            // Handle item use
            if (data.useItem) {
                player.useItem(); // Use the item in the selected slot
            }

            // Handle inventory slot switching
            if (data.switchSlot !== undefined) {
                player.selectedSlot = data.switchSlot;
            }

            // If the player is attacking, check for collisions
            if (data.attack && player.inventory[player.selectedSlot]?.type === 'weapon') {
                player.inventory[player.selectedSlot].useItem(player); // Attack with the weapon
            }

            // Update the player's animation state
            player.update();
        }
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
    });

    return players;
};