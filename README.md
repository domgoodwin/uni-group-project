# University - Group Project - Haunted House: The Game

Haunted House: The Game is a browser based adventure horror game that places the player inside a creepy haunted house. Their main goal is to stay alive and find the way out. As they move from room to room they will encounter enemies, items and mini-games.

## Links

[Dev Branch](http://relaxed-group-project-dev.s3-website.eu-west-2.amazonaws.com/)
[Master Branch](http://relaxed-group-project.s3-website.eu-west-2.amazonaws.com/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

A web browser capable of utilising the HTML Canvas element:

| Browser        | Version Required |
| :------------- |:----------------:|
| Chrome         | 4.0 |
| Firefox        | 2.0 |
| Edge           | 9.0 |
| Opera          | 9.0 |
| Safari         | 3.1 |

A text editor of your choice

### Installing

A step by step series of examples that tell you how to get a development environment up and running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [HTML5](https://www.w3schools.com/html/default.asp) - // Description
* [Javascript](https://www.w3schools.com/js/default.asp) - // Description
* [CSS](https://www.w3schools.com/css/default.asp) - // Description
* [Phaser.io](https://phaser.io/) - Javascript Game Framework for web and mobile
* [SQL](https://www.w3schools.com/sql/default.asp) - // Description
* [Java](https://www.java.com/en/download/faq/develop.xml) - // Description

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Group 5 / Team Relaxed**  - [Team Website](www.google.co.uk)

See the full list of individual [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is covered under the educational and fair-usage licenses applicable to university produced project work.

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc

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
