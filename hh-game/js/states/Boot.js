export default class Boot extends Phaser.State {
    init(in_rooms) {
        if(this.game.in_rooms){
            this.in_rooms = this.game.in_rooms;
        } else {
            this.in_rooms = in_rooms;
        }
    }

    preload() {
        this.game.load.image("title-screen-800-600", "img/title-screen-800-600.png");
    }

    create(){
        console.log("boot create complete");
        this.game.state.start("Preload", true, false, this.in_rooms);
    }
}