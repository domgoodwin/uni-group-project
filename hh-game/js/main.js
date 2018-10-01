import Player from '/js/objects/Player.js';
var game, rooms;
export function main(in_rooms){
    rooms = JSON.parse(in_rooms);
    game = new Phaser.Game(800, 600, Phaser.AUTO, 'hh-game', { preload: preload, create: create, update: update });
}

var NORTH_DOOR = [343, 50]
var EAST_DOOR = [702, 225]
var SOUTH_DOOR = [343, 522]
var WEST_DOOR = [130, 225]
var debug = true;
var VERSION = "v0.1.1"

var doors = [];
var currentRoom;
var lastZoneMove = 0;

var playArea, roomDisplay, attack;

function preload() {
    game.load.image('room-0', 'img/room-0.png');
    // spritsheet, 48x48 px
    game.load.spritesheet('player', 'img/player.png', 48, 48);
    game.load.image('door', 'img/wood.png');
}

function create() {
    console.log("Recreating world");
    // game.world.setBounds(0, 0, 500, 400);
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR]);
    this.player = new Player(this.game);
    this.player.spawn();
    game.add.sprite(0, 0, 'room-0');
    game.add.text(715, 567, VERSION, {font: "20px Arial"});
    game.add.text(25, 65, "S: "+this.player.speed, {font: "20px Arial"});
    game.add.text(25, 115, "H: "+this.player.health, {font: "20px Arial"});
    game.add.text(25, 165, "5/5", {font: "20px Arial"});
    currentRoom = rooms[0];
    roomDisplay = game.add.text(720, 30, currentRoom.name, {font: "20px Arial"});
    createRoom(currentRoom);

    playArea = new Phaser.Rectangle(130,90, 535, 450);
    game.physics.arcade.enable(playArea);


    // Debug
    // game.debug.geom(playArea,'#0fffff');
}

function update() {
    for(var i = 0; i < doors.length && game.time.now > lastZoneMove + 3000; i++){
        var door = doors[i];
        game.physics.arcade.overlap(this.player.sprite, door, actionDoor, null, this);
    }

    var inBound = playArea.contains(this.player.x, this.player.y);
    var dir = "stop";
    if(this.player.shooting){
        // Do nothing
    } else if (this.leftKey.isDown)
    {
        dir="left";
        this.player.move(playArea, dir);
    }
    else if (this.rightKey.isDown)
    {            
        dir="right";
        this.player.move(playArea, dir);
    } else if (this.upKey.isDown)
    {
        dir="up";
        this.player.move(playArea, dir)
    }
    else if (this.downKey.isDown)
    {
        dir="down";
        this.player.move(playArea, dir)
    } else {
        this.player.move(playArea, "stop")
    }
    
    if (this.spaceKey.downDuration(50)){
        shoot(dir);
    }

    // Debug
    if (debug){
        game.debug.body(this.player.sprite);
        game.debug.body(doors[0]);
    }


}


function createRoom(room){
    console.log("Creating room");
    for(var i = 0; i < doors.length; i++){
        door = doors[i];
        door.destroy();
    }
    doors = [];
    console.log(room)
    for(var door in room.doors){
        // Check if no door destination
        if (! room.doors[door])
            continue;
        console.log(door);
        console.log(room.doors[door]);
        var x = door == "north" ? NORTH_DOOR[0] : door == "east" ? EAST_DOOR[0] : door == "south" ? SOUTH_DOOR[0] : WEST_DOOR[0];
        var y = door == "north" ? NORTH_DOOR[1] : door == "east" ? EAST_DOOR[1] : door == "south" ? SOUTH_DOOR[1] : WEST_DOOR[1];
        var newDoor = game.add.sprite(x, y, 'door');
        newDoor.name = door;
        var angle = door == "north" ? 0 : door == "east" ? 90 : door == "south" ? 0: 90;
        newDoor.angle = angle;
        newDoor.scale.setTo(0.04);
        game.physics.enable(newDoor, Phaser.Physics.ARCADE);
        newDoor.body.immovable = true;
        doors.push(newDoor);
    }
    game.stage.backgroundColor = room.floor;
    console.log(doors);
}

function getRoom(){

}



function actionDoor(sprite, door){
    lastZoneMove = game.time.now;
    var nextRoomId = currentRoom.doors[door.name];
    console.log("Going "+nextRoomId);
    var nextRoom;
    for(var i = 0; i < rooms.length; i++){
        if(rooms[i].id == nextRoomId){
            nextRoom = rooms[i];
        }
    }
    if(!nextRoom){
        roomDisplay.setText("Error")
        return;
    }
    currentRoom = nextRoom;
    roomDisplay.setText(currentRoom.name);
    createRoom(currentRoom);

}

