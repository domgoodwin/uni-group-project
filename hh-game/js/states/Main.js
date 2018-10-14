import Player from '/js/objects/Player.js';

const NORTH_DOOR = [343, 50]
const EAST_DOOR = [670, 225]
const SOUTH_DOOR = [343, 522]
const WEST_DOOR = [100, 225]
const VERSION = "0.11";

class Main extends Phaser.State {

    init(in_rooms){
        console.log("init"+in_rooms)
        this.in_rooms = in_rooms;
    }
    
    create() {
        console.log("Game starting: " + this.in_rooms)
        this.rooms = JSON.parse(this.in_rooms);
        console.log(this.rooms)
        this.debug = true;
        this.VERSION = "v0.1.1"
        this.doors = [];
        this.currentRoom = null;
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
        this.game.add.text(25, 115, "H: "+this.player.health, {font: "20px Arial"});
        this.game.add.text(25, 165, "5/5", {font: "20px Arial"});
        this.currentRoom = this.rooms[0];
        this.roomDisplay = this.game.add.text(720, 30, this.currentRoom.name, {font: "20px Arial"});
        this.createRoom(this.currentRoom);
    
        this.playArea = new Phaser.Rectangle(130,90, 535, 450);
        this.game.physics.arcade.enable(this.playArea);
    
    
        // Debug
        // game.debug.geom(playArea,'#0fffff');
    }
    
    update() {
        for(var i = 0; i < this.doors.length && this.game.time.now > this.lastZoneMove + 3000; i++){
            var door = this.doors[i];
            this.game.physics.arcade.overlap(this.player.sprite, door, this.actionDoor, null, this);
        }
    
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
            shoot(dir);
        }
    
        // Debug
        if (this.debug){
            this.game.debug.body(this.player.sprite);
            for(var i = 0; i < this.doors.length; i++){
                this.game.debug.body(this.doors[i]);
            }
        }
    
    
    }
    
    
    createRoom(room){
        console.log("Creating room");
        for(var i = 0; i < this.doors.length; i++){
            var door = this.doors[i];
            door.destroy();
        }
        this.doors = [];
        console.log(room)
        for(var door in room.doors){
            // Check if no door destination
            if (! room.doors[door])
                continue;
            console.log(door);
            console.log(room.doors[door]);
            var x = door == "north" ? NORTH_DOOR[0] : door == "east" ? EAST_DOOR[0] : door == "south" ? SOUTH_DOOR[0] : WEST_DOOR[0];
            var y = door == "north" ? NORTH_DOOR[1] : door == "east" ? EAST_DOOR[1] : door == "south" ? SOUTH_DOOR[1] : WEST_DOOR[1];
            var doorImg = door == "north" || door == "south" ? "door-ns" : "door-ew";
            var newDoor = this.game.add.sprite(x, y, doorImg);
            newDoor.name = door;
            // var angle = door == "north" ? 0 : door == "east" ? 90 : door == "south" ? 0: 90;
            // newDoor.angle = angle;
            newDoor.scale.setTo(0.04);
            this.game.physics.enable(newDoor, Phaser.Physics.ARCADE);
            newDoor.body.immovable = true;
            this.doors.push(newDoor);
        }
        this.game.stage.backgroundColor = room.floor;
    }
    
    setupKeyboard(){
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR]);
    
    }
    
    
    
    actionDoor(sprite, door){
        this.lastZoneMove = this.game.time.now;
        var nextRoomId = this.currentRoom.doors[door.name];
        var nextRoom;
        for(var i = 0; i < this.rooms.length; i++){
            if(this.rooms[i].id == nextRoomId){
                nextRoom = this.rooms[i];
            }
        }
        if(!nextRoom){
            this.roomDisplay.setText("Error")
            return;
        }
        this.currentRoom = nextRoom;
        this.roomDisplay.setText(this.currentRoom.name);
        this.createRoom(this.currentRoom);
        
        var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, this.currentRoom.name, { font: "25px Arial", fill: "#ffffff", align: "center" });
        text.anchor.set(0.5);
   
        // this.game.add.tween(text).to({y: 0}, 1500, Phaser.Easing.Linear.None, true);    //this to move the text to the top and fades
        this.game.add.tween(text).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
    }
}

export default Main;