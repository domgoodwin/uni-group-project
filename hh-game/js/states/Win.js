class Win extends Phaser.State {

    create(in_rooms) {
        this.in_rooms = in_rooms; 
        var score = this.game.time.now - this.game.global.startTime;
        this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Congratulations!", {font: "20px Arial"}); 
        this.game.add.text(this.game.world.centerX, this.game.world.centerY+100, "Score: "+score, {font: "20px Arial"}); 
        this.finishedLoadingText = this.game.add.text(this.game.world.centerX-100, this.game.world.centerY+200, "Press Space to play again", { font: "25px Arial", fill: "#ffffff", align: "center" });
        this.restartButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
    }

    update() {
        if(this.restartButton.isDown){
            this.game.state.start("Boot", true, false, this.in_rooms);
        }
    }


}

export default Win;