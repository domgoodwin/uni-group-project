// Test imports
import { expect } from 'chai';
import {readFileSync} from 'fs';

// Phaser imports
import {start} from '/js/index';
const Phaser = require('js/libraries/phaser-2.2.2.js');

describe('Game', () => {
  it('should create a game object', () => {
    // const path = require('path');
    // console.log(path.dirname(require.main.filename));
    const rooms = readFileSync('./layouts/FloorPlan.json', 'utf8')
    const game = start(rooms);
    expect(game).to.not.be.null;
  });
});