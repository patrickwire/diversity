var gamejs = require('gamejs');
var LobbyView = require('lobby').View;
var game = require('gamestate');
var constants =require('constants');

exports.View = function(display,realdisplay) {

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
        realdisplay.clear();
        //realdisplay.blit(display,[0,0],new gamejs.Rect([0,0], [992, 992]));
        var image = gamejs.image.load(constants.graphics.splash);
        var surface = new gamejs.Surface(600, 360);
        surface.blit(image, [0, 0]);
        realdisplay.blit(surface, [0,0]);
    };

    this.onEvent = function(event) {
    };
};
