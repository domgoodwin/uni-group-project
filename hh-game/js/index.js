import Boot from '/js/states/Boot.js';
import Preload from '/js/states/Preload.js';
import Main from '/js/states/Main.js';
import Gameover from '/js/states/Gameover.js';
import Win from '/js/states/Win.js';
import Escaped from '/js/states/Escaped.js';
import Killed from '/js/states/Killed.js';


var game = null;

class Game extends Phaser.Game {

	constructor(in_rooms) {

		super(800, 600, Phaser.AUTO);
		this.in_rooms = in_rooms;
        this.state.add('Boot', Boot, false);
		this.state.add('Preload', Preload, false);
		this.state.add('Main', Main, false);
		this.state.add('Gameover', Gameover, false);
		this.state.add('Win', Win, false);
		this.state.add('Escaped', Escaped, false);
		this.state.add('Killed', Killed, false);
		this.state.start('Boot', true, false, in_rooms);
		this.global = { debug: false };
	}

	setDebug(){
		this.global.debug = this.global.debug ? false : true;
	}
}

export function start(in_rooms){
	game = new Game(in_rooms);
	return game;
}

export function setDebug(){
	game.setDebug();
}
