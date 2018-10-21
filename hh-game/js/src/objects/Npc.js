import Object from '/js/src/Object.js'

export default class Npc extends Object {
    constructor(game, player, type, name, x_pos, y_pos) {        
        super(game, player, type, name, x_pos, y_pos);

        console.log("NPC: Creating an NPC");

        this.walkAnimations();
        this.walk();
    }

    walkAnimations() {
        super.setupObject();
        this.sprite.animations.add('walk');
        this.sprite.animations.play('walk', 20, true);
        console.log("NPC: Commencing walk animations");
    }

    walk() {
        var walkSpeedInSeconds = 6000;
        var endPostionX = 600;
        this.game.add.tween(this.sprite).to({ x: endPostionX }, walkSpeedInSeconds, Phaser.Easing.Linear.None, true);
        console.log("NPC: Commencing walk across screen");
        // TODO: Add functionality to make NPC turn around when reaches position x=600
    }

    action() {
        this.player.damage(1);
        console.log("NPC: Collision on NPC");
    }

    attack() {
        //TODO: Attack method for NPCs to add attack animaitons when collision with Player
    }

    destroy() {
        this.sprite.animations.stop("walk");
        this.sprite.destroy(true);
        this.sprite = null;
    }
}