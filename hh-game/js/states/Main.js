"use strict";

import Player from '/js/src/Player.js';
import Room from '/js/src/Room.js';
import MusicPlayer from '/js/src/MusicPlayer.js';

const VERSION = "1.00";

export default class Main extends Phaser.State {

    init(in_rooms){
        this.in_rooms = in_rooms;
    }

    create() {
        this.game.global.startTime = this.game.time.now;
        // this.game.add.plugin(PhaserInput.Plugin);
        console.log("Game starting:")
        // console.log(this.in_rooms);
        this.generateRooms(this.in_rooms);
        //this.rooms = JSON.parse(this.in_rooms);
        this.game.in_rooms = this.in_rooms;
        this.roomObjects = {};
        this.debug = false;
        this.currentRoomJson = null;
        this.room = null;
        this.lastZoneMove = 0;
        this.playArea = null;
        this.roomDisplay = null;
        this.attack = null;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        window.actionDoor = this.actionDoor.bind(this);
        this.game.musicPlayer = new MusicPlayer(this.game);

        this.setupKeyboard();
        this.playArea = new Phaser.Rectangle(140, 140, 520, 400);

        if (this.game.mode == 2 || this.game.mode == 1) {
            this.player = new Player(this.game, this.playArea, 100, 5);
        } else {
            this.player = new Player(this.game, this.playArea, 5, 5);
        }
        
        this.player.spawn();
        this.game.player = this.player;
        this.game.add.sprite(0, 0, 'room-0');
        this.game.add.text(715, 567, VERSION, {font: "20px Arial"});
        this.speedText = this.game.add.text(25, 65, "S: "+this.player.speed, {font: "20px Arial"});
        this.displayText = this.game.add.text(25, 115, "H: "+this.player.health, {font: "20px Arial"});
        this.invText = this.game.add.text(25, 165, this.player.inventoryDisplay, {font: "20px Arial"});
        this.currentRoomJson = this.rooms[0];
        this.room = new Room(this.game, this.currentRoomJson, this.player, null);
        this.roomDisplay = this.game.add.text(560, 15, this.currentRoomJson.name, {font: "20px Arial"});
        this.setRoomText(this.currentRoomJson.name);
        this.game.physics.arcade.enable(this.playArea);
    }
    
    // Called 100times a second
    update() {
        // Check if any updates are needed
        this.room.checkUpdate();
        this.checkKeyboard();
        this.checkDebug();
        this.setRoomText();
        this.player.tick();

        // Check if moving room
        for(var i = 0; i < this.room.doors.length && this.game.time.now > this.lastZoneMove + 1000; i++){
            var door = this.room.doors[i];
            this.game.physics.arcade.overlap(this.player.sprite, door, this.actionDoor, null, this);
        }
    }
    
