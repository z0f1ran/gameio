class Item {
    constructor(props) {
        this.name = props.name || "Unknown Item";
        this.type = props.type || "consumable"; // Type of item (e.g., consumable, equipment)
        this.effect = props.effect || (() => {}); // Effect to apply when the item is used
    }

    useItem(player) {
        this.effect(player);
        if (this.type === "consumable") {
            // Remove consumable item after use
            player.inventory[player.selectedSlot] = null;
        }
    }
}

module.exports = Item;
