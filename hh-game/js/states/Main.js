import Player from '/js/src/Player.js';
import Fire from '/js/src/objects/Fire.js';


const NORTH_DOOR = [343, 50]
const EAST_DOOR = [670, 225]
const SOUTH_DOOR = [343, 522]
const WEST_DOOR = [100, 225]
const VERSION = "0.12";

class Main extends Phaser.State {

    init(in_rooms){
        this.in_rooms = in_rooms;
    }
    
    create() {
        console.log("Game starting: " + this.in_rooms)
        this.rooms = JSON.parse(this.in_rooms);
        this.debug = true;
        this.VERSION = "v0.1.1"
        this.doors = [];
        this.objects = [];
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
        this.displayText = this.game.add.text(25, 115, "H: "+this.player.health, {font: "20px Arial"});
        this.game.add.text(25, 165, "5/5", {font: "20px Arial"});
        this.currentRoom = this.rooms[0];
        this.roomDisplay = this.game.add.text(720, 30, this.currentRoom.name, {font: "20px Arial"});
        this.createRoom(this.currentRoom);
    
        this.playArea = new Phaser.Rectangle(130, 90, 535, 450);
        this.game.physics.arcade.enable(this.playArea);
    
    
        // Debug
        // game.debug.geom(playArea,'#0fffff');
    }
    
    update() {
        // Check door collisions
        for(var i = 0; i < this.doors.length && this.game.time.now > this.lastZoneMove + 3000; i++){
            var door = this.doors[i];
            this.game.physics.arcade.overlap(this.player.sprite, door, this.actionDoor, null, this);
        }

        // Check object collisions
        for(var i = 0; i < this.objects.length; i++){
            var object = this.objects[i];
            this.game.physics.arcade.overlap(this.player.sprite, object.sprite, object.action, null, this);
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
            this.player.shoot();
        }
    
        // Debug
        if (this.debug){
            this.game.debug.body(this.player.sprite);
            for(var i = 0; i < this.doors.length; i++){
                this.game.debug.body(this.doors[i]);
            }
            for(var i = 0; i < this.objects.length; i++){
                this.game.debug.body(this.objects[i].sprite);
            }

        }

        this.displayText.setText("H: "+this.player.health);
    
    }
    
    
    createRoom(room){
        console.log("Creating room: "+room.id);
        this.clearState();
        for(var door in room.doors){
            // Check if no door destination
            if (! room.doors[door])
                continue;
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
        if(room.objects){
            for(var i = 0; i < room.objects.length; i++) {
                console.log("Trying to create: " + room.objects[i]);
                this.createObject(room.objects[i]);
            }
        }

    }

    clearState(){
        for(var i = 0; i < this.doors.length; i++){
            var door = this.doors[i];
            door.destroy();
        }
        for(var i = 0; i < this.objects.length; i++){
            var object = this.objects[i];
            object.destroy();
        }
        this.objects = [];
        this.doors = [];
    }
    
    setupKeyboard(){
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR]);
    
    }
    
    createObject(object){
        var type = object.type;
        var newObject = null;
        switch(type) {
            case "fire":
                newObject = new Fire(this.game, this.player, 'fire', 'fire-middle', object.x_pos, object.y_pos);
                break;
            case "todo":
                newObject = null;
                break;
            default:
                newObject = null;
        }
        if(newObject == null){
            console.log("Object: "+type + " not found")
            return;
        } 
        this.objects.push(newObject);
        console.log(this.objects);
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
        var x = door.name == "north" ? SOUTH_DOOR[0] : door.name == "east" ? WEST_DOOR[0] + 100 : door.name == "south" ? NORTH_DOOR[0] : EAST_DOOR[0] - 10;
        var y = door.name == "north" ? SOUTH_DOOR[1] - 10 : door.name == "east" ? WEST_DOOR[1] : door.name == "south" ? NORTH_DOOR[1] + 10 : EAST_DOOR[1];
        this.player.sprite.x = x - 25;
        this.player.sprite.y = y + 25;
    
    }


}

export default Main;
