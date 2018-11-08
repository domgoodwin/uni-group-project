import Object from '/js/src/Object.js'

export default class Fire extends Object{
    constructor(game, player, type, name, x_pos, y_pos, group, effect){
        console.log("Creating Fire")
        super(game, player, type, name, x_pos, y_pos, group);
        this.effect = effect;
        this.addAnimations();
        this.tintEffect();

        this.destroy = this.destroy.bind(this);
        this.action = this.action.bind(this);
        this.tintEffect = this.tintEffect.bind(this);
    }

    addAnimations(){
        super.setupObject();
        this.sprite.animations.add('pulse', [10, 11, 12, 13, 14, 15, 16, 17, 18], 100, true);
        this.sprite.animations.play('pulse', 30, true);
    }

    tintEffect(){
        console.log(this.effect);
        switch(this.effect) {
            case "strength":
                this.sprite.tint = 0xFF0000;
                break;
            case "speed":
                this.sprite.tint = 0x0000FF;
                break;
            case "poison":
                this.sprite.tint = 0x00FF00;
                break;
            default:
                this.sprite.alpha = 0;
                console.log("Invalid effect for Circle chosen");
                break;
        }
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
        this.player.effect.push(this.effect);
        this.destroy();
    }
}