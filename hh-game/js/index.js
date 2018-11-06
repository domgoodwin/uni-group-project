import Preload from '/js/states/Preload.js';
import Main from '/js/states/Main.js';
import Gameover from '/js/states/Gameover.js';

var game = null;

class Game extends Phaser.Game {

	constructor(in_rooms) {

		super(800, 600, Phaser.AUTO);
		console.log("inrooms:"+in_rooms);
		this.in_rooms = in_rooms;
		this.state.add('Preload', Preload, false);
		this.state.add('Main', Main, false);
		this.state.add('Gameover', Gameover, false);

		this.state.start('Preload', true, false, in_rooms);
		this.global = { debug: false };
	}

	setDebug(){
		this.global.debug = this.global.debug ? false : true;
	}
}

export function start(in_rooms){
	game = new Game(in_rooms);
}

export function setDebug(){
	game.setDebug();
}
