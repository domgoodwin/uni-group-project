import Object from '/js/src/Object.js'

export default class Rock extends Object{
    constructor(game, player, type, name, x_pos, y_pos, group, room){
        console.log("Creating Rock")
        console.log(room)
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
        if(this.player.inventory.includes("pickaxe")){
            console.log("Destroy rock");
            this.player.effect.splice(this.player.effect.indexOf('strength'), 1);
            console.log(this.room);
            this.room.showText("\"Souls scream from below you\"", "top");
            this.destroy();
            this.player.sprite.removeChildAt(0);
        } else {
            this.room.showText("You don't have the right tools", "top");
        }
    }

    tick(){
    }

    interact(key, room){
    }

    release(room){
    }
}