import Object from '/js/src/Object.js'

export default class Fire extends Object{
    constructor(game, player, type, name, x_pos, y_pos, group){
        console.log("Creating Fire")
        super(game, player, type, name, x_pos, y_pos, group);
        this.addAnimations();
    }

    addAnimations(){
        super.setupObject();
        this.sprite.animations.add('burn', [0, 1, 2], 600, true);
        this.sprite.animations.play('burn', 30, true);
    }

    destroy(){
        console.log("Collision on fire");
        this.player.damage(1);
    }

    remove(){
        // super.remove();
        console.log("Destroying fire");
        this.sprite.animations.destroy();
        this.sprite.destroy(true);
        this.sprite = null;
        console.log(this.sprite);
    }

    action(){
        this.player.damage(1);
    }
}