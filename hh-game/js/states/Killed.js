class Killed extends Phaser.State {

    create(in_rooms) {
        this.loadingScreenImage = this.game.add.sprite(this.game.world.centreX, this.game.world.centreY, "border");
        this.loadingScreenImage.anchor.setTo(0);
        this.in_rooms = in_rooms;
        var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Game Over!", {font: "48px Verdana", fill: "#ffffff", align: "center"});  
        text.anchor.set(0.5);
        text.stroke = "#000000";
        text.strokeThickness = 8;
        var text2 = this.game.add.text(this.game.world.centerX, this.game.world.centerY+100, "You fell into a hidden abyss!", {font: "20px Verdana", fill: "#ffffff", align: "center"});  
        text2.anchor.set(0.5);
        text2.stroke = "#000000";
        text2.strokeThickness = 8;
        var text3 = this.finishedLoadingText = this.game.add.text(this.game.world.centerX, this.game.world.centerY+200, "Press Space to restart", { font: "20px Verdana", fill: "#ffffff", align: "center" });
        text3.anchor.set(0.5);
        text3.stroke = "#000000";
        text3.strokeThickness = 8;
        this.restartButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
    }

    update() {
        if(this.restartButton.isDown){
            this.game.state.start("Boot", true, false, this.in_rooms);
        }
    }


}

export default Killed;
