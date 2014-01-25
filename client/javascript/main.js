require('preload');

var gamejs = require('gamejs');
var SplashView = require('splash').View;
var state = require('gamestate');

gamejs.ready(function() {
    state.initialize();
    state.loadView(SplashView);
});
