"use strict";

import Player from '/js/src/Player.js';
import Room from '/js/src/Room.js';

const VERSION = "0.20";

export default class Main extends Phaser.State {

    init(in_rooms){
        this.in_rooms = in_rooms;
    }

    create() {

        // this.game.add.plugin(PhaserInput.Plugin);
        console.log("Game starting: " + this.in_rooms)
        this.rooms = JSON.parse(this.in_rooms);
        this.roomObjects = {};
        this.debug = false;
        this.currentRoomJson = null;
        this.room = null;
        this.lastZoneMove = 0;
        this.playArea = null;
        this.roomDisplay = null;
        this.attack = null;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.setupKeyboard();

        this.player = new Player(this.game);
        this.player.spawn();
        this.game.add.sprite(0, 0, 'room-0');
        this.game.add.text(715, 567, VERSION, {font: "20px Arial"});
        this.game.add.text(25, 65, "S: "+this.player.speed, {font: "20px Arial"});
        this.displayText = this.game.add.text(25, 115, "H: "+this.player.health, {font: "20px Arial"});
        this.invText = this.game.add.text(25, 165, this.player.inventoryDisplay, {font: "20px Arial"});
        this.currentRoomJson = this.rooms[0];
        this.room = new Room(this.game, this.currentRoomJson, this.player, null);
        this.roomDisplay = this.game.add.text(720, 30, this.currentRoomJson.name, {font: "20px Arial"});

    
        this.playArea = new Phaser.Rectangle(130, 90, 535, 450);
        this.game.physics.arcade.enable(this.playArea);
    }
    
    update() {
        this.room.checkUpdate();

        this.checkKeyboard();
        this.checkDebug();

        // Check if moving room
        for(var i = 0; i < this.room.doors.length && this.game.time.now > this.lastZoneMove + 1000; i++){
            var door = this.room.doors[i];
            this.game.physics.arcade.overlap(this.player.sprite, door, this.actionDoor, null, this);
        }


        this.displayText.setText("H: "+this.player.health);
        this.invText.setText(this.player.inventoryDisplay);

    
    }

    render(){
        if (this.game.global.debug){
            for(var i = 0; i < this.objects.length; i++){
                this.game.debug.spriteInfo(sprite, 32, 32);
            }

        }
    }
    
    setupKeyboard(){
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR]);    
    }
    
    
    
    actionDoor(sprite, door) {
        this.lastZoneMove = this.game.time.now;
        var nextRoomId = this.currentRoomJson.doors[door.name];
        var nextRoom;
        for (var i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].id == nextRoomId) {
                nextRoom = this.rooms[i];
            }
        }
        if (!nextRoom) {
            this.roomDisplay.setText("Error")
            return;
        } else if (nextRoom.locked == true && this.player.inventory.includes("key") == false ) {
            this.roomDisplay.setText("Door is Locked")
            return;
        }

        this.currentRoomJson = nextRoom;
        // TODO: Add a funciton to delete objects (fire + NPCs) when entering into a new room
        // mummy.destroy();
        this.roomDisplay.setText(this.currentRoomJson.name);
        this.roomObjects[this.room.id] = this.room;
        this.room.clearState();
        this.room = new Room(this.game, this.currentRoomJson, this.player, door.name);
        var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, this.currentRoomJson.name, { font: "25px Arial", fill: "#ffffff", align: "center" });
        text.anchor.set(0.5);
   
        // this.game.add.tween(text).to({y: 0}, 1500, Phaser.Easing.Linear.None, true);    //this to move the text to the top and fades
        this.game.add.tween(text).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);


        if(this.currentRoomJson.name === 'Library'){
            var text = this.game.add.text(175, 500, "You hear books talking to you...", { font: "13px Arial", fill: "#ffffff", align: "center" });
            text.anchor.set(0.15);

            // this.game.add.tween(text).to({y: 0}, 1500, Phaser.Easing.Linear.None, true);    //this to move the text to the top and fades
            this.game.add.tween(text).to({alpha: 0}, 3500, Phaser.Easing.Linear.None, true);
        }


  
    }

    checkKeyboard(){
        if(this.player.shooting){
            // Do nothing
        } else if (this.leftKey.isDown)
        {
            this.player.move(this.playArea, "left");
        }
        else if (this.rightKey.isDown)
        {            
            this.player.move(this.playArea, "right");
        } else if (this.upKey.isDown)
        {
            this.player.move(this.playArea, "up")
        }
        else if (this.downKey.isDown)
        {
            this.player.move(this.playArea, "down")
        } else {
            this.player.move(this.playArea, "stop")
        }
        
        if (this.spaceKey.downDuration(50)){
            this.player.shoot();
        }
    }

    checkDebug(){
        // Debug
        if (this.game.global.debug){
            this.game.debug.body(this.player.sprite);
            this.game.debug.geom(playArea,'#0fffff');
            for(var i = 0; i < this.room.doors.length; i++){
                this.game.debug.body(this.room.doors[i]);
            }
            for(var i = 0; i < this.objects.length; i++){
                this.game.debug.body(this.objects[i].sprite);
                this.game.debug.spriteInfo(sprite, 32, 32);
            }
        }
    }

}



