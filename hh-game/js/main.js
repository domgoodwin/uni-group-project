
var game, rooms;
function main(in_rooms){
    rooms = JSON.parse(in_rooms);
    game = new Phaser.Game(800, 600, Phaser.AUTO, 'hh-game', { preload: preload, create: create, update: update });
}

NORTH_DOOR = [343, 50]
EAST_DOOR = [702, 225]
SOUTH_DOOR = [343, 522]
WEST_DOOR = [130, 225]
debug = false;
VERSION = "v0.1.1"

var playerSpeed = 4;
var health = 5;
var dir = "left";
var lastShot = 0;
var lastZoneMove = 0;
var shooting = false;
var doors = [];
var currentRoom;
var player, playArea, roomDisplay, attack;

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

    game.add.sprite(0, 0, 'room-0');
    game.add.text(715, 567, VERSION, {font: "20px Arial"});
    game.add.text(25, 65, "S: "+playerSpeed, {font: "20px Arial"});
    game.add.text(25, 115, "H: "+health, {font: "20px Arial"});
    game.add.text(25, 165, "5/5", {font: "20px Arial"});
    currentRoom = rooms[0];
    roomDisplay = game.add.text(720, 30, currentRoom.name, {font: "20px Arial"});
    createRoom(currentRoom);

    playArea = new Phaser.Rectangle(130,90, 535, 450);
    game.physics.arcade.enable(playArea);

    setupPlayer();

    // Debug
    // game.debug.geom(playArea,'#0fffff');
}

function update() {
    for(i = 0; i < doors.length && game.time.now > lastZoneMove + 3000; i++){
        door = doors[i];
        game.physics.arcade.overlap(player, door, actionDoor, null, this);
    }

    inBound = playArea.contains(player.x, player.y);
    if(shooting){
        // Do nothing
    } else if (this.leftKey.isDown)
    {
        dir="left";
        move(player, -playerSpeed, 0);
        // player.x -= 4;
        // player.frame = 16;
        player.animations.play('lwalk', 30, true);
    }
    else if (this.rightKey.isDown)
    {            
        dir="right";
        move(player, playerSpeed, 0);
        // player.x += 4;
        // player.frame = 24;
        player.animations.play('rwalk', 30, true);
    } else if (this.upKey.isDown)
    {
        move(player, 0, -playerSpeed);
        // player.y -= 4;
    }
    else if (this.downKey.isDown)
    {
        move(player, 0, playerSpeed);
        // player.y += 4;
    } else {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        player.animations.stop("rwalk");
        player.animations.stop("lwalk");
    }
    if (this.spaceKey.downDuration(50)){
        shoot(dir);
    }

    // Debug
    if (debug){
        game.debug.body(player);
        game.debug.body(doors[0]);
    }


}

function setupPlayer(){
    player = game.add.sprite(300, 400, 'player');
    // sets anchor to centre for collisions
    player.anchor.set(0.5, 1)
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    // left walk animation, frames 16-23, change every 60ticks (1s), loop is true
    player.animations.add('lwalk', [16, 17, 18, 19, 20, 21, 22, 23], 60, true);
    player.animations.add('rwalk', [24, 25, 26, 27, 28, 29, 30, 31], 60, true);
    lattack = player.animations.add('lattack', [48, 32, 33, 34, 35, 36, 48], 5, false);
    rattack = player.animations.add('rattack', [56, 40, 41, 42, 43, 44, 56], 5, false);
    lattack.onComplete.add(attackFinished);
    rattack.onComplete.add(attackFinished);
    player.scale.setTo(2);
    game.physics.enable(player, Phaser.Physics.ARCADE);

}

function createRoom(room){
    console.log("Creating room");
    for(i = 0; i < doors.length; i++){
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
        x = door == "north" ? NORTH_DOOR[0] : door == "east" ? EAST_DOOR[0] : door == "south" ? SOUTH_DOOR[0] : WEST_DOOR[0];
        y = door == "north" ? NORTH_DOOR[1] : door == "east" ? EAST_DOOR[1] : door == "south" ? SOUTH_DOOR[1] : WEST_DOOR[1];
        newDoor = game.add.sprite(x, y, 'door');
        newDoor.name = door;
        angle = door == "north" ? 0 : door == "east" ? 90 : door == "south" ? 0: 90;
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
    nextRoomId = currentRoom.doors[door.name];
    console.log("Going "+nextRoomId);
    var nextRoom;
    for(i = 0; i < rooms.length; i++){
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

// move player object, by x and y
function move(player, x, y){
    if(playArea.contains(player.x+x, player.y+y)){
        player.x += x;
        player.y += y;
    }
}


function shoot(dir) {
    if(game.time.now > lastShot){
        shooting = true;
        attackAnimation = dir == "left" ? "lattack" : "rattack";
        console.log("playing:"+attackAnimation);
        player.animations.play(attackAnimation, 10, false);
        lastShot = game.time.now + 250;
    }
} 

attackFinished =  function(){
    shooting = false;
}
