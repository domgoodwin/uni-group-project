import Object from '/js/objects/Object.js'

export default class Fire extends Object{
    constructor(game, type, name, x_pos, y_pos){
        super(game, type, name, x_pos, y_pos);
        this.addAnimations();
    }

    addAnimations(){
        super.setupObject();
        this.sprite.animations.add('burn', [0, 1, 2], 600, true);
        this.sprite.animations.play('burn', 30, true);
    }

    action(){
        console.log("Collision on fire")
        this.game.add.filter('fire-filter', 800, 600)
        // fire-filter
    }
}