// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import { remote } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import { greet } from './hello_world/hello_world'; // code authored by you in this project
import env from './env';
import world from './world_data/world';
import textures from './world_data/textures';
import spritesheets from './world_data/spritesheets';
import Pointer from './src/Pointer';
import Player from './src/Player';


console.log('Loaded environment variables:', env);

var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
console.log('The author of this app is:', appDir.read('package.json', 'json').author);

document.addEventListener('DOMContentLoaded', function () {

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'main', { preload: preload, create: create, update: update });

function preload() {

    textures.forEach(elm=>{
        game.load.image(elm.name, elm.location, elm.width, elm.height);
    });

    spritesheets.forEach(elm=>{
        game.load.spritesheet(elm.name, elm.location, elm.width, elm.height);
    });

}

var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

var pointer;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(150, 250, 'ground');
    ledge.body.immovable = true;

    world.forEach(elm=>{
        let plat = platforms.create(elm.x, elm.y, elm.texture);
        plat.body.immovable = true;
        plat.scale.setTo(elm.scaleX, elm.scaleY);
    })

    // The player and its settings
    player = Player(game);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        // star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    

    pointer = Pointer(game, player);
}


function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player.getPlayer(), platforms);
    game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)


    if (game.input.mousePointer.rightButton.isDown)
    {
        pointer.createPointer(game.input.mousePointer);
    }

    if(!pointer.getPointer()){
        player.stopPlayer();
        if (cursors.left.isDown)
        {
            player.moveLeft();
        }
        if (cursors.right.isDown)
        {
            player.moveRight();
        }
        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown)
        {
            player.moveUp();
        }
    
        if (cursors.down.isDown)
        {
            player.moveDown();
        }
    }
    else {
        game.physics.arcade.moveToObject(player.getPlayer(), pointer.getPointer(), 150);
        game.physics.arcade.overlap(player.getPlayer(), pointer.getPointerGroup(), pointer.getToPointer, null, this);
    }
    
}

function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}

});
