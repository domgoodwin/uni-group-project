import Object from '/js/src/Object.js'

export default class Key extends Object{
    constructor(game, player, type, name, x_pos, y_pos){
        console.log("Creating Key")
        super(game, player, type, name, x_pos, y_pos);
    }

    destroy(){
        this.sprite.destroy(true);
        this.sprite = null;
    }

    action(){
        console.log("Collecting Key OOOOHHHHHHH");
        this.player.inventory.push("key");
        // TODO Destroy key on pickup.
        // this.sprite.destroy(true);
        // Key added to inventory to unlock door
    }
}