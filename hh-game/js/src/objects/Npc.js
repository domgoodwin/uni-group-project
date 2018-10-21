import Object from '/js/src/Object.js'

export default class NpcClone extends Object {
    constructor(game, player, type, name, x_pos, y_pos){
        console.log("Creating NPC Clone")
        super(game, player, type, name, x_pos, y_pos);
        this.addAnimations();
    }

    addAnimations() {
        super.setupObject();
        this.sprite.animations.add('walk');
        this.sprite.animations.play('walk', 50, true);
        //TODO: Look alive animations (moving around / resting)
    }

    walk() {        

        if (sprite.x >= 300) {
            sprite.scale.x += 0.01;
            sprite.scale.y += 0.01;
        }
    }

    action() {
        console.log("Collision on NPC");
        this.player.damage(1);
    }

    attack() {
        //TODO: Attack method for NPCs
    }

    destroy() {
        this.sprite.animations.stop("burn");
        this.sprite.destroy(true);
        this.sprite = null;
    }
}