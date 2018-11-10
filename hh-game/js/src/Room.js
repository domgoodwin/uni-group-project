import Fire from '/js/src/objects/Fire.js';
import Key from '/js/src/objects/Key.js';
//import Npc from '/js/src/objects/Npc.js';
import Chest from '/js/src/objects/Chest.js';
import Chute from '/js/src/objects/Chute.js';
import Chimney from '/js/src/objects/Chimney.js';
import Rock from '/js/src/objects/Rock.js';
import Circle from '/js/src/objects/Circle.js';
import Axe from '/js/src/objects/Axe.js';
import Monster from '/js/src/objects/Monster.js';

const NORTH_DOOR = [343, 50]
const EAST_DOOR = [670, 225]
const SOUTH_DOOR = [343, 522]
const WEST_DOOR = [100, 225]
export default class Room {
    constructor(game, room, player, door, playArea){
        this.game = game;
        this.name = room.name;
        this.playArea = playArea;
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
        this.textToShow = "";

        this.createRoom = this.createRoom.bind(this);
        this.checkUpdate = this.checkUpdate.bind(this);
        this.clearState = this.clearState.bind(this);
        this.createObject = this.createObject.bind(this);
        this.interact = this.interact.bind(this);
        this.render = this.render.bind(this);
        this.showText = this.showText.bind(this);


        this.createRoom(door);
    }

    // Creates room object for first time, setting up doors
    createRoom(usedDoor){
        console.log("Creating room: "+this.room.id+"/"+door);
        for(var door in this.room.doors){
            if (door != "extra"){
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
            
        }
        if(this.room.objects){
            for(var i = 0; i < this.room.objects.length; i++) {
                console.log("Trying to create: " + this.room.objects[i]);
                this.createObject(this.room.objects[i]);
            }
        }

        this.render(usedDoor);

    }

    // Used in the Update loop, checks for any object collisions within room
    checkUpdate(){
        // Check object collisions
        for(var i = 0; i < this.objects.length; i++){
            var object = this.objects[i];
            this.game.physics.arcade.overlap(this.player.sprite, object.sprite, object.action, null, this);
            object.tick();
        }
        for(var i = 0; i < this.npcs.length; i++){
            var npc = this.npcs[i];
            object.update(this.playArea);
        }
    }

    // Used when changing room to hide a Room object. 
    // Hides because state is saved and more efficient
    clearState(){
        for(var i = 0; i < this.doors.length; i++){
            var door = this.doors[i];
            door.alpha = 0;
        }
        this.things.alpha = 0;
        this.items.alpha = 0;
        this.npcs.alpha = 0;
    }

    // Used to show a room object on screen, even if previously hidden
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

        this.game.musicPlayer.playMusicForRoom(this.room);
    }

    // Creates an object in the room, switch between the object types
    createObject(object){
        var type = object.type;
        var newObject = null;
        switch(type) {
            case "fire":
                newObject = new Fire(this.game, this.player, 'fire', 'fire-middle', object.x_pos, object.y_pos, this.things);
                break;
            case "mummy":
                newObject = new Npc(this.game, this.player, 'mummy', 'mummy-middle', object.x_pos, object.y_pos, this.npcs);
                break;
            case "chest":
                newObject = new Chest(this.game, this.player, 'chest', 'chest-normal', object.x_pos, object.y_pos, this.things, true);
                break;
            case "chute":
                newObject = new Chute(this.game, this.player, 'chute', 'chute-normal', object.x_pos, object.y_pos, this.things, true);
                break;
            case "chinmey":
                newObject = new Chimney(this.game, this.player, 'chimney', 'chimney-normal', object.x_pos, object.y_pos, this.things, true);
                break;
            case "key":
                newObject = new Key(this.game, this.player, 'key', 'key-old', object.x_pos, object.y_pos, this.items);
                break;
            case "buff":
                newObject = new Circle(this.game, this.player, 'circle', object.effect+'-buff', object.x_pos, object.y_pos, this.things, object.effect);
                break;
            case "rock":
                newObject = new Rock(this.game, this.player, 'rock', 'basement-rock', object.x_pos, object.y_pos, this.things, this);
                break;
            case "pickaxe":
                newObject = new Axe(this.game, this.player, 'axe', 'pickaxe', object.x_pos, object.y_pos, this.items, this, true);
                break;
            case "axe":
                newObject = new Axe(this.game, this.player, 'axe', 'axe', object.x_pos, object.y_pos, this.items, this, false);
                break;
            case "monster":
                newObject = new Monster(this.game, this.player, 'monster', object.name, object.x_pos, object.y_pos, this.npcs, 370);
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

    // Shows text in the screen somwewhere and then fades
    showText(textToDisplay, pos){
        var top = 0;
        if(pos == "top"){
            top = -200;
        }
        var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY+top, textToDisplay, { font: "25px Arial", fill: "#ffffff", align: "center" });
        text.anchor.set(0.5);
        text.stroke = "#000000";
        text.strokeThickness = 8;
        if(pos == "centre"){
            this.game.add.tween(text).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
        } else if (pos == "top"){
            this.game.add.tween(text).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
        } else {
            this.game.add.tween(text).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
        }
        this.displayedText = this.game.time.now + 2000;
        if(this.textToShow == textToDisplay){
            this.textToShow = "";
        }
    }

    // Used to check user interaction, key=keyboard button
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
