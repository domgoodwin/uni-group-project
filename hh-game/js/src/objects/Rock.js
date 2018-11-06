import Object from '/js/src/Object.js'

export default class Chest extends Object{
    constructor(game, player, type, name, x_pos, y_pos, group, room){
        console.log("Creating Chest")
        super(game, player, type, name, x_pos, y_pos, group);
        // this.sprite.scale.setTo(0.5);
        this.room = room;
        this.sprite.scale.setTo(0.5);
        this.action = this.action.bind(this);
        this.release = this.release.bind(this);
        this.interact = this.interact.bind(this);
        this.tick = this.tick.bind(this);
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
        if(this.player.effect == "strength"){
            this.player.effect = null;
            this.destroy();
            this.room.showText("\"Souls scream from below you\"");
        } else {
            this.room.showText("You don't have the strength");
        }
    }

    tick(){
    }

    interact(key, room){
    }

    release(room){
    }
}