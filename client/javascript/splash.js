var gamejs = require('gamejs');
var Game = require('game').Game;

exports.Splash = function(display) {

    this.onTick = function() {
        display.clear();
        display.blit(
            (new gamejs.font.Font('30px Sans-serif')).render('Five Stages of Killing(tm)')
        );
    };

    this.onEvent = function(event) {
        switch (event.type) {
            case gamejs.event.MOUSE_DOWN:
                game.loadView(Game);
                break;
        }
    };

    return this;
};
