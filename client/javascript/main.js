require('preload');

var gamejs = require('gamejs');
var SplashView = require('splash').View;
var game = require('gamestate');

gamejs.ready(function() {
    game.display = gamejs.display.setMode([600, 400]);

    game.loadView(SplashView);
});
