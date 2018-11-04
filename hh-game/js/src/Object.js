export default class Object {
    constructor(game, player, type, name, x_pos, y_pos, group){
        this.game = game;
        this.player = player;
        this.sprite = null;
        this.type = type;
        this.name = name;
        this.exists = true;
        this.group = group;
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.available = true;
        this.setupObject();
        this.interact = this.interact.bind(this);
    }

    setupObject(){
        // this.sprite = this.game.add.sprite(this.x_pos, this.y_pos, this.type);
        this.sprite = this.group.create(this.x_pos, this.y_pos, this.type);
        // sets anchor to centre for collisions
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.anchor.set(0.5, 1)
        this.sprite.body.collideWorldBounds = true;
        // Setup sprite animations

        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        // this.sprite.body.immovable = true;
    }

    move() {

    }

    tick(){
        
    }

    interact(key, room){
    }



}