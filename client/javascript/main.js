game = (function() {
    var gamejs = require('gamejs');
    var SplashView = require('view/splashView').SplashView;

    gamejs.preload([]);

    var game = {
        display: null,

        currentview: null,

        loadView: function(View) {
            game.currentView = new View(game.display);
            gamejs.onEvent(game.currentView.onEvent);
            gamejs.onTick(game.currentView.onTick);
        }
    };

    gamejs.ready(function() {
        game.display = gamejs.display.setMode([600, 400]);

        game.loadView(SplashView);
    });

    return game;
}());