    // Setups up the keyboard for what buttons to monitor
    setupKeyboard(){
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR]);    
    }

    // Used when door collision is detected
    // Creates or uses room based on door link
    actionDoor(sprite, door) {
        this.lastZoneMove = this.game.time.now;
        var nextRoomId = this.currentRoomJson.doors[door.name];
        var nextRoom;
        // Gets the next room based on the given door
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

        if(this.room.locked){
            return;
        }

        this.currentRoomJson = nextRoom;
        this.setRoomText(this.currentRoomJson.name);
        this.roomObjects[this.room.id] = this.room;
        this.room.clearState();
        // Checks if room has already been loaded and just renders
        if(this.roomObjects[this.currentRoomJson.id]){
            console.log("Rendering already loaded room");
            this.room = this.roomObjects[this.currentRoomJson.id];
            this.room.render(door.name);
        } else {
            this.room = new Room(this.game, this.currentRoomJson, this.player, door.name, this.playArea);
        }
        if(this.currentRoomJson.locked == true){
            this.room.showText("Unlocked room", "top");
        }
        this.room.showText(this.currentRoomJson.name);

        if(this.currentRoomJson.name === 'Library'){
            var text = this.game.add.text(175, 500, "You hear books talking to you...", { font: "18px Arial", fill: "#ffffff", align: "center" });
            text.anchor.set(0.15);

            // this.game.add.tween(text).to({y: 0}, 1500, Phaser.Easing.Linear.None, true);    //this to move the text to the top and fades
            this.game.add.tween(text).to({alpha: 0}, 3500, Phaser.Easing.Linear.None, true);
        }

        if(this.currentRoomJson.name === 'Basement Exit'){
            var text = this.game.add.text(175, 500, "Enter the chest if you dare...", { font: "18px Arial", fill: "#ffffff", align: "center" });
            text.anchor.set(0.15);

            // this.game.add.tween(text).to({y: 0}, 1500, Phaser.Easing.Linear.None, true);    //this to move the text to the top and fades
            this.game.add.tween(text).to({alpha: 0}, 6000, Phaser.Easing.Linear.None, true);
        }
    }
    
    // Sets the text in the room
    setRoomText(){
        this.roomDisplay.setText(this.currentRoomJson.name);
        this.roomDisplay.fontSize = 25;
        this.roomDisplay.font = "Arial"

        this.displayText.setText("H: "+this.player.health);
        this.invText.setText(this.player.inventoryDisplay);
        this.speedText.setText("S: "+this.player.speed);
    }

    // Checks for any keyboard presses and actions them as such
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

    generateRooms(in_rooms){
        this.rooms = JSON.parse(in_rooms)
        if (!this.game.random) {
            return;
        }

        // eseential rooms
        // 

        // move essential items
        // items: key-old, chest, pickaxe, str_buff, rock_basement, speed_buff, 
        // don't move or clash with: dressingRoom/coffin, blackhole_normal(basement exit only),
        for (var i = 0; i < this.rooms.length; i++) { 
            this.rooms.floor = '#'+Math.floor(Math.random()*16777215).toString(16); 
            var curRoom = this.rooms[i]
            if(curRoom.objects){
                for (var j = 0; j < curRoom.objects.length; j++){
                    var curItem = curRoom.objects[j]
                    switch (curItem.name) {
                        case "key-old":
                            this.moveObject(i, curItem, -1);
                            break;
                        case "pickaxe":
                            this.moveObject(i, curItem, 1);
                            break;
                        case "str_buff":
                            this.moveObject(i, curItem, 1);
                            break;
                        case "speed_buff":
                            this.moveObject(i, curItem, 0);
                            break;
                        case "random_fire":
                            this.moveObject(i, curItem, 0);
                            break;
                        // case "rock_basement":
                        //     this.moveObject(i, curItem, 1);
                        //     break;
                        default:
                            break
                    }
                }
            }
        }
        // place fire in random rooms

        this.in_rooms = JSON.stringify(this.rooms);
        // console.log(this.rooms)
        // console.log(this.in_rooms)
    }

    moveObject(oldIndex, curItem, criteria){
        // critera: -1 (basement only), 0 (anywhere), 1 (not basement), 2 (top floor only)
        console.log("Old "+curItem.name+" room"+this.rooms[oldIndex].name)
        var possibilities = []
        var start = 0;
        for (var i = 0; i < this.rooms.length; i++) { 
            var room = this.rooms[i]
            if (criteria == -1 && room.level == -1){
                possibilities.push(room);
            }
            else if (criteria == 0){
                possibilities.push(room);
            }
            else if (criteria == 1 && room.level > -1){
                possibilities.push(room);
            }
            else if (criteria == 1 && room.level == 1){
                possibilities.push(room);
            }
        }
        if(!possibilities.length > 0) return
        var index = Math.floor(Math.random() * possibilities.length) + 0;
        console.log("debug"+index)
        console.log(possibilities)
        console.log("New "+curItem.name+" room"+possibilities[index].name)
        possibilities[index].objects = possibilities[index].objects ? possibilities[index].objects : [];
        possibilities[index].objects.push(curItem);
        var posIndex = this.rooms.indexOf(possibilities[index]);
        if (posIndex !== -1) this.rooms[posIndex].objects = possibilities[index].objects;
        var itemIndex = this.rooms[oldIndex].objects.indexOf(curItem);
        if (itemIndex !== -1) this.rooms[oldIndex].objects.splice(itemIndex, 1);
    }

    // Shows debug information if flag is set
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
                if(this.room.objects[i].sprite){
                    this.game.debug.body(this.room.objects[i].sprite);
                }
            }
            for(var i = 0; i < this.player.projectiles.length; i++){
                this.game.debug.body(this.player.projectiles[i].sprite);
            }
        }
        else {
            this.game.debug.reset();
        }
    }
}
