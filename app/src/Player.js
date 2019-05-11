export default function(game){

    var player;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    // player.body.bounce.y = 0.2;
    // player.body.gravity.y = 300;
    // player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);


    const getPlayer = () => {
        return player;
    }

    const stopPlayer = () => {
        player.body.velocity.setTo(0, 0);
        player.animations.stop();
    }

    const moveLeft = () => {
        player.body.velocity.x = -150;
        player.animations.play('left');
    }

    const moveRight = () => {
        player.body.velocity.x = 150;
        player.animations.play('right');
    }

    const moveUp = () => {
        player.body.velocity.y = -150;
    }

    const moveDown = () => {
        player.frame = 4;
        player.body.velocity.y = 150;
    }

    return {
        getPlayer,
        moveDown,
        moveUp,
        moveLeft,
        moveRight,
        stopPlayer,
    };
}
