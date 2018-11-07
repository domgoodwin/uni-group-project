export default class{
    constructor(game){
        this.game = game;
        this.sprite = null;
        this.speed = 4;
        this.health = 5;
        this.lastShot = 0;
        this.lastDamage = 0;
        this.lastPickup = 0;
        this.effect = null;
        this.shooting = false;
        this.state = null;
        this.dir = "left";
        this.setupPlayer();
        this.inventory = [];
        this.inventoryDisplay = "[ ]";
        this.tick = this.tick.bind(this);

    }

    spawn(){

    }


    setupPlayer(){
        this.sprite = this.game.add.sprite(300, 400, 'player');
        // sets anchor to centre for collisions
        this.sprite.anchor.set(0.5, 1)
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.collideWorldBounds = true;
        // left walk animation, frames 16-23, change every 60ticks (1s), loop is true
        this.sprite.animations.add('lwalk', [16, 17, 18, 19, 20, 21, 22, 23], 60, true);
        this.sprite.animations.add('rwalk', [24, 25, 26, 27, 28, 29, 30, 31], 60, true);
        var lattack = this.sprite.animations.add('lattack', [48, 32, 33, 34, 35, 36, 48], 5, false);
        var rattack = this.sprite.animations.add('rattack', [56, 40, 41, 42, 43, 44, 56], 5, false);
        var dmg = this.sprite.animations.add('dmg', [63], 5, false);
        lattack.onComplete.add(this.attackFinished, this);
        rattack.onComplete.add(this.attackFinished, this);
        this.sprite.scale.setTo(2);
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    }

    damage(amount){
        if(this.game.time.now > this.lastDamage){
            this.health -= amount;
            this.lastDamage = this.game.time.now + 3000;
            this.sprite.animations.play('dmg', 300, false);
        }
    }

    updateAnimation(animation, start){
        if(this.game.time.now > this.lastDamage){
            if(start){
                this.sprite.animations.play(animation, 30, true);
            } else {
                this.sprite.animations.stop(animation);
            }
        }
    }

    tick(){
        if(this.effect == "strength"){
            this.sprite.tint = 0xFF0000;
        } else if(this.effect == "poison"){
            this.sprite.tint = 0x00FF00;
        } else if (this.effect == "speed"){
            this.speed += 2;
            this.effect = "";
        } else {
            this.sprite.tint = 0xFFFFFF;
        }
        if(this.health <= 0){
            console.log("Player dead")
            this.game.state.start("Gameover", true, false, this.game.in_rooms);
        }
    }


    // move player object, by x and y
    move(playArea, dir){
        var x = 0;
        var y = 0;
        this.dir = dir;
        switch(dir) {
            case "up":
                y -= this.speed;
                this.updateAnimation('lwalk', true);
                break;
            case "right":
                x += this.speed;
                this.updateAnimation('rwalk', true);
                break;
            case "down":
                y += this.speed;
                this.updateAnimation('lwalk', true);
                break;
            case "left":
                x -= this.speed;
                this.updateAnimation('lwalk', true);
                break;
            case "stop":
                this.sprite.body.velocity.x = 0;
                this.sprite.body.velocity.y = 0;
                break;
            default:
                break;
        } 
        if(this.dir == "stop"){
            this.sprite.animations.stop("rwalk");
            this.sprite.animations.stop("lwalk");
        }
        if(playArea.contains(this.sprite.x+x, this.sprite.y+y)){
            this.sprite.x += x;
            this.sprite.y += y;
        }
    }


    shoot() {
        if(this.game.time.now > this.lastShot){
            this.shooting = true;
            var attackAnimation = this.dir == "left" ? "lattack" : "rattack";
            console.log("playing:"+attackAnimation);
            this.sprite.animations.play(attackAnimation, 10, false);
            this.lastShot = this.game.time.now + 250;
        }
    } 

    attackFinished(){
        this.shooting = false;
    }

    pickupItem(item){
        if(this.game.time.now > this.lastPickup && item.available){
            console.log("Picking up item: "+item.name)
            item.available = false;
            this.lastPickup = this.game.time.now + 1000;
            this.inventory.push(item.name);
            var invStr = "";
            for (var i = 0; i < this.inventory.length; i++) {
                invStr += this.inventory[i].charAt(0) + ",";
            }
            this.inventoryDisplay = "[ " + invStr.slice(0, -1) + " ]";
        }
    }

    removeItem(item){
        this.inventory.splice( this.inventory.indexOf(item), 1 );
        var invStr = "";
        for (var i = 0; i < this.inventory.length; i++) {
            invStr += this.inventory[i].charAt(0) + ",";
        }
        this.inventoryDisplay = "[ " + invStr.slice(0, -1) + " ]";
    }

}