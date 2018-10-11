# Web gl with Phaser demo

## Installing

Files _should_ be served via a webserver but don't have to be for it to work  
 `cd hh-game`  
`npm install http-server -g`

## Running

If using a web server:  
`http-server`  
Go to [http://localhost:8080](http://localhost:8080)

If using static files:  
Open _index.html_ in your browser

## Overview

1. Page is rendered in the `index.html` page
2. This calls `js/index.js` file which sets up the general game
3. This sets up `States` which are currently: `Preload` and `Main`
4. `Preload` is how you load in images ready to use later and setup before anything is created
5. `Main` is the currently only playable state of the game
6. This has two main functions `Create` and `Update`
    - `Create` is for setting up the game **once** on load
        - This setups up a lot of basic settings, like keyboard keys to monitor and sprites on the screen
        - Most notable it calls `createRoom` which sets up the playable room
    - `Update` is called every _tick_ for things like movements and events. The two main things are:
        - If tracked keyboard keys are pressed, action the intended events (player movement)
        - If two objects overlap, call a function to action that `actionDoor` is a good example of this
7. The `Player` object is used so all player functionality and properties are in one place, examples include:
    - Any time movement keys are detected it calls the player move with the key value so the player can decide how to action that. This also plays animations setup
    - In the future, this can be used for storing references to items and effects too
8. `createRoom` is given a JSON object representing room. This makes the rendering more dynamic and means it can be passed the default room in `Create` but also whenever the player moves room (door collisions or events in the future) its easy to pass the room id with it's JSON

- Using [phaser@2.12](https://phaser.io/download) 
