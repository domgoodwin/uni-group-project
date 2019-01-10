import Object from '/js/src/Object.js'

export default class Chest extends Object{
    constructor(game, player, type, name, x_pos, y_pos, group, enterable, special){
        console.log("Creating Chest")
        super(game, player, type, name, x_pos, y_pos, group);
        super.setupObject();
        this.oldSpeed = 0;
        this.opened = 0;
        this.sprite.scale.setTo(2);
        this.enterable = enterable;
        this.special = special;
        this.action = this.action.bind(this);
        this.release = this.release.bind(this);
        this.interact = this.interact.bind(this);
        this.tick = this.tick.bind(this);
        this.chest_type = null;

        if(this.special)
        {
            this.chest_type = Math.floor((Math.random() * 10) + 1);
        }
        console.log("chest type = " + this.chest_type);
    }


    destroy(){
        console.log("Destroying Chest");
        this.sprite.alpha = 1;
        this.sprite.animations.destroy();
        this.sprite.destroy();
    }

    remove(){
        // super.remove();
        console.log("Destroying chest");
        this.sprite.alpha = 0;
        this.sprite.animations.destroy();
        this.sprite.destroy(true);
        this.sprite = null;
    }

    action(){
        console.log("actioning");
        if(this.player.state == null){
            this.sprite.frame = 1;
            this.opened = this.game.time.now + 1000;
        }
    }

    tick(){
        if(this.player.state == null && this.opened < this.game.time.now){
            console.log("in if: "+this.opened);
            this.sprite.frame = 0;
        }
    }

    interact(key, room){
        if(room.lastInteraction > this.game.time.now || this.player.state != null || this.opened < this.game.time.now){
            return;
        }
        console.log("checking chest"+key)
        super.interact();
        if(this.enterable && key == 'space'){
            console.log("in if");
            this.player.sprite.alpha = 0;
            this.sprite.frame = 0;
            this.player.state = this;
            this.oldSpeed = this.player.speed;
            this.player.speed = 0;
            room.lastInteraction = this.game.time.now + 2000;

            if(!this.special){
                room.showText("You're trapped! Try to escape [SPACE]");
            }
            else {
                console.log("chest type: " + this.chest_type);
                if(this.chest_type == 2 || this.chest_type == 6 || this.chest_type == 8)
                {
                    console.log("Player is killed");
                    this.game.state.start("Killed", true, false, this.game.in_rooms);
                }
                else if(this.chest_type == 1 || this.chest_type == 3)
                {
                    console.log("Player Escaped");
                    this.game.state.start("Escaped", true, false, this.game.in_rooms);
                }
                else
                {
                    room.showText("You're trapped! Try to escape [SPACE]");
                }
            }
        }
    }

    release(room){
        this.player.sprite.alpha = 1;
        this.player.speed = this.oldSpeed;
        this.action();
        this.player.state = null;
        room.lastInteraction = this.game.time.now + 2000;
        
        if(this.special)
        {
            room.showText("Nothing happened.")
        }
        else 
        {
            room.showText("You have bested me once again!")
            this.sprite.frame = 1;
        }
    }
}