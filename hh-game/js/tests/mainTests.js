// Test imports
import {start} from '../index.js';

var rooms = `[
  {
      "id": "entrance",
      "name": "Entrance",
      "floor": "#FFFFFF",
      "music": "ambient-spooky-1",
      "locked": false,
      "doors": {
          "north": "hall",
          "east": null,
          "south": null,
          "west": null
      },
      "objects": [
          {
              "name": "pickaxe",
              "type": "pickaxe",
              "x_pos": 600,
              "y_pos": 300
          }
      ]
  }
]`;

var game = start(rooms);
var wait = ms => new Promise((r, j)=>setTimeout(r, ms))
describe('Game', function(){
  it('should create a game object', function(done){
    chai.expect(game).to.not.be.null;
    done()
  });
  it('should start in Boot state', function(done){
    console.log("Checking state")
    chai.expect(game.state.current).to.equal('Boot');
    done()
  });
  it('should then go to Preload', function(){
    // var promise = until(function () { game.state.current == 'Preload' })
    var promise = wait(3000);
    return promise.then(function(){
      chai.expect(game.state.current).to.equal('Preload');
    })
  });
  it('should go to Main on Space press', function(){
    // var promise = until(function () { game.state.current == 'Preload' })
    var promise = wait(1000);
    game.startGame(game);
    var promise = wait(2500);
    return promise.then(function(){
      chai.expect(game.state.current).to.equal('Main');
    })
  });
});

describe('Sprites', function(){
  it('player should exist in the game object', function(done){
    console.log(game.player);
    chai.expect(game.player).to.not.be.an('undefined')
    done();
  });
  it('should exist in the game object', function(done){
    console.log(game.player);
    chai.expect(game.player).to.not.be.an('undefined')
    done();
  });
});

describe('Room', function(){
  it('should be created', function(done){
    chai.expect(game.room.name).to.equal('Entrance');
    done();
  });
});