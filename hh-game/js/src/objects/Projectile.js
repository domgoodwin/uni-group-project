import Object from '/js/src/Object.js'

export default class Projectile extends Object{
    constructor(game, player, type, name, x_pos, y_pos, group, dir, playArea){
        y_pos = y_pos - 20;
        console.log("Creating Projectile")
        super(game, player, type, name, x_pos, y_pos, group);
        // this.sprite.scale.setTo(0.5);
        this.playArea = playArea;
        this.dir = dir;
        this.speed = 4;
        this.destroyed = false;
        this.sprite.frame = 49;
        this.sprite.body.setSize(50, 50, 0, -25);
        this.tick = this.tick.bind(this);
        this.spawned = this.game.time.now;
    }

    tick(){
        // console.log("tick"+this.dir)
        switch(this.dir) {
            case "up":
                this.sprite.y -= this.speed;
                break;
            case "right":
                this.sprite.x += this.speed;
                break;
            case "down":
                this.sprite.y += this.speed;
                break;
            case "left":
                this.sprite.x -= this.speed;
                break;
            default:
                break;
        }
        if(this.game.time.now > this.spawned + 2000 && !this.playArea.contains(this.sprite.world.x, this.sprite.world.y)){
            this.destroy();
        }
        
    }

    destroy(){
        this.sprite.alpha = 0;
        this.sprite.destroy();
        this.destroyed = true;
    }
    action(){
        this.player.damage(1);
    }
}