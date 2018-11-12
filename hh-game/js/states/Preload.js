class Preload extends Phaser.State {

    init(in_rooms) {
        console.log("plinit:"+in_rooms);
        this.in_rooms = in_rooms;
    }

    preload() {

        // Room
        this.game.load.image('room-0', 'img/room-0.png');

        // Player
        this.game.load.spritesheet('player', 'img/player.png', 48, 48);

        // Objects        
        this.game.load.image('door-ns', 'img/wood-ns.png');
        this.game.load.image('door-ew', 'img/wood-ew.png');
        this.game.load.image('candle-1', 'img/candle1.png');
        this.game.load.image('candle-2', 'img/candle2.png');
        this.game.load.spritesheet('fire', 'img/fire-sprite.png', 34, 40);
        this.game.load.image('door-ew', 'img/wood-ew.png');        
        this.game.load.script('fire-filter', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/Fire.js');
        this.game.load.spritesheet('key', 'img/key.png', 40, 12);
        // NPCs
        this.game.load.spritesheet('clone', 'img/player.png', 48, 48);
        this.game.load.spritesheet('mummy', 'img/npc_mummy.png', 37, 45, 18);  
        this.game.load.spritesheet('ghost', 'img/ghost_npc.png', 37, 45, 18)  
    }

    create() {
        this.game.state.start("Main", true, false, this.in_rooms);
    }
}

export default Preload;