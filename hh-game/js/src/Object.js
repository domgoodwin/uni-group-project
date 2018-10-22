"use strict";

export default class Object {
    constructor(game, player, type, name, x_pos, y_pos, group){
        this.game = game;
        this.player = player;
        this.sprite = null;
        this.type = type;
        this.name = name;
        this.exists = true;
        console.log(group);
        this.group = group;
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.setupObject();
    }

    setupObject(){
        // this.sprite = this.game.add.sprite(this.x_pos, this.y_pos, this.type);
        console.log(this.group);
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


}