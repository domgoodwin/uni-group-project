import Object from '/js/src/Object.js'

export default class Fire extends Object{
    constructor(game, player, type, name, x_pos, y_pos, group){
        console.log("Creating Fire")
        super(game, player, type, name, x_pos, y_pos, group);
        this.addAnimations();
        this.destroy = this.destroy.bind(this);
        this.action = this.action.bind(this);


    }

    addAnimations(){
        super.setupObject();
        this.sprite.animations.add('pulse', [10, 11, 12, 13, 14, 15, 16, 17, 18], 100, true);
        this.sprite.animations.play('pulse', 30, true);
    }

    destroy(){
        console.log("destroying");
        this.sprite.alpha = 1;
        this.sprite.destroy();
    }

    remove(){
        super.remove();
        console.log("Destroying fire");
        this.sprite.animations.destroy();
        this.sprite.destroy(true);
        this.sprite = null;
        console.log(this.sprite);
    }

    action(){
        console.log("actioning");
        this.player.effect = "strength";
        this.destroy();
    }
}