export default class Boot extends Phaser.State {
    init(in_rooms) {
        console.log("boot init:"+in_rooms);
        this.in_rooms = in_rooms;
    }

    preload() {
        this.game.load.image("title-screen-800-600", "img/title-screen-800-600.png");
        console.log("boot preload complete");
    }

    create(){
        this.game.state.start("Preload", true, false, this.in_rooms);
    }
}