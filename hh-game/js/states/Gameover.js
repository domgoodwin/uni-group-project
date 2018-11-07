class Gameover extends Phaser.State {

    create(in_rooms) {
        console.log("GAMEOVER");
        this.in_rooms = in_rooms;
        this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Game Over!", {font: "20px Arial"});
        this.finishedLoadingText = this.game.add.text(this.game.world.centerX+100, this.game.world.centerY+200, "Press Space to restart", { font: "25px Arial", fill: "#ffffff", align: "center" });
        this.restartButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
    }

    update() {
        if(this.restartButton.isDown){
            this.game.state.start("Boot", true, false, this.in_rooms);
        }
    }


}

export default Gameover;