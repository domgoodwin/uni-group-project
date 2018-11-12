import Object from '/js/src/Object.js'
import Room from '/js/src/Room.js'
import Monster from '/js/src/Room.js'

export default class Coffin extends Object{

    constructor(game, player, type, name, x_pos, y_pos, group, room){
        super(game, player, type, name, x_pos, y_pos, group, room);
        this.room = room;
        this.isOpen = false;
        // NOTE: As we're using ES6 javascript this is needed to bind the this context in the method
        this.action = this.action.bind(this);
    }

    action() {
        console.log("Collision on Coffin");
        if (!this.isOpen) {
            // open animation, frames 0-3, ?, loop is false
            this.sprite.animations.add('open', [0, 1, 2, 3, 1], 1, false);
            //  And this starts the animation playing by using its name ("open")
            //  2 is the frame rate (2fps) as there are 4 frames this means it will take 2 seconds start to finish of animation.
            //  false so it will NOT loop.
            this.sprite.animations.play('open', 1.2, false);

            this.isOpen = true;
            this.spawnGhost();
        }
    }

    spawnGhost(){
        //Spawn Ghost(game, player, type, name, x_pos, y_pos, group
        this.type = 'ghost'
        this.room.createObject(this);
    }

    remove(){
        console.log("remove() Coffin");
        super.remove();
        console.log("Destroying Coffin");
        this.sprite.animations.destroy();
        this.sprite.destroy(true);
        this.sprite = null;
        console.log(this.sprite);
    }

}