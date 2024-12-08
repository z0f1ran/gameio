const Item = require('./Item');

class Weapon extends Item {
    constructor(props) {
        super({ ...props, type: 'weapon' }); // Set type to weapon
        this.damage = props.damage || 10; // Default damage
        this.range = props.range || 100; // Default range
        this.attackInterval = props.attackInterval || 1000; // Cooldown time between attacks
        this.is_two_handed = props.is_two_handed || false;
        this.moveSpeed = props.moveSpeed || 5; // Default movement speed
    }

    // Override useItem to perform an attack
    useItem(player) {
        if (player.canAttack()) {
            player.attack(this);
        }
    }
}

module.exports = Weapon;
