const Weapon = require('./Weapon');
const Item = require('./Item');

const items = {
    sword: new Weapon({
        name: "Sword",
        damage: 10,
        range: 50,
        attackInterval: 1000,
        is_two_handed: false,
        moveSpeed: 3
    }),
    spear: new Weapon({
        name: "Spear",
        damage: 12,
        range: 100,
        attackInterval: 1500,
        is_two_handed: true,
        moveSpeed: 2
    }),
    axe: new Weapon({
        name: "Axe",
        damage: 15,
        range: 75,
        attackInterval: 2000,
        is_two_handed: false,
        moveSpeed: 2.5
    }),
    dragonslayer: new Weapon({
        name: "Dragonslayer",
        damage: 100,
        range: 75,
        attackInterval: 2000,
        is_two_handed: true,
        moveSpeed: 1
    }),
    warhammer: new Weapon({
        name: "Warhammer",
        damage: 25,
        range: 60,
        attackInterval: 2500,
        is_two_handed: true,
        moveSpeed: 1.5
    }),
    healingPotion: new Item({
        name: "Healing Potion",
        type: "consumable",
        effect: (player) => {
            player.hp = Math.min(player.maxHp, player.hp + 50); // Heal 50 HP, capped at maxHp
        }
    }),
    damagingPotion: new Item({
        name: "Damaging Potion",
        type: "consumable",
        effect: (player) => {
            player.hp = player.hp - 50; // Heal 50 HP, capped at maxHp
        }
    })
};

module.exports = items;
