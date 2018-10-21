import Object from '/js/src/Object.js'

export default class Key extends Object{
    constructor(game, player, type, name, x_pos, y_pos){
        console.log("Creating Key")
        super(game, player, type, name, x_pos, y_pos);
    }

    action(){
        console.log("Collecting Key OOOOHHHHHHH");
        this.player.inventory.push(this);
        destroy();
        // Key added to inventory to unlock door
    }

    destroy(){
        this.sprite.destroy(true);
        this.sprite = null;
    }
}