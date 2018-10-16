export default class Object {
    constructor(game, type, name, x_pos, y_pos){
        this.game = game;
        this.sprite = null;
        this.type = type;
        this.name = name;
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.setupObject();
    }

    setupObject(){
        this.sprite = this.game.add.sprite(this.x_pos, this.y_pos, this.type);
        // sets anchor to centre for collisions
        this.sprite.anchor.set(0.5, 1)
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.collideWorldBounds = true;
        // Setup sprite animations


        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    }

    move(){

    }

}