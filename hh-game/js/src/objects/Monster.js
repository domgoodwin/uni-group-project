import Object from '/js/src/Object.js'

var MONSTER_PURSUIT = 0;
var MONSTER_IDLE = 1;
var MONSTER_PATROL = 2;

export default class Monster extends Object
{
    constructor(game, player, type, name, x_pos, y_pos, group, speed)
    {
        super(game, player, type, name, x_pos, y_pos, group);

        console.log("NPC: Creating NPC");
        this.speed = speed;        
        this.state = game.getRandomInt(0, 2); // Random between 0 and 2 to choose between MONSTER_PURSUIT, MONSTER_IDLE, MONSTER_PATROL
        console.log("NPC: Random int for State Control is ", this.state);
    }

    followPoint(p, playArea)
    {
        var myPos = this.sprite.position;
        var dir = Phaser.Point.subtract(p, myPos);

        dir.normalize();

        var dx = dir.x * 0.32 * this.speed;
        var dy = dir.y * 0.32 * this.speed;

        if(playArea.contains(this.sprite.x + dx, this.sprite.y + dy))
        {
            this.sprite.body.velocity.x = dx;
            this.sprite.body.velocity.y = dy;
        }
    }

    update(playArea)
    {
        if(this.state == MONSTER_PATROL)
        {
            console.log("NPC: State is Patrol");
            if(this.createdPath == undefined)
            {
                this.createdPath = [];
                var numPoints = this.game.getRandomInt(3, 8);
                for(var i = 0; i < numPoints; i++)
                {
                    var point = new Phaser.Point(this.game.getRandomInt(playArea.x, playArea.x + playArea.width),
                                                this.game.getRandomInt(playArea.y, playArea.y + playArea.height));

                    this.createdPath.push(point);
                }

                this.currentPointIndex = 0;
            }

            this.followPoint(this.createdPath[this.currentPointIndex], playArea);
            var myPos = this.sprite.position;
            var dir = Phaser.Point.subtract(this.createdPath[this.currentPointIndex], myPos);

            if(dir.getMagnitude() < 2)
            {
                this.currentPointIndex++;
                if(this.currentPointIndex >= this.createdPath.length)
                {
                    this.currentPointIndex = 0;
                }
            }
        }
        else if(this.state == MONSTER_PURSUIT)
        {
            console.log("NPC: State is Pursuit");
            var playerPos = this.player.sprite.position;
            this.followPoint(playerPos, playArea);
        }
    }    

    destroy()
    {
        this.sprite.destroy(true);
        this.sprite = null;
    }
}