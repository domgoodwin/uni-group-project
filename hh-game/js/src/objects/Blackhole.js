import Object from '/js/src/Object.js'

export default class Blackhole extends Object{
    constructor(game, player, type, name, x_pos, y_pos, group, enterable, effect, room){
        console.log("Creating Blackhole")
        super(game, player, type, name, x_pos, y_pos, group);
        // super.setupObject();
        this.oldSpeed = 0;
        this.opened = 0;
        this.effect = effect;
        this.room = room;
        this.sprite.scale.setTo(2);
        this.enterable = enterable;
        this.name = name;
        this.addAnimations();
        this.tintEffect();
        
        this.action = this.action.bind(this);
        this.interact = this.interact.bind(this);
        this.tick = this.tick.bind(this);
    }

    addAnimations(){
        super.setupObject();
        this.sprite.animations.add('pulse', [10, 11, 12, 13, 14, 15, 16, 17, 18], 100, true);
        this.sprite.animations.play('pulse', 30, true);
    }

    destroy(){
        console.log("Collision on blackhole");
        this.player.damage(1);
    }

    remove(){
        console.log("Destroying blackhole");
        this.sprite.animations.destroy();
        this.sprite.destroy(true);
        this.sprite = null;
        console.log(this.sprite);
    }

    action(){
        if(this.player.state == null){
            // this.sprite.frame = 1;
            this.opened = this.game.time.now + 1000;
        }
    }

    tick(){

    }

    tintEffect(){
        console.log(this.effect);
        switch(this.effect) {
            case "teleport":
                this.sprite.tint = 0x000000;
                break;
            default:
                this.sprite.alpha = 0;
                console.log("Invalid effect for Circle chosen");
                break;
        }
    }

    interact(key, room){
        if(room.lastInteraction > this.game.time.now || this.player.state != null || this.opened < this.game.time.now){
            return;
        }
        console.log("checking blackhole"+key)
        super.interact();

        if(this.enterable && key == 'space'){
            room.lastInteraction = this.game.time.now + 2000;
            room.showText("Travelling through time and space...", "top");
            window.actionDoor(this.player, {"name":"extra"});   
        }
    }

}