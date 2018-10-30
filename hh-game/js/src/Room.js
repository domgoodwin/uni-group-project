export default class Room {
    constructor(game, room){
        this.name = name;
        this.createRoom(room);
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
        this.things.destroy(true);
        this.items.destroy(true);
        this.npcs.destroy(true);
        this.things = this.game.add.group();
        this.items = this.game.add.group();
        this.npcs = this.game.add.group();
        this.objects=[];
        console.log(this.sprites);

    }

}