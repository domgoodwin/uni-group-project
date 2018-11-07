"use strict";

import Player from '/js/src/Player.js';
import Room from '/js/src/Room.js';
import MusicPlayer from '/js/src/MusicPlayer.js';

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
        this.game.musicPlayer = new MusicPlayer(this.game);

        this.setupKeyboard();

        this.player = new Player(this.game);
        this.player.spawn();
        this.game.add.sprite(0, 0, 'room-0');
        this.game.add.text(715, 567, VERSION, {font: "20px Arial"});
        this.speedText = this.game.add.text(25, 65, "S: "+this.player.speed, {font: "20px Arial"});
        this.displayText = this.game.add.text(25, 115, "H: "+this.player.health, {font: "20px Arial"});
        this.invText = this.game.add.text(25, 165, this.player.inventoryDisplay, {font: "20px Arial"});
        this.currentRoomJson = this.rooms[0];
        this.room = new Room(this.game, this.currentRoomJson, this.player, null);
        this.roomDisplay = this.game.add.text(720, 30, this.currentRoomJson.name, {font: "20px Arial"});
    
        this.playArea = new Phaser.Rectangle(140, 140, 520, 400);
        this.game.physics.arcade.enable(this.playArea);
    }
    
    update() {
        this.room.checkUpdate();

        this.checkKeyboard();
        this.checkDebug();
        this.player.tick();

        // Check if moving room
        for(var i = 0; i < this.room.doors.length && this.game.time.now > this.lastZoneMove + 1000; i++){
            var door = this.room.doors[i];
            this.game.physics.arcade.overlap(this.player.sprite, door, this.actionDoor, null, this);
        }


        this.displayText.setText("H: "+this.player.health);
        this.invText.setText(this.player.inventoryDisplay);
        this.speedText.setText("S: "+this.player.speed);


    
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
        } 

        // TODO: move key check into somewhere like room
        if (nextRoom.locked == true && this.player.inventory.includes("key-old") == false ) {
            this.room.showText("Door is locked");
            return;
        }

        this.currentRoomJson = nextRoom;
        this.roomDisplay.setText(this.currentRoomJson.name);
        this.roomObjects[this.room.id] = this.room;
        this.room.clearState();
        if(this.roomObjects[this.currentRoomJson.id]){
            console.log("Rendering already loaded room");
            this.room = this.roomObjects[this.currentRoomJson.id];
            this.room.render(door.name);
        } else {
            this.room = new Room(this.game, this.currentRoomJson, this.player, door.name);
        }
        if(this.currentRoomJson.locked == true){
            this.room.showText("Unlocked room", "top");
        }
        this.room.showText(this.currentRoomJson.name);

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
            this.room.interact("space");
            this.player.shoot();
        }
    }

    checkDebug(){
        // Debug
        if (this.game.global.debug){
            this.game.debug.body(this.player.sprite);
            this.game.debug.spriteInfo(this.player.sprite, 32, 32);
            this.game.debug.geom(this.playArea,'#ff0000', false);
            for(var i = 0; i < this.room.doors.length; i++){
                this.game.debug.body(this.room.doors[i]);
            }
            for(var i = 0; i < this.room.objects.length; i++){
                this.game.debug.body(this.room.objects[i].sprite);
            }
        }
        else {
            this.game.debug.reset();
        }
    }

}



