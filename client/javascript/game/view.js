var gamejs = require('gamejs');
var Player = require('game/player').Player;

var player;

exports.View = function(display) {
    player = new Player();

    this.onTick = function() {
        display.clear();
        display.blit((new gamejs.font.Font('30px Sans-serif')).render('DA GAME'));
        //drawBackground();
    };

    this.onEvent = function(event) {};
    return this;
};
