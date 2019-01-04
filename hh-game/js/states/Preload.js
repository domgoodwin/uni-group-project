class Preload extends Phaser.State {

    init(in_rooms) {
        this.in_rooms = in_rooms;
    }

    preload() {
        // Render loading screen
        this.loadingScreenImage = this.game.add.sprite(this.game.world.centreX, this.game.world.centreY, "title-screen-800-600");
        this.loadingScreenImage.anchor.setTo(0);
        this.loadingText = this.game.add.text(this.game.world.centerX+100, this.game.world.centerY+200, "Loading...", { font: "25px Arial", fill: "#ffffff", align: "center" });

        // Room
        this.game.load.image('room-0', 'img/room-1.png');

        // Player
        this.game.load.spritesheet('player', 'img/player.png', 48, 48);

        // Audio
        this.game.load.audio('ambient-spooky-1', ['audio/bg-audio/PorchCat_-_Moon_Shadow_Grin.mp3', 'audio/bg-audio/PorchCat_-_Moon_Shadow_Grin.ogg']);
        this.game.load.audio('ambient-spooky-2', ["audio/bg-audio/Citizen_X0_-_Ghosts_in_the_wind.mp3", "audio/bg-audio/Citizen_X0_-_Ghosts_in_the_wind.ogg"]);

        // Objects        
        this.game.load.image('door-ns', 'img/wood-ns.png');
        this.game.load.image('door-ew', 'img/wood-ew.png');
        this.game.load.image('candle-1', 'img/candle1.png');
        this.game.load.image('candle-2', 'img/candle2.png');
        this.game.load.image('rock', 'img/rock.png');
        this.game.load.spritesheet('fire', 'img/fire-sprite.png', 34, 40);
        this.game.load.spritesheet('clone', 'img/player.png', 48, 48);
        this.game.load.spritesheet('chest', 'img/chest.png', 32, 32);
        this.game.load.spritesheet('chute', 'img/chute.png');
        // this.game.load.spritesheet('chimney', 'img/chute.png');
        this.game.load.image('door-ew', 'img/wood-ew.png');       
        //this.game.load.image('button-large', 'img/button-large.png');     
        this.game.load.spritesheet('button-large', 'img/button-large.png', 175, 55);    
        this.game.load.script('fire-filter', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/Fire.js');
        this.game.load.spritesheet('key', 'img/key.png', 40, 12);
        this.game.load.spritesheet('blackhole', 'img/circle.png', 100, 100); 
        this.game.load.spritesheet('circle', 'img/circle.png', 100, 100);    
        this.game.load.spritesheet('axe', 'img/pickaxe_axe.png', 32, 64);
        this.game.load.spritesheet('coffin', 'img/coffin.png', 74, 64);
        this.game.load.image('hole', 'img/hole.png');

        // NPCs
        this.game.load.spritesheet('clone', 'img/player.png', 48, 48);
        this.game.load.spritesheet('mummy', 'img/npc_mummy.png', 37, 45, 18);
        this.game.load.image('monster', 'img/monster.png');
        this.game.load.spritesheet('ghost', 'img/ghost.png', 49,57);
    }

    create() {
        this.loadingText.destroy();
        this.finishedLoadingText = this.game.add.text(this.game.world.centerX+100, this.game.world.centerY+200, "Press Space to play", { font: "25px Arial", fill: "#ffffff", align: "center" });
        this.startButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
        this.game.startGame = function(game) {console.log("preloading"); game.state.start("Main", true, false, this.in_rooms);};
        
        this.button = this.game.add.button(580, 50, 'button-large', this.onRandomClick, this, 1, 0);
        this.game.random = false;
        this.button.inputEnabled = true;
        this.button.input.useHandCursor = true;
        this.buttonText = this.game.add.text(595, 65, "Random off", {font: "20px Arial", fill: "#FFFFFF"})

        this.buttonMode = this.game.add.button(580, 100, 'button-large', this.onModeClick, this, 1, 0);
        this.game.mode = 0;
        this.game.click_count = 0;
        this.buttonMode.inputEnabled = true;
        this.buttonMode.input.useHandCursor = true;
        this.buttonTextMode = this.game.add.text(595, 115, "Normal", {font: "20px Arial", fill: "#FFFFFF"})
    }

    onRandomClick() {
        this.game.random = this.game.random ? false : true;
        var text = this.game.random ? "Random on" : "Random off";
        this.buttonText.text = text;
        console.log("Clicked Random")
    }

    onModeClick() {
        this.game.click_count += 1;
        var text_mode = ""

        if(this.game.click_count % 3 == 0){
            text_mode = "Normal";
            this.game.mode = 0;
        } else if(this.game.click_count % 3 == 1){
            text_mode = "Hard";
            this.game.mode = 1;
        }
        else if(this.game.click_count % 3 == 2){
            text_mode = "1 HP"
            this.game.mode = 2;
        }
        else {
            console.log("Error")
        }

        this.buttonTextMode.text = text_mode;
        console.log("Clicked " + text_mode + " Mode")
    }


    update() {
        if(this.startButton.isDown){
            this.game.startGame(this.game);
        }
    }
}

export default Preload;