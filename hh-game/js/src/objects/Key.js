import Object from '/js/src/Object.js'

export default class Key extends Object{

    constructor(game, player, type, name, x_pos, y_pos, group){
        super(game, player, type, name, x_pos, y_pos, group);
        
        // NOTE: As we're using ES6 javascript this is needed to bind the this context in the method
        this.action = this.action.bind(this);
    }

    action(){
        this.player.pickupItem(this);
        // this.player.inventory.push("key");
        this.group.remove(this.sprite);
    }
}