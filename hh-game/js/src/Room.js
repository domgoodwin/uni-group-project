import Fire from '/js/src/objects/Fire.js';
import Key from '/js/src/objects/Key.js';
import Npc from '/js/src/objects/Npc.js';

const NORTH_DOOR = [343, 50]
const EAST_DOOR = [670, 225]
const SOUTH_DOOR = [343, 522]
const WEST_DOOR = [100, 225]
export default class Room {
    constructor(game, room, player, door){
        this.game = game;
        this.name = name;
        this.doors = [];
        this.player = player;
        this.items = this.game.add.group();
        this.npcs = this.game.add.group();
        this.things = this.game.add.group();
        this.objects = [];
        this.id = room.id;

        this.createRoom = this.createRoom.bind(this);
        this.checkUpdate = this.checkUpdate.bind(this);
        this.clearState = this.clearState.bind(this);
        this.createObject = this.createObject.bind(this);

        this.createRoom(room, door);
    }




    createRoom(room, usedDoor){
        // Todo if room exists in dict then just load
        console.log("Creating room: "+room.id+"/"+door);
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

        if(usedDoor){
            console.log("Moving character: "+usedDoor)
            var x = usedDoor == "north" ? SOUTH_DOOR[0] : usedDoor == "east" ? WEST_DOOR[0] + 100 : usedDoor == "south" ? NORTH_DOOR[0] : EAST_DOOR[0] - 10;
            var y = usedDoor == "north" ? SOUTH_DOOR[1] - 10 : usedDoor == "east" ? WEST_DOOR[1] : usedDoor == "south" ? NORTH_DOOR[1] + 10 : EAST_DOOR[1];
            this.player.sprite.x = x - 25;
            this.player.sprite.y = y + 25; 
        }

    }

    checkUpdate(){
        // Check object collisions
        for(var i = 0; i < this.objects.length; i++){
            var object = this.objects[i];
            this.game.physics.arcade.overlap(this.player.sprite, object.sprite, object.action, null, this);
        }
    }

    clearState(){
        for(var i = 0; i < this.doors.length; i++){
            var door = this.doors[i];
            // door.destroy();
            door.alpha = 0;
        }
        // this.things.destroy(true);
        // this.items.destroy(true);
        // this.npcs.destroy(true);
        // this.things = this.game.add.group();
        // this.items = this.game.add.group();
        // this.npcs = this.game.add.group();
        this.things.alpha = 0;
        this.items.alpha = 0;
        this.npcs.alpha = 0;
        // this.objects=[];
        console.log(this.sprites);
    }

    createObject(object){
        var type = object.type;
        var newObject = null;
        switch(type) {
            case "fire":
                newObject = new Fire(this.game, this.player, 'fire', 'fire-middle', object.x_pos, object.y_pos, this.things);
                break;
            case "clone":
                newObject = new Npc(this.game, this.player, 'clone', 'clone-middle', object.x_pos, object.y_pos, this.npcs);
                break;
            case "mummy":
                newObject = new Npc(this.game, this.player, 'mummy', 'mummy-middle', object.x_pos, object.y_pos, this.npcs);
                break;
            case "key":
                newObject = new Key(this.game, this.player, 'key', 'key-old', object.x_pos, object.y_pos, this.items);
                break;
            default:
                newObject = null;
        }
        if(newObject == null){
            console.log("Object: "+type + " not found")
            return;
        } 
        console.log(this.objects);
        this.objects.push(newObject);
    }

}