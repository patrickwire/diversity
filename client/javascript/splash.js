var gamejs = require('gamejs');
var LobbyView = require('lobby').View;
var game = require('gamestate');

exports.View = function(display) {

    var timedOut = false;

    setTimeout(function() {timedOut = true;}, 2000);

    this.onTick = function() {
        if (timedOut) {
            game.loadView(LobbyView);
        }

        display.clear();
        display.blit(
            (new gamejs.font.Font('30px Sans-serif')).render('Five Stages of Killing(tm)')
        );
    };

    this.onEvent = function(event) {
    };
};
