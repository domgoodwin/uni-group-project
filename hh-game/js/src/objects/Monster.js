import Object from '/js/src/Object.js'

var MONSTER_PURSUIT = 0;
var MONSTER_IDLE = 1;
var MONSTER_PATROL = 2;

export default class Monster extends Object
{
    constructor(game, player, type, name, x_pos, y_pos, group, speed, boss)
    {
        super(game, player, type, name, x_pos, y_pos, group);

        console.log("NPC: Creating NPC");
        this.speed = speed;        
        this.isBoss = boss;
        this.health = 5;
        this.lastHit = 0;
        this.dead = false;
        this.state = boss ? 0 : game.rnd.integerInRange(0, 2); // Random between 0 and 2 to choose between MONSTER_PURSUIT, MONSTER_IDLE, MONSTER_PATROL
        console.log("NPC: Random int for State Control is ", this.state);

        this.damage = this.damage.bind(this);
        this.remove = this.remove.bind(this);


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

    tick(playArea)
    {
        // Remove if dead
        if(this.health <= 0){
            if(this.isBoss){
                this.game.state.start("Win", true, false, this.game.in_rooms);
            }
            this.remove();
            return;
        }
        // Reset tint after damage
        if(this.game.time.now > this.lastHit){
            this.sprite.tint = 0xFFFFFF;
        }
        if(this.state == MONSTER_PATROL)
        {
            if(this.createdPath == undefined)
            {
                this.createdPath = [];
                var numPoints = this.game.rnd.integerInRange(3, 8);
                for(var i = 0; i < numPoints; i++)
                {
                    var point = new Phaser.Point(this.game.rnd.integerInRange(playArea.x, playArea.x + playArea.width),
                                                this.game.rnd.integerInRange(playArea.y, playArea.y + playArea.height));

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
            var playerPos = this.player.sprite.position;
            this.followPoint(playerPos, playArea);
        }
    }

    action()
    {
        console.log("NPC: Player collision with Monster");
        this.player.damage(1);
    }

    remove()
    {
        if(this.sprite){
            this.sprite.alpha = 0;
            this.sprite.destroy(true);
            this.sprite = null;
        }

    }

    damage(){
        if(this.game.time.now > this.lastHit){
            this.lastHit = this.game.time.now + 1000;
            this.health -= 1;
            this.sprite.tint = 0x000000;
            console.log("DAMAGE HIT: " + this.health)       
        }
    }
}