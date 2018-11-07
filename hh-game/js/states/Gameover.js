class Gameover extends Phaser.State {

    create() {
        console.log("GAMEOVER");
        this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Game Over!", {font: "20px Arial"});
    }
}

export default Gameover;