class Escaped extends Phaser.State {

    create(in_rooms) {
        this.in_rooms = in_rooms; 
        this.loadingScreenImage = this.game.add.sprite(this.game.world.centreX, this.game.world.centreY, "border");
        this.loadingScreenImage.anchor.setTo(0);
        var score = this.game.time.now - this.game.global.startTime;
        var mode = this.game.click_count % 3 == 0 ? "Normal" : this.game.click_count % 3 == 1 ? "Hard" : "1HP";
        var random = this.game.random ? "Random" : "Classic";
        var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Congratulations!", {font: "48px Verdana", fill: "#ffffff", align: "center"}); 
        text.anchor.set(0.5);
        text.stroke = "#000000";
        text.strokeThickness = 8;
        var text1 = this.game.add.text(this.game.world.centerX, this.game.world.centerY+100, "You digged a tunnel and escaped!!", {font: "20px Verdana", fill: "#ffffff", align: "center"}); 
        text1.anchor.set(0.5);
        text1.stroke = "#000000";
        text1.strokeThickness = 8;
        var text2 = this.game.add.text(this.game.world.centerX, this.game.world.centerY+100, "Score: "+score, {font: "20px Verdana", fill: "#ffffff", align: "center"}); 
        text2.anchor.set(0.5);
        text2.stroke = "#000000";
        text2.strokeThickness = 8;
        var text3 = this.game.add.text(this.game.world.centerX, this.game.world.centerY+150, "Settings: "+mode+" / "+random, {font: "20px Verdana", fill: "#ffffff", align: "center"}); 
        text3.anchor.set(0.5);
        text3.stroke = "#000000";
        text3.strokeThickness = 8;
        this.finishedLoadingText = this.game.add.text(this.game.world.centerX, this.game.world.centerY+200, "Press Space to play again", {font: "20px Verdana", fill: "#ffffff", align: "center"});
        this.finishedLoadingText.anchor.set(0.5);
        this.finishedLoadingText.stroke = "#000000";
        this.finishedLoadingText.strokeThickness = 8;
        this.restartButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
    }

    update() {
        if(this.restartButton.isDown){
            this.game.state.start("Boot", true, false, this.in_rooms);
        }
    }


}

export default Escaped;
