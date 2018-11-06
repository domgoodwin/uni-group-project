import Object from '/js/src/Object.js'

export default class Axe extends Object{

    constructor(game, player, type, name, x_pos, y_pos, group, pickaxe){
        super(game, player, type, name, x_pos, y_pos, group);
        this.sprite.frame = pickaxe ? 1 : 0;
        // NOTE: As we're using ES6 javascript this is needed to bind the this context in the method
        this.action = this.action.bind(this);
    }

    action(){
        this.player.pickupItem(this);
        this.player.sprite.addChild(this.sprite);
        this.sprite.x = 20;
        this.sprite.y = 0;
        this.sprite.scale.setTo(0.5);
        // this.player.inventory.push("key");
        this.group.remove(this.sprite);
    }
}