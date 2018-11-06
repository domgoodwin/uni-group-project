import Fire from '/js/src/objects/Fire.js';
import Key from '/js/src/objects/Key.js';
import Npc from '/js/src/objects/Npc.js';
import Chest from '/js/src/objects/Chest.js';
import Rock from '/js/src/objects/Rock.js';
import Circle from '/js/src/objects/Circle.js';

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
        this.room = room;
        this.lastInteraction = 0;
        this.displayedText = 0;

        this.createRoom = this.createRoom.bind(this);
        this.checkUpdate = this.checkUpdate.bind(this);
        this.clearState = this.clearState.bind(this);
        this.createObject = this.createObject.bind(this);
        this.interact = this.interact.bind(this);
        this.render = this.render.bind(this);

        this.createRoom(door);
    }




    createRoom(usedDoor){
        console.log("Creating room: "+this.room.id+"/"+door);
        for(var door in this.room.doors){
            // Check if no door destination
            if (! this.room.doors[door])
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
        if(this.room.objects){
            for(var i = 0; i < this.room.objects.length; i++) {
                console.log("Trying to create: " + this.room.objects[i]);
                this.createObject(this.room.objects[i]);
            }
        }

        this.render(usedDoor);

    }

    checkUpdate(){
        // Check object collisions
        for(var i = 0; i < this.objects.length; i++){
            var object = this.objects[i];
            this.game.physics.arcade.overlap(this.player.sprite, object.sprite, object.action, null, this);
            object.tick();
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
    }

    render(usedDoor){
        this.game.stage.backgroundColor = this.room.floor;

        this.things.alpha = 1;
        this.items.alpha = 1;
        this.npcs.alpha = 1;
        for(var i = 0; i < this.doors.length; i++){
            var door = this.doors[i];
            door.alpha = 1;
        }
        if(usedDoor){
            console.log("Moving character: "+usedDoor)
            var x = usedDoor == "north" ? SOUTH_DOOR[0] : usedDoor == "east" ? WEST_DOOR[0] + 100 : usedDoor == "south" ? NORTH_DOOR[0] : EAST_DOOR[0] - 10;
            var y = usedDoor == "north" ? SOUTH_DOOR[1] - 10 : usedDoor == "east" ? WEST_DOOR[1] : usedDoor == "south" ? NORTH_DOOR[1] + 90 : EAST_DOOR[1];
            this.player.sprite.x = x;
            this.player.sprite.y = y; 
        } else {
            this.player.sprite.x = this.game.world.centerX;
            this.player.sprite.y = this.game.world.centerY;
        }
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
            case "chest":
                newObject = new Chest(this.game, this.player, 'chest', 'chest-normal', object.x_pos, object.y_pos, this.things, true);
                break;
            case "key":
                newObject = new Key(this.game, this.player, 'key', 'key-old', object.x_pos, object.y_pos, this.items);
                break;
            case "buff":
                newObject = new Circle(this.game, this.player, 'circle', 'str-buff', object.x_pos, object.y_pos, this.things);
                break;
            case "rock":
                newObject = new Rock(this.game, this.player, 'rock', 'basement-rock', object.x_pos, object.y_pos, this.things, this);
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


    showText(textToDisplay){
        if(this.displayedText >= this.game.time.now){
            return;
        }
        var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, textToDisplay, { font: "25px Arial", fill: "#ffffff", align: "center" });
        text.anchor.set(0.5);
        text.stroke = "#000000";
        text.strokeThickness = 8;
        // this.game.add.tween(text).to({y: 0}, 1500, Phaser.Easing.Linear.None, true);    //this to move the text to the top and fades
        this.game.add.tween(text).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
        this.displayedText = this.game.time.now + 2000;
    }

    interact(key){
        for(var i = 0; i < this.objects.length; i++){
            var object = this.objects[i];
            object.interact(key, this);
        }
        // TODO: make this more generic, having the object part of the player?
        if(this.player.state != null && key == "space" && this.lastInteraction < this.game.time.now){
            console.log("trying to release: " + this.player.state)
            this.player.state.release(this);
        }
    }

}