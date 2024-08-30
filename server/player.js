// Define the players object at the top level of the module
const players = {};

const ATTACK_INTERVAL = 1000; // Attack interval in milliseconds (e.g., 1000 ms = 1 second)

class Weapon {
    constructor(props) {
        this.name = props.name || "Sword";
        this.damage = props.damage || 10; // Default damage
        this.range = props.range || 100; // Default range
        this.attackInterval = props.attackInterval || ATTACK_INTERVAL; // Cooldown time between attacks
        this.is_two_handed = props.is_two_handed || false;
        this.moveSpeed = props.moveSpeed || 5; // Default movement speed (new attribute)
    }
}

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

        this.cursor = { x: 300, y: 300 }; // Default cursor position

        this.attacking = false; // Track if player is attacking
        this.weapon = props.weapon || new Weapon({}); // Assign a weapon, default to a basic weapon
        this.attackRange = this.weapon.range; // Use weapon's range
        this.attackInterval = this.weapon.attackInterval; // Use weapon's attack interval
        this.moveSpeed = this.weapon.moveSpeed; // Set initial move speed based on weapon (new)
        this.lastAttackTime = 0; // Timestamp of the last attack
        this.attackAnimationDuration = 200; // Duration of the attack animation in milliseconds
        this.attackStartTime = 0; // Timestamp when the attack animation started
    }

    // Check if another player is within the attack cone
    isPlayerInAttackCone(otherPlayer) {
        const dx = otherPlayer.positionX - this.positionX;
        const dy = otherPlayer.positionY - this.positionY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.attackRange) {
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
        return currentTime - this.lastAttackTime >= this.attackInterval;
    }

    attack() {
        this.lastAttackTime = Date.now();
        this.attacking = true;
        this.attackStartTime = Date.now();
    }

    // Update the attack animation state
    update() {
        if (this.attacking) {
            const currentTime = Date.now();
            if (currentTime - this.attackStartTime > this.attackAnimationDuration) {
                this.attacking = false;
            }
        }
    }
}

module.exports.getPlayers = (socket, io) => {
    socket.on("new player", () => {
        players[socket.id] = new Player({
            id: socket.id,
            name: Object.keys(players).length,
            weapon: new Weapon({
                name: "Sword",
                damage: 15,
                range: 100,
                attackInterval: 1000,
                moveSpeed: 5 // Default movement speed for Sword
            })
        });
    });

    socket.on("movement", (data) => {
        const player = players[socket.id] || {};
        if (player.is_alive) {
            player.cursor = data.cursor || player.cursor;

            // Use the weapon's moveSpeed to adjust player movement
            const moveSpeed = player.weapon.moveSpeed;

            if (data.left) {
                player.positionX -= moveSpeed;
            }
            if (data.up) {
                player.positionY -= moveSpeed;
            }
            if (data.right) {
                player.positionX += moveSpeed;
            }
            if (data.down) {
                player.positionY += moveSpeed;
            }

            // Handle weapon switching
            if (data.switchWeapon !== null) {
                switch (data.switchWeapon) {
                    case 1:
                        player.weapon = new Weapon({ name: "Sword", damage: 10, range: 50, attackInterval: 1000, is_two_handed: false, moveSpeed: 3 });
                        break;
                    case 2:
                        player.weapon = new Weapon({ name: "Spear", damage: 12, range: 100, attackInterval: 1500, is_two_handed: true, moveSpeed: 2 });
                        break;
                    case 3:
                        player.weapon = new Weapon({ name: "Axe", damage: 15, range: 75, attackInterval: 2000, is_two_handed: false, moveSpeed: 2.5 });
                        break;
                    case 4:
                        player.weapon = new Weapon({ name: "Dragonslayer", damage: 100, range: 75, attackInterval: 2000, is_two_handed: true, moveSpeed: 1 });
                        break;
                    // Add more cases for additional weapons
                }
                player.attackRange = player.weapon.range; // Update player attack range
                player.attackInterval = player.weapon.attackInterval; // Update player attack interval
                player.moveSpeed = player.weapon.moveSpeed; // Update player movement speed (new)
            }

            // If the player is attacking, check for collisions
            if (data.attack && player.canAttack()) {
                player.attack(); // Update last attack time
                for (const id in players) {
                    if (id !== socket.id) {
                        const otherPlayer = players[id];
                        if (player.isPlayerInAttackCone(otherPlayer)) {
                            otherPlayer.hp -= player.weapon.damage; // Use weapon's damage
                            if (otherPlayer.hp <= 0) {
                                otherPlayer.is_alive = false;
                            }
                        }
                    }
                }
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
