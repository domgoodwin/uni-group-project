
import Preload from '/js/states/Preload.js';
import Main from '/js/states/Main.js';

class Game extends Phaser.Game {

	constructor(in_rooms) {

		super(800, 600, Phaser.AUTO);
		console.log("inrooms:"+in_rooms);
		this.in_rooms = in_rooms;
		this.state.add('Preload', Preload, false);
		this.state.add('Main', Main, false);

		this.getRandomInt = function(min, max) 
		{
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		this.state.start('Preload', true, false, in_rooms);
	}

}

export default function start(in_rooms){
	new Game(in_rooms);
}
